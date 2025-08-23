-- Add category_reviews table
CREATE TABLE IF NOT EXISTS category_reviews (
  id SERIAL PRIMARY KEY,
  category_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category_id, user_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_category_reviews_category_id ON category_reviews(category_id);
CREATE INDEX IF NOT EXISTS idx_category_reviews_user_id ON category_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_category_reviews_status ON category_reviews(status);
CREATE INDEX IF NOT EXISTS idx_category_reviews_created_at ON category_reviews(created_at);

-- Add product_image_submissions table
CREATE TABLE IF NOT EXISTS product_image_submissions (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  cloudinary_public_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, user_id)
);

-- Add indexes for product image submissions
CREATE INDEX IF NOT EXISTS idx_product_image_submissions_product_id ON product_image_submissions(product_id);
CREATE INDEX IF NOT EXISTS idx_product_image_submissions_user_id ON product_image_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_product_image_submissions_status ON product_image_submissions(status);
CREATE INDEX IF NOT EXISTS idx_product_image_submissions_created_at ON product_image_submissions(created_at);
