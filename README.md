# TODO Backend

### Description

This service is for getting and manipulating the todo task

## What's new after the first interview

-   Add FP support using fp-ts
-   Validate request payload on the controller before reaching service and reposotory
-   Add integration test

### Tech stack

-   Typescript
-   Express
-   fp-ts

## Table of Contents

-   [Install](#install)
-   [Usage](#usage)
-   [Unit Test](#unit)
-   [Integration Test](#integration)
-   [API](#api)

## Install

Yarn is required to install and handle dependencies

```
npm install --global yarn
```

**Install dependencies and run**

```sh
$ cd todo-backend
$ yarn
```

## Usage

To run the app and Redis in docker

```sh
$ docker-compose up redis_db
```

To run the app in dev mode with hot reload

```sh
$ yarn dev
```

## Unit

The unit tests are covered by test coverage

```
yarn test
```

## Integration

To run integration test, please build a todo-backend image first

```
docker build -t todo-backend .
docker-compose up
yarn test:integration
```

## API

Check Swagger reference at

```
http://localhost:3000/api-docs
```
