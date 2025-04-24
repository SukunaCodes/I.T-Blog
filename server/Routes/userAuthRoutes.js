import express from 'express';
import {register} from "../Controllers/userController.js";

let router = express.Router();

router.post('/signup', register);

export default router;