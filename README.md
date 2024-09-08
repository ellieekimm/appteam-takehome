# Running Workout API 
This API provides endpoints to manage and analyze running workout data. 

## Design Choices
Although there a large number of back-end frameworks and databases to choose, I decided to choose Express.JS and MongoDB/Mongoose for this particular API. 

- Middleware: Due to the built-in middlware, Express.JS makes writing APIs much more efficient. For example, in this API, I use Multer, a built-in feature that is used for handling form-data, or images in this case. 
- NoSQL: MongoDB is a NoSQL database. Due to the time constraint of this take-home project, I wanted a database that had a more flexible database so that I can work with more unstructured data. 
- Resources: MongoDB and Express.JS both have great developer communities and resources, and this was important for me as I am still learning both these technologies.


## Tools Used to Create API
- **Express.JS**: Used to create the server and define routes for various endpoints. The `app` object created by `express()` is used to set up middleware, handle HTTP requests, and manage routes. 
    `app.post('/workouts', upload.single('image'), async (req, res) => ....)`: Defines a route to handle file uploads and save data to the database
    `app.get('/workouts', async (req, res) => {...})`: Defines a route to retrieve workouts based on query parameters 
- **MongoDB/Mongoose**: Used to define Workout schema and interact with the MongoDB database. The `Workout` model represents the workout data structure.
- **Axios**: Used to fetch air quality data from the World Air Quality Index (WAQI) API based on the location provided by the user. The fetched air quality index (AQI) is then stored in the workout document. 
    `const response = await axios.get(waqiurl)`

## How to Run and Test API
This API has several endpoints: 
- `POST /workouts`
- `GET /workouts`
- `GET /stats/avg-duration`
- `GET /stats-avg-distance`
- `GET /stats/total-workouts`
- `GET /stats/fastest-pace`

Postman is a popular tool for testing APIs, and this API can be tested through the collection link [here](https://www.postman.com/avionics-operator-95655931/workspace/typing-test/collection/28315465-b1f806b6-7168-48d1-8716-18f562697267?action=share&creator=28315465
). The request formats and required field for each request can be found in the documentation on Postman.

Another way to test the API is to use cURL, a command-line tool for making HTTP requests. Here are some examples of how to test the endpoints using cURL:

- **POST /workouts**:
    ```bash
    curl -X POST http://localhost:5000/workouts \
     -F "location=New York" \
     -F "duration=30" \
     -F "distance=5"
    ```

- **GET /workouts**:
    ```bash
    curl http://localhost:5000/workouts?id=workout_id
    ```

- **GET /stats/avg-duration**:
    ```bash
    curl http://localhost:5000/stats/avg-duration
    ```



