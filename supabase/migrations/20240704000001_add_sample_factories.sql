-- Add sample factories
INSERT INTO public.factories (id, name, location, min_order_quantity, rating, image, description, specialties, status, created_at)
VALUES 
  ('1', 'Casablanca Garments', 'Casablanca', 100, 4.8, 'https://images.unsplash.com/photo-1581669600020-77e86e5f5d9a?w=800&q=80', 'Premium garment manufacturer specializing in high-quality clothing production with over 15 years of experience.', ARRAY['T-shirts', 'Dresses', 'Activewear'], 'approved', NOW()),
  ('2', 'Marrakech Textiles', 'Marrakech', 50, 4.5, 'https://images.unsplash.com/photo-1623625434462-e5e42318ae49?w=800&q=80', 'Specializing in traditional and modern textile production with sustainable practices.', ARRAY['Traditional clothing', 'Casual wear', 'Accessories'], 'approved', NOW()),
  ('3', 'Tangier Fashion', 'Tangier', 200, 4.7, 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80', 'Full-service garment production facility with state-of-the-art equipment and skilled craftspeople.', ARRAY['Denim', 'Outerwear', 'Sportswear'], 'approved', NOW())
ON CONFLICT (id) DO NOTHING;