# InstaNotary Express App

This is a express app with bluzelle db.

This app handles all the request from the mobile app and submit them to ipfs and bluzelle db.

## Tech stack used
- IPFS
- Bluzelle JS SDK
- Express JS
- Multiter
- Docker

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
docker-compose up --build // if you are running for the first time or change and packages
docker-compose up // if you have already build the container
```

## How to deploy in AWS?

To deploy this app you have to `Launch an EC2 instance` and `SSH into your instance` using the ssh keys from the aws instance. Here is great article that you can follow to get it done with the setup for aws instance and run the app on the instance [Deploy Node JS App to AWS EC2 Server](https://ourcodeworld.com/articles/read/977/how-to-deploy-a-node-js-application-on-aws-ec2-server)

- Once you have ssh into your instance, you have to clone the app - `git clone https://github.com/mmitrasish/InstaNotary.git`
- Go to the server folder - `cd InstaNotary/server`
- Run and build with docker - `docker-compose up --build`
- Run with docker - `docker-compose up` - You don't have to do this step if it's your first time
- Once the server is up, you have expose the port whatever you get in the console in the earlier step.
