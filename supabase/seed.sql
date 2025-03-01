-- Insert sample users into auth.users
-- Note: Passwords are hashed, these users will have password: 'password123'
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  ('d0fc4c64-a3d6-4d97-9341-07de24439bb1', 'john@example.com', '$2a$10$RgZM5fXAZrX.pPR3jPzwrOQq0fK3QZ0L4Z1Z1Z1Z1Z1Z1Z1Z1Z', NOW(), NOW(), NOW()),
  ('d0fc4c64-a3d6-4d97-9341-07de24439bb2', 'sarah@example.com', '$2a$10$RgZM5fXAZrX.pPR3jPzwrOQq0fK3QZ0L4Z1Z1Z1Z1Z1Z1Z1Z1Z', NOW(), NOW(), NOW()),
  ('d0fc4c64-a3d6-4d97-9341-07de24439bb3', 'mike@example.com', '$2a$10$RgZM5fXAZrX.pPR3jPzwrOQq0fK3QZ0L4Z1Z1Z1Z1Z1Z1Z1Z1Z', NOW(), NOW(), NOW());

-- Insert profiles
INSERT INTO profiles (id, username, full_name, bio, location, created_at, updated_at)
VALUES
  ('d0fc4c64-a3d6-4d97-9341-07de24439bb1', 'johndoe', 'John Doe', 'Professional photographer with 10 years of experience', 'New York, NY', NOW(), NOW()),
  ('d0fc4c64-a3d6-4d97-9341-07de24439bb2', 'sarahsmith', 'Sarah Smith', 'Digital artist and graphic designer', 'Los Angeles, CA', NOW(), NOW()),
  ('d0fc4c64-a3d6-4d97-9341-07de24439bb3', 'mikeross', 'Mike Ross', 'Web developer and UI/UX designer', 'Chicago, IL', NOW(), NOW());

-- Insert main categories
INSERT INTO categories (id, name, slug, parent_id, created_at)
VALUES
  ('c0fc4c64-a3d6-4d97-9341-07de24439bb1', 'Graphics & Design', 'graphics-design', NULL, NOW()),
  ('c0fc4c64-a3d6-4d97-9341-07de24439bb2', 'Digital Marketing', 'digital-marketing', NULL, NOW()),
  ('c0fc4c64-a3d6-4d97-9341-07de24439bb3', 'Programming & Tech', 'programming-tech', NULL, NOW());

-- Insert subgroups for Graphics & Design
INSERT INTO categories (id, name, slug, parent_id, created_at)
VALUES
  ('c1fc4c64-a3d6-4d97-9341-07de24439bb1', 'Logo & Brand Identity', 'logo-brand-identity', 'c0fc4c64-a3d6-4d97-9341-07de24439bb1', NOW()),
  ('c1fc4c64-a3d6-4d97-9341-07de24439bb2', 'Web & App Design', 'web-app-design', 'c0fc4c64-a3d6-4d97-9341-07de24439bb1', NOW()),
  ('c1fc4c64-a3d6-4d97-9341-07de24439bb3', 'Art & Illustration', 'art-illustration', 'c0fc4c64-a3d6-4d97-9341-07de24439bb1', NOW());

-- Insert subcategories for Logo & Brand Identity
INSERT INTO categories (id, name, slug, parent_id, created_at)
VALUES
  ('c2fc4c64-a3d6-4d97-9341-07de24439bb1', 'Logo Design', 'logo-design', 'c1fc4c64-a3d6-4d97-9341-07de24439bb1', NOW()),
  ('c2fc4c64-a3d6-4d97-9341-07de24439bb2', 'Brand Style Guides', 'brand-style-guides', 'c1fc4c64-a3d6-4d97-9341-07de24439bb1', NOW()),
  ('c2fc4c64-a3d6-4d97-9341-07de24439bb3', 'Business Cards', 'business-cards', 'c1fc4c64-a3d6-4d97-9341-07de24439bb1', NOW());

-- Insert sample listings
INSERT INTO listings (id, title, description, price, category_id, seller_id, condition, location, images, created_at, updated_at)
VALUES
  (
    'l0fc4c64-a3d6-4d97-9341-07de24439bb1',
    'Professional Logo Design',
    'I will create a modern and unique logo for your business. Package includes unlimited revisions, source files, and quick delivery.',
    299.99,
    'c2fc4c64-a3d6-4d97-9341-07de24439bb1',
    'd0fc4c64-a3d6-4d97-9341-07de24439bb2',
    'New',
    'Los Angeles, CA',
    ARRAY['https://picsum.photos/800/600?random=1', 'https://picsum.photos/800/600?random=2'],
    NOW(),
    NOW()
  ),
  (
    'l0fc4c64-a3d6-4d97-9341-07de24439bb2',
    'Complete Brand Identity Package',
    'Full brand identity package including logo, business cards, letterhead, and brand guidelines. Perfect for new businesses.',
    599.99,
    'c2fc4c64-a3d6-4d97-9341-07de24439bb2',
    'd0fc4c64-a3d6-4d97-9341-07de24439bb1',
    'New',
    'New York, NY',
    ARRAY['https://picsum.photos/800/600?random=3', 'https://picsum.photos/800/600?random=4'],
    NOW(),
    NOW()
  ),
  (
    'l0fc4c64-a3d6-4d97-9341-07de24439bb3',
    'Modern Business Card Design',
    'Custom business card design with modern and minimal style. Includes print-ready files and unlimited revisions.',
    99.99,
    'c2fc4c64-a3d6-4d97-9341-07de24439bb3',
    'd0fc4c64-a3d6-4d97-9341-07de24439bb3',
    'New',
    'Chicago, IL',
    ARRAY['https://picsum.photos/800/600?random=5', 'https://picsum.photos/800/600?random=6'],
    NOW(),
    NOW()
  );

-- Insert sample reviews
INSERT INTO reviews (id, listing_id, reviewer_id, rating, comment, helpful_count, created_at)
VALUES
  (
    'r0fc4c64-a3d6-4d97-9341-07de24439bb1',
    'l0fc4c64-a3d6-4d97-9341-07de24439bb1',
    'd0fc4c64-a3d6-4d97-9341-07de24439bb1',
    5,
    'Excellent work! The logo design was perfect and exactly what I needed. Great communication throughout the process.',
    12,
    NOW()
  ),
  (
    'r0fc4c64-a3d6-4d97-9341-07de24439bb2',
    'l0fc4c64-a3d6-4d97-9341-07de24439bb2',
    'd0fc4c64-a3d6-4d97-9341-07de24439bb2',
    4,
    'Very professional service. The brand identity package was comprehensive and well-designed.',
    8,
    NOW()
  ),
  (
    'r0fc4c64-a3d6-4d97-9341-07de24439bb3',
    'l0fc4c64-a3d6-4d97-9341-07de24439bb3',
    'd0fc4c64-a3d6-4d97-9341-07de24439bb3',
    5,
    'Fast delivery and great design! The business cards look amazing.',
    15,
    NOW()
  );

