import express from 'express';
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import userAuthRoutes from "./routes/userAuthRoutes.js";
import sequelize from "./config/database.js";
import cors from "cors";
import googleAccountKey from './pern-blog-app-firebase-adminsdk.json' with { type: "json" }; // Guard the json securely
import admin from "firebase-admin";
import blogEditorRoutes from "./routes/blogEditorRoutes.js";


const server = express();
let PORT = process.env.SERVER_PORT;

// Firebase admin Init

admin.initializeApp({
    credential: admin.credential.cert(googleAccountKey)
});


// Middleware
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(cookieParser());
server.use(cors());



// Testing Postgresql Connection
async function testDBConnection() {
    try {
        await sequelize.authenticate();
        console.log('PostgresSQL connection has been established successfully!');
    } catch (e) {
        console.error('Unable to connect to the PostgresSQL database: ', e);
        process.exit(1);
    }
}

// Initialize the DB connection function
(async () => {
    await testDBConnection();
    /*await db.sync({force: true});
    console.log('Postgres DB synced!')*/// At this point the DB is connected.
})();

server.listen(PORT, () => {
    console.log("Listening on port -> " + PORT);
});

// User Auth Routes
server.use('/auth', userAuthRoutes);

// Blog Editor Routes
server.use('/blog', blogEditorRoutes);


