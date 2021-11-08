### Repo Description

### Quick start
 - Run the following commands inside terminal.
 - Clone the project
 
 ## Common Setup
 - Install dependencies inside repo folder ``` npm i ```
 - Create development.config.json env file inside config/ folder if you want to run using CUSTOM CONFIG. Copy content of config/example.development.json file inside it and update mongodb credentials. 
 - Start server with ``` npm run start ``` 
 - Visit http://localhost:{PORT}/health in browser to check if server is running.  
 

## Start Mock API Server
- Use node version > 12. e.g. 12.10.0
- Start mock server with ``` npm run mock-server ``` 
- If getting ```maximum file watch read ``` error then run ``` echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/  sysctl.conf && sudo sysctl -p ```
- By default, server will start at port 4010
