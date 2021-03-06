# NodeJS API Boilerplate

- An opinionated boilerplate for NodeJS APIs.
- Scalable codebase project setup.
- Database - MongoDB
- JWT Authentication

### Features

- **Multilayer Folder Architecture** - Focused on scalibility and separation of concerns. Helper script to create new module with single command.
- **Web Server** - Scalable and easy to use Express server which provides request routing and middlewares.
- **Production Ready** - Ready to go live on production with PM2 process manager.
- **Database Integration** - Uses mongoose for database integration. DB models and queries are in separate structure which can be also used as submodule inside other repos.
- **Logging** - Morgan for API access logs and Bunyan for all other custom logs with auto generated unique request id in all logs.
- **Linter** - Uses ESLint with airbnb-base config to auto detect all lint issues.
- **Pre Commit Hooks** - Husky hooks for pre-commit test case runs and lint formating.
- **Environment files** - Environment specific config file support.
- **Miscellaneous** - Response compression, CORS support, Pug template engine.

### Prerequisites

- mongodb 3.6.3
- node v15.4.0
- npm 6.4.1
- pm2 3.2.4

### Quick start

- Run the following commands inside terminal.
- Clone the project ``` git clone git@github.com:mittalmehul/node-template.git ```
- Install dependencies inside repo folder ``` npm i ```
- Start mongodb server on localhost.
- Create development.js env file inside config/keys/ folder. Copy content of config/example.development.js file inside it and update mongodb credentials.
- Start server with ``` npm run start ``` or ```pm2 start ecosystem.config.js```
### Commands

- ``` npm run start ``` - to start express server
- ```run create-module order``` - creates new module order inside modules folder with subfolders like controllers, routes, apiDocs and tests. For more commands checkout package.json => scripts.

### Code Flow

- app.js consists of config setup and requires routes/index.js
- all routes are imported in routes/index.js
- <http://localhost:3000/users> call gets resolved by modules/user/routes/user.routes.js files
- router file than passes control to controller functions for request processing.

License
----

MIT
