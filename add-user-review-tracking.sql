-- Add review and rating count tracking to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_points_earned INTEGER DEFAULT 0;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_review_count ON users(review_count DESC);
CREATE INDEX IF NOT EXISTS idx_users_rating_count ON users(rating_count DESC);
CREATE INDEX IF NOT EXISTS idx_users_total_points ON users(total_points_earned DESC);

-- Update existing users with their current review/rating counts
UPDATE users 
SET 
  review_count = (
    SELECT COUNT(*) 
    FROM product_reviews 
    WHERE product_reviews.user_id = users.id 
    AND product_reviews.status = 'approved'
  ),
  rating_count = (
    SELECT COUNT(*) 
    FROM product_reviews 
    WHERE product_reviews.user_id = users.id 
    AND product_reviews.rating IS NOT NULL
    AND product_reviews.status = 'approved'
  );

-- Create trigger to automatically update user review/rating counts
CREATE OR REPLACE FUNCTION update_user_review_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users 
    SET 
      review_count = review_count + 1,
      rating_count = rating_count + CASE WHEN NEW.rating IS NOT NULL THEN 1 ELSE 0 END
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status changes
    IF OLD.status != NEW.status THEN
      IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        UPDATE users 
        SET 
          review_count = review_count + 1,
          rating_count = rating_count + CASE WHEN NEW.rating IS NOT NULL THEN 1 ELSE 0 END
        WHERE id = NEW.user_id;
      ELSIF OLD.status = 'approved' AND NEW.status != 'approved' THEN
        UPDATE users 
        SET 
          review_count = review_count - 1,
          rating_count = rating_count - CASE WHEN OLD.rating IS NOT NULL THEN 1 ELSE 0 END
        WHERE id = OLD.user_id;
      END IF;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE users 
    SET 
      review_count = review_count - 1,
      rating_count = rating_count - CASE WHEN OLD.rating IS NOT NULL THEN 1 ELSE 0 END
    WHERE id = OLD.user_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_user_review_counts ON product_reviews;
CREATE TRIGGER trigger_update_user_review_counts
  AFTER INSERT OR UPDATE OR DELETE ON product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_user_review_counts(); 