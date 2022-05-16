# Node.js recruitment task documentation

## Prerequisites

You need to have `docker` and `docker-compose` installed on your computer to run the services.

## Run

1. Clone this repository.
2. Run from root directory
3. You have to provide 4 env variables to run the app:

`JWT_SECRET` - is used to validate user authorization

`DB_USER` - defines database username

`DB_PASSWORD` - defines database password

`DB_DATABASE` - defines database name

There is also 3 optional env variables:

`MOVIES_PORT` - overrides movies-service port (default: 3001)

`DB_PORT` - overrides database port (default: 5432)

`AUTH_PORT` - overrides auth-service port (default: 3000)

```
JWT_SECRET=secret DB_USER=user DB_PASSWORD=password DB_DATABASE=db_name  docker-compose up -d
```

To stop the authorization service run

```
docker-compose down
```

## Documentation for API

You can find the documentation for the movies and auth service API [HERE](https://documenter.getpostman.com/view/15917175/UyxjHSMg)

### Accounts

You can find list of valid users accounts [HERE](https://github.com/netguru/nodejs-recruitment-task#users)
