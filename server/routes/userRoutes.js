import express from "express";
import {searchUsers} from "../controllers/searchUsers.js";
import {getUserProfile} from "../controllers/getUserProfile.js";

let router = express.Router();

router.post('/search', searchUsers);
router.post('/profile', getUserProfile);

export default router;