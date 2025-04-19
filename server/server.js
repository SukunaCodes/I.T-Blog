import express from 'express';
import 'dotenv/config'
import {Sequelize} from 'sequelize';

const server = express();
let PORT = process.env.SERVER_PORT;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());

const db = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Testing Postgresql Connection
async function testDBConnection(){
    try{
        await db.authenticate();
        console.log('PostgreSQL connection has been established successfully!');
    } catch (e) {
        console.error('Unable to connect to the PostgreSQL database: ' , e);
        process.exit(1);
    }
}
// Initialize the DB connection function
(async () => {
  await testDBConnection(); // Wait for DB connection
})();

server.listen(PORT, () => {
    console.log("Listening on port -> " + PORT);
})


server.post("/signup", (req, res) => {
    let {fullname, email, password} = req.body;

    // Data validation from client frontend
    if (fullname.length < 3){
        return res.status(403).json({"error": "Fullname must be at least 3 characters long"})
    }
    if (!email.length){
        res.status(403).json({"error": "Please provide an email"})
    }
    if (!emailRegex.test(email)){
        return res.status(403).json({"error": "Invalid email"})
    }
    if (!passwordRegex.test(password)){
        return res.status(403).json({"error": "Password should be 6 to 20 characters long with 1 numeric, 1 lowercase, 1 Uppercase letters"})
    }
    return res.status(200).json({"status": "👍👍"})
})