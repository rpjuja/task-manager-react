# Task Manager App

## Description

Fullstack task manager web application that let's users create workspaces that contain tasks in three different columns, backlog, in progress and done. Tasks can be added, moved, edited and deleted. User has to be signed in to use the app and can modify their information or delete the account if needed.

| Links             |                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------- |
| API documentation | https://app.swaggerhub.com/apis/rpjuja/Task-Manager-API/1.0.0                      |
| Database Schema   | https://drive.google.com/file/d/1cXl8kIU9q5Aol71bCA7j7VmEO4RGl8N4/view?usp=sharing |
| Project plan v3   | https://drive.google.com/file/d/17RMRaG6EmbAbbNcQPNG7pJ1nztLlmtcb/view?usp=sharing |

## How to install and run locally

**To run this application you will need docker, node and npm installed**

To clone this repository and navigate to the cloned directory

```
git clone https://gitlab.tamk.cloud/Jarvinen/5g00ev16-3001_web-application.git
cd 5g00ev16-3001_web-application
```

To install all dependecies

```
npm run install
```

To start a docker container in the background

```
docker-compose up -d
```

To run tests

```
npm run test
```

**Use seperate windows to run the server and the client**

To start the server

```
npm run start:server
```

To start the client

```
npm run start:client
```

**When done remember to stop docker**

```
docker-compose down
```

**Other commands**

If at any point you get a "_database "taskmanagerDB" does not exist_" error, run

```
npm run init:database
```

And if you wish to drop the database (ALL DATA WILL BE LOST!)

```
npm run drop:database
```

## Release notes

**Release 1.0 - 24.4.2022**

    - User can create an account and login
    - User can update their password and delete the account
    - User can add and delete workspaces
    - User can add, modify, and delete tasks
    - Tasks are divided to three columns by their completion status
    - User can move tasks between the columns
    - Tasks show the title and the deadline by default and user can expand the task component to review the description

**Known bugs**

    - App scales badly to mobile devices
    - When adding a task, the modal doesn't reset after closing
    - If user has a workspace and loads the tasks page, before the tasks are loaded the component for creating first workspace is shown for a very brief time
    - Admin users can only be created manually and they lack good functionality
