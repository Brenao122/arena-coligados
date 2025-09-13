-- Create secure RPC function to get current user's roles
-- This function uses SECURITY DEFINER to bypass RLS while maintaining security

CREATE OR REPLACE FUNCTION get_my_roles()
RETURNS TABLE(role text, user_id uuid, email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return roles for the authenticated user
  RETURN QUERY
  SELECT 
    ur.role::text,
    ur.user_id,
    p.email::text
  FROM user_roles ur
  JOIN profiles p ON p.id = ur.user_id
  WHERE ur.user_id = auth.uid();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_my_roles() TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION get_my_roles() IS 'Securely returns the current authenticated user roles without exposing other users data';
