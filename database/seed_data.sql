-- Seed Data

-- 1. Users
-- Password is 'admin123' hashed with bcrypt (example hash, in real app, use the python script to generate)
-- Note: The hash below is for 'admin123' with cost 12
INSERT INTO accounts_customuser (email, password, full_name, role, status) VALUES 
('admin@securepulse.local', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Admin User', 'admin', 'active');

-- 2. Assets
INSERT INTO inventory_asset (asset_name, hostname, ip_address, asset_type, criticality, environment) VALUES
('Primary Web Server', 'web01.prod', '192.168.1.10', 'web-server', 'high', 'production'),
('User Database', 'db01.prod', '192.168.1.20', 'database', 'critical', 'production'),
('Dev Workstation', 'dev-01.local', '10.0.0.50', 'workstation', 'low', 'dev');

-- 3. System Settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('alert_retention_days', '90', 'Number of days to keep alerts in the database'),
('min_alert_level', '3', 'Minimum Wazuh alert level to ingest'),
('app_name', 'SecurePulse', 'Application Name');
