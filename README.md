<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Usage
1) Authentication:
Ensure that users are authenticated before accessing the file manager. You can customize the authentication strategy in the auth.guard.ts file.

2) User Access Control:
The application utilizes CASL abilities to control user access to folders and files. Update the casl-abilities.ts file to define the access rules according to your requirements.

3) Check-in and Check-out:
To prevent concurrent edits, the application supports the check-in and check-out mechanism. Users must check out a file before editing and check it back in after making changes. Check-out and check-in functionality is implemented in the checkin.service.ts file.

4) Download Files:
Users can download files using the provided download functionality. Customize the download route and logic in the download.controller.ts file.

5) Alot more features check the screenshots below or the code for more details.

# Screenshots

## Auth Feature
<img src="https://github.com/ehsankkk1/File-Manager-Flutter/assets/102434828/bea5840c-6290-4435-98c0-a04f971ff4ba" width="300" >
<img src="https://github.com/ehsankkk1/File-Manager-Flutter/assets/102434828/c83d1b0a-d5bd-41b9-a694-67084aa35335" width="300" >

## Files Feature
<img src="https://github.com/ehsankkk1/File-Manager-Flutter/assets/102434828/4d39c922-777b-42cc-a71b-84abf3795d8b" width="300" >
<img src="https://github.com/ehsankkk1/File-Manager-Flutter/assets/102434828/c70b4e79-3156-4ca6-ba62-a54cf6d268b3" width="300" >
<img src="https://github.com/ehsankkk1/File-Manager-Flutter/assets/102434828/45eda6f1-c7e1-4789-b833-09de00ec5176" width="300" >
<img src="https://github.com/ehsankkk1/File-Manager-Flutter/assets/102434828/fafa953f-8927-40bc-8a4d-ceb8e65666fc" width="300" >

## Folder Feature
<img src="https://github.com/ehsankkk1/File-Manager-Flutter/assets/102434828/bc9c48d5-465b-402c-8793-e51815b5633e" width="300" >
<img src="https://github.com/ehsankkk1/File-Manager-Flutter/assets/102434828/80ebebb6-b4a0-48fb-aa25-d159885e7e79"width="300" >


## Installation

```bash
$ yarn install
```

## Running the app

```bash

## custom script to start postgres in docker and push migrations
## only use this once you understand the concept. 
$ yarn db:dev:restart 


# run nestjs app 
$ yarn start:dev

# start postgresql container
$ docker compose up dev1

#create .env file add the database url : 
## .env

# DATABASE_URL="postgresql://postgres:123@localhost:5434/nest?schema=public"
# JWT_SECRET='super-secret'

# migrate database schema 
$ npx prisma migrate dev

# starting prisma studio
$ npx prisma studio

```
