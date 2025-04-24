import express from 'express';
import 'dotenv/config'
import {Sequelize} from 'sequelize';
import cookieParser from 'cookie-parser';
import userAuthRoutes from "./Routes/userAuthRoutes.js";



const server = express();
let PORT = process.env.SERVER_PORT;


// Middleware
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(cookieParser());

// Connecting to Postgres Database
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: console.log, // Allowed logging to debug SQL queries
});

// Testing Postgresql Connection
async function testDBConnection() {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connection has been established successfully!');
    } catch (e) {
        console.error('Unable to connect to the PostgreSQL database: ', e);
        process.exit(1);
    }
}

// Initialize the DB connection function
(async () => {
    await testDBConnection();
    await sequelize.sync({force: true});
    console.log('Postgres DB synced!')// At this point the DB is connected.
})();

server.listen(PORT, () => {
    console.log("Listening on port -> " + PORT);
})

// Routes
server.use('/auth', userAuthRoutes);


