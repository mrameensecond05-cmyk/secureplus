-- SecurePulse Database Schema

-- =============================================
-- 1. Users & Authentication
-- =============================================
CREATE TABLE IF NOT EXISTS accounts_customuser (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    role ENUM('admin', 'user') DEFAULT 'user',
    status ENUM('active', 'disabled') DEFAULT 'active',
    failed_login_attempts INT DEFAULT 0,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth_audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(50), -- LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, PASSWORD_RESET
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES accounts_customuser(id) ON DELETE SET NULL
);

-- =============================================
-- 2. Asset Management
-- =============================================
CREATE TABLE IF NOT EXISTS inventory_asset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_name VARCHAR(255) NOT NULL,
    hostname VARCHAR(255),
    ip_address VARCHAR(45),
    mac_address VARCHAR(17),
    asset_type ENUM('web-server', 'database', 'vm', 'workstation', 'network-device', 'other') DEFAULT 'other',
    criticality ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    environment ENUM('lab', 'dev', 'staging', 'production') DEFAULT 'production',
    owner_id INT,
    tags JSON, -- Stores array of tags
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES accounts_customuser(id) ON DELETE SET NULL
);

-- =============================================
-- 3. Wazuh Agents
-- =============================================
CREATE TABLE IF NOT EXISTS inventory_agent (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT,
    wazuh_agent_id VARCHAR(50) UNIQUE,
    status ENUM('active', 'disconnected', 'never_connected') DEFAULT 'never_connected',
    version VARCHAR(50),
    os_name VARCHAR(100),
    os_version VARCHAR(50),
    last_keepalive TIMESTAMP NULL,
    last_seen TIMESTAMP NULL,
    FOREIGN KEY (asset_id) REFERENCES inventory_asset(id) ON DELETE CASCADE
);

-- =============================================
-- 4. Alerts (SOC)
-- =============================================
CREATE TABLE IF NOT EXISTS soc_alertreference (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wazuh_id VARCHAR(255) UNIQUE, -- Wazuh alert ID
    rule_id INT,
    level INT, -- Severity 0-16
    timestamp TIMESTAMP,
    agent_id VARCHAR(50),
    agent_name VARCHAR(255),
    manager_name VARCHAR(255),
    message TEXT,
    full_log TEXT,
    mitre_tactic VARCHAR(255),
    mitre_technique VARCHAR(255),
    source_ip VARCHAR(45),
    destination_ip VARCHAR(45),
    data JSON, -- Store full JSON blob if needed
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by_id INT,
    acknowledged_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (acknowledged_by_id) REFERENCES accounts_customuser(id) ON DELETE SET NULL
);

-- =============================================
-- 5. Incidents
-- =============================================
CREATE TABLE IF NOT EXISTS soc_incident (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_number VARCHAR(50) UNIQUE, -- INC-YYYY-NNNN
    title VARCHAR(255),
    description TEXT,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    created_by_id INT,
    assigned_to_id INT,
    resolution_notes TEXT,
    closed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_id) REFERENCES accounts_customuser(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to_id) REFERENCES accounts_customuser(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS soc_incident_alert (
    incident_id INT,
    alert_id INT,
    PRIMARY KEY (incident_id, alert_id),
    FOREIGN KEY (incident_id) REFERENCES soc_incident(id) ON DELETE CASCADE,
    FOREIGN KEY (alert_id) REFERENCES soc_alertreference(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS soc_incident_comment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT,
    user_id INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES soc_incident(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES accounts_customuser(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS soc_incident_attachment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT,
    user_id INT,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_type VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES soc_incident(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES accounts_customuser(id) ON DELETE SET NULL
);

-- =============================================
-- 6. Reports
-- =============================================
CREATE TABLE IF NOT EXISTS reports_report (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    report_type ENUM('daily', 'weekly', 'monthly', 'custom') DEFAULT 'custom',
    format ENUM('pdf', 'csv', 'json') DEFAULT 'pdf',
    status ENUM('pending', 'generating', 'completed', 'failed') DEFAULT 'pending',
    file_path VARCHAR(500),
    generated_by_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generated_by_id) REFERENCES accounts_customuser(id) ON DELETE SET NULL
);

-- =============================================
-- 7. System Settings
-- =============================================
CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE,
    setting_value TEXT,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_alert_timestamp ON soc_alertreference(timestamp);
CREATE INDEX idx_alert_level ON soc_alertreference(level);
CREATE INDEX idx_incident_status ON soc_incident(status);
CREATE INDEX idx_audit_user ON auth_audit_log(user_id);
