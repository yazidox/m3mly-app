-- Update your user to have admin role
UPDATE users
SET role = 'admin'
WHERE id = auth.uid();
