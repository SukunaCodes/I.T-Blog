import {Sequelize} from 'sequelize';
import 'dotenv/config'

// Function to initialize and return Sequelize instance
const initializeDatabase = () => {
    return new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        logging: console.log, // Allowed logging to debug SQL queries
    });
}

export default initializeDatabase;