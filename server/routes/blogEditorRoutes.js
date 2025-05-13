import express from 'express';
import {upload_url} from "../controllers/blogEditorUploadURL.js";
import {createBlog} from "../controllers/createBlogController.js";
import {verifyJWT} from "../middlewares/userAuth.js";

let router = express.Router();

router.get('/upload/get-image-url', upload_url);
router.post('/create', verifyJWT, createBlog);

export default router;