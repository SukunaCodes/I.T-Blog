import { Sequelize } from 'sequelize';
import 'dotenv/config';

// Import models
import UserModel from '../models/User.js';
import BlogModel from '../models/Blog.js';
import CommentModel from '../models/Comment.js';
import NotificationModel from '../models/Notification.js';

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});


// Initialize models by passing sequelize
const models = {
  User: UserModel(sequelize),
  Blog: BlogModel(sequelize),
  Comment: CommentModel(sequelize),
  Notification: NotificationModel(sequelize),
};

// Set up associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export the Sequelize instance and models
export default sequelize;
export { models };
