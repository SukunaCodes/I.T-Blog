import { Sequelize } from 'sequelize';
import 'dotenv/config';

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

/*// Import models
import UserModel from '../models/User.js';

// Initialize models
const models = {
  User: UserModel,
};

// Set up associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});*/

// Export the Sequelize instance and models
export default sequelize;
//export { models };