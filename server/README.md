# InstaNotary Express App

This is a express app with bluzelle db.

This app handles all the request from the mobile app and submit them to ipfs and bluzelle db.

## Tech stack used
- IPFS
- Bluzelle JS SDK
- Express JS
- Multiter
- Docker

## How to setup firebase
- Go to [Firebase Cpnsole](https://console.firebase.google.com/u/1/) and register with a email/gmail.
- Then add a project in the firebase console.
- Step 1 - Give a name of the project.
- Step 2 - Continue on the 2nd Step.
- Step 3 - Select a default account for firebase in the `Choose or create a Google Analytics account` options.
- Click Create Project and wait for it to be created.
- After creation, go to Authentication and click Setup for Signing method.
- Enable Phone option like this and save it.
- Now click Setting(2nd option from the top in the left nav pannel) and select Project setting.
- Go to `my app` in General Tab and below `your project` and click the 3rd option i.e. create web app.
- You will get a `Add Firebase to your web app` screen, put any app name and Register it.
- Now you will see firebase config between the script.
- Put all the values on the .env according to the key and continue with to the console.
- If you want to look for firebase cofig again, just go to the General tab in Project Settings in the Settings, you will able to see firebase config in the `my app`.

## Setup env

- Create a .env file in this server folder with `nano .env`
- Copy paste the below text and provide your own keys and save it
```
# Set to production when deploying to production
NODE_ENV=development

# Node.js server configuration
SERVER_PORT=5000

# Firebase configurations
FIREBASE_KEY=xxx
FIREBASE_AUTH_DOMAIN=xxx
FIREBASE_DATABASE_URL=xxx
FIREBASE_PROJECT_ID=xxx
FIREBASE_STORAGE_BUCKET=xxx
FIREBASE_MESSAGING_SENDER_ID=xxx
FIREBASE_APP_ID=xxx
FIREBASE_MEASUREMENT_ID=xxx

# Bluzelle credential
BLUZELLE_ACCOUNT_MNEMONIC=xxx
BLUZELLE_ENDPOINT=xxx
BLUZELLE_CHAIN_ID=xxx
BLUZELLE_APP_UUID=xxx
```

## How to install Docker?

To install the docker ce and docker-compose on EC2 instance, just follow this simple instruction one by one:
```
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
$ sudo apt-get update
$ sudo apt-get install docker-ce // installing the docker
$ sudo apt-get install docker-compose // installing the docker-compose
```

## How to run?

To run this app you just have to clone the whole app and then follow these steps:
```
git clone https://github.com/mmitrasish/InstaNotary.git
cd InstaNotary/server
sudo docker-compose up --build // if you are running for the first time or change and packages
sudo docker-compose up // if you have already build the container
```

## How to deploy in AWS?

To deploy this app you have to `Launch an EC2 instance` and `SSH into your instance` using the ssh keys from the aws instance. Here is great article that you can follow to get it done with the setup for aws instance and run the app on the instance [Deploy Node JS App to AWS EC2 Server](https://ourcodeworld.com/articles/read/977/how-to-deploy-a-node-js-application-on-aws-ec2-server)

- Once you have ssh into your instance, you have to clone the app - `git clone https://github.com/mmitrasish/InstaNotary.git`
- Go to the server folder - `cd InstaNotary/server`
- Run and build with docker - `sudo docker-compose up --build`
- Run with docker - `sudo docker-compose up` - You don't have to do this step if it's your first time
- Once the server is up, you have expose the port whatever you get in the console in the earlier step.
