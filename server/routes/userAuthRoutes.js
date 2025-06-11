import express from 'express';
import {googleAuthentication, login, register} from "../controllers/userAuthController.js";

let router = express.Router();

router.post('/signup', register);
router.post('/signin', login);
router.post('/google-auth', googleAuthentication);

export default router;