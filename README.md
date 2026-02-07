Wazuh Components & Installation Guide
1. Server-Side Components (Already Installed)
The following components are already included in your Docker deployment (
docker-compose.yml
) and run on the central server:

Component	Container Name	Purpose
Wazuh Manager	securepulse-wazuh-manager	Receives data from agents, analyzes events, and triggers alerts.
Wazuh Indexer	securepulse-wazuh-indexer	Stores alerts and event data (search engine based on OpenSearch).
Wazuh Dashboard	securepulse-wazuh-dashboard	Web interface for visualizing data and managing configuration.
You do NOT need to install anything else on the server.

2. Client-Side Component (Required on Endpoints)
To monitor other devices (laptops, servers, VMs), you must install the Wazuh Agent on each of them.

A. Linux Agent Installation (Debian/Ubuntu)
Run this command on the target machine you want to monitor:

# 1. Add the Wazuh repository
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | gpg --no-default-keyring --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import && chmod 644 /usr/share/keyrings/wazuh.gpg
echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | tee -a /etc/apt/sources.list.d/wazuh.list
apt-get update
# 2. Install the agent
WAZUH_MANAGER="192.168.1.8" apt-get install wazuh-agent
# (Replace 192.168.1.8 with your SecurePulse server IP)
# 3. Start the agent
systemctl daemon-reload
systemctl enable wazuh-agent
systemctl start wazuh-agent
B. Windows Agent Installation
Download the installer: https://packages.wazuh.com/4.x/windows/wazuh-agent-4.7.0-1.msi
Run via PowerShell (Admin):
.\wazuh-agent-4.7.0-1.msi /q WAZUH_MANAGER="192.168.1.8"
NET START Wazuh
C. macOS Agent Installation
Download the package: https://packages.wazuh.com/4.x/macos/wazuh-agent-4.7.0-1.pkg
Install via terminal:
sudo installer -pkg wazuh-agent-4.7.0-1.pkg -target /
sudo /Library/Ossec/bin/wazuh-control start
3. Verifying Connection
Once installed, check the connection in SecurePulse Asset Management or via the CLI:

# On the Docker Server
docker exec -it securepulse-wazuh-manager /var/ossec/bin/agent_control -l
