SecurePulse Windows Deployment Guide
1. Prerequisites
  Docker Desktop for Windows installed (version 4.x+).
  WSL 2 (Windows Subsystem for Linux) backend enabled.
  Git for Windows (configured to handle line endings correctly).
3. Critical Configurations
  A. Memory Allocation (IMPORTANT)
  The default Docker Desktop memory limit (2GB) is insufficient for Wazuh + Ollama + MySQL.
  
  Create/Edit a .wslconfig file in your User Home directory (C:\Users\<YourUser>\.wslconfig).
  Add the following memory configuration (allocate at least 6GB, preferably 8GB):
  [wsl2]
  memory=8GB
  
  Restart Docker Desktop. Alternative: Open Docker Desktop Settings -> Resources -> WSL 2 -> Limit memory.
  B. Wazuh Indexer Requirement (vm.max_map_count)
  Wazuh Indexer (Elasticsearch/OpenSearch) requires a specific kernel setting.

  Open PowerShell as Administrator.
  
  Run the following command to set the limit for the current session (WSL 2):
  wsl -d docker-desktop
  sysctl -w vm.max_map_count=262144
  
  Note: You may need to run this every time you restart Docker/WSL, or add it to /etc/sysctl.conf inside your WSL distribution.
  
  C. Line Endings (CRLF vs LF)
  If you clone the repo on Windows, Git might convert line endings to CRLF. Shell scripts (
  .sh
  ) inside containers MUST use LF.
  
  Configure Git to preserve LF:
  git config --global core.autocrlf input
  If scripts fail to run with "command not found" or weird character errors, use a tool like Dos2Unix or VS Code (bottom right corner -> Change CRLF to LF) to fix them.
  
3. Running the System
   
  Open PowerShell or Command Prompt.
  Navigate to the project directory:
  cd path\to\securepulse
  Start the containers:
  docker-compose up --build -d
  
5. Accessing the App

  Frontend: http://localhost:3000
  Wazuh Dashboard: http://localhost:5601 (User: admin / Password: check 
  .env
   or 
  docker-compose.yml
  )
  API Gateway: http://localhost:5000
