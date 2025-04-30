import express from 'express';
import {upload_url} from "../controllers/blogEditorUploadURL.js";

let router = express.Router();

router.get('/get-image-url', upload_url);

export default router;