import express from "express";
import {searchUsers} from "../controllers/searchUsers.js";

let router = express.Router();

router.post('/search', searchUsers);

export default router;