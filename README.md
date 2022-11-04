# DEEL BACKEND TASK SOLUTION

## How to use
Use `npm run seed` to create a new database and seed it. With `npm start` you can start the server or use `npm run debug` to start the server with an additional debug endpoint.

To re-generate the swagger documentation run `npm run start-gendoc`.

And to run tests, use `npm test`.

## Architecture
The project is divided in two layers: Routes and Services.

### Routes
The route layer is responsible for extracting all necessary information from the incoming HTTP request and formatting the response using the right HTTP status code and JSON as body.

Instead of extensive use of the HTTP status codes, I have decided to use custom error codes instead, as they are more precise and flexible.

### Services
Services are doing the heavy lifting and contain the business logic. 
In a normal case I would split this layer even further, having a provider/repository layer and the service layer, but due to the size of this project and the time constraint I have decided to mix both together.

## Security
I have designed this API as if it was being used as a public API. As such basic calls like getting a contract that are connected to a different profile will return a 404, even if they exist. This is to not expose information about the business such as amount of contracts by doing multiple queries with high id numbers to determine whether the contracts exist.

## Testing
I have added some tests for two routes, ideally I would have tested all routes, but again due to time constraints this was not possible. I would have preferred to start with tests first, but my focus was to finish the tasks first before adding extra points :)
Also the tests are rather integration than unit tests. With proper separation I would have mocked out the providers, but now it's just overwriting the local database with each test run.

Please re-run the seeding script after running tests, as they are changing the database.

## Swagger
I have added swagger UI to have a GUI for accessing the API. A pre-generated version is included, but you can re-generate it by using `npm run start-gendoc`.
The server will break if the swagger.json is missing. Generating without a prior swagger.json file ends up in a catch 22. The swagger UI code in  `App.js` needs to be commented out for the generator to work.

## Exception handling
Due to expressjs limitation for asynchronous handlers to properly catch the exceptions, I have added some handling in some routes where I would use exceptions. With more time this could have been done nicer.

## Prettier
I have added `prettier` because I ended up in a chaos using single and double quotes.

## Improvements
Besides of the improvements I have mentioned above, I would have considered migrating to TypeScript. Even though WebStorm, JSDocs and this being a small project are helping, a typed language eases up working in complex projects.