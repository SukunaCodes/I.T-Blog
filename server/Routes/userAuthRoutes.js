import express from 'express';
import {login, register} from "../Controllers/userAuthController.js";

let router = express.Router();

router.post('/signup', register);
router.post('/signin', login);

export default router;