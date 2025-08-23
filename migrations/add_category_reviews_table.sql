-- Add category_reviews table
CREATE TABLE IF NOT EXISTS category_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, user_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_category_reviews_category_id ON category_reviews(category_id);
CREATE INDEX IF NOT EXISTS idx_category_reviews_user_id ON category_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_category_reviews_status ON category_reviews(status);
CREATE INDEX IF NOT EXISTS idx_category_reviews_created_at ON category_reviews(created_at);

-- Add product_image_submissions table
CREATE TABLE IF NOT EXISTS product_image_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  cloudinary_public_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- Add indexes for product image submissions
CREATE INDEX IF NOT EXISTS idx_product_image_submissions_product_id ON product_image_submissions(product_id);
CREATE INDEX IF NOT EXISTS idx_product_image_submissions_user_id ON product_image_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_product_image_submissions_status ON product_image_submissions(status);
CREATE INDEX IF NOT EXISTS idx_product_image_submissions_created_at ON product_image_submissions(created_at);

-- Create trigger for updated_at on category_reviews
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_category_reviews_updated_at ON category_reviews;
CREATE TRIGGER update_category_reviews_updated_at 
BEFORE UPDATE ON category_reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for updated_at on product_image_submissions
DROP TRIGGER IF EXISTS update_product_image_submissions_updated_at ON product_image_submissions;
CREATE TRIGGER update_product_image_submissions_updated_at 
BEFORE UPDATE ON product_image_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
