import express from 'express';
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import userAuthRoutes from "./Routes/userAuthRoutes.js";
import initializeDatabase from "./Config/database.js";



const server = express();
let PORT = process.env.SERVER_PORT;


// Middleware
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(cookieParser());

// Connecting to Postgres Database
const db = initializeDatabase();


// Testing Postgresql Connection
async function testDBConnection() {
    try {
        await db.authenticate();
        console.log('PostgresSQL connection has been established successfully!');
    } catch (e) {
        console.error('Unable to connect to the PostgresSQL database: ', e);
        process.exit(1);
    }
}

// Initialize the DB connection function
(async () => {
    await testDBConnection();
    await db.sync({force: true});
    console.log('Postgres DB synced!')// At this point the DB is connected.
})();

server.listen(PORT, () => {
    console.log("Listening on port -> " + PORT);
})

// Routes
server.use('/auth', userAuthRoutes);


