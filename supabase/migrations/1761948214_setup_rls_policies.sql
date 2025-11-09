-- Migration: setup_rls_policies
-- Created at: 1761948214

-- Enable RLS on tables
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for contact_messages
CREATE POLICY "Allow contact message inserts" ON contact_messages
FOR INSERT 
WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow contact message selects" ON contact_messages
FOR SELECT 
USING (auth.role() IN ('anon', 'service_role'));

-- Create RLS policies for appointment_requests  
CREATE POLICY "Allow appointment request inserts" ON appointment_requests
FOR INSERT 
WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow appointment request selects" ON appointment_requests
FOR SELECT 
USING (auth.role() IN ('anon', 'service_role'));;