import express from 'express';
import {upload_url} from "../controllers/blogEditorUploadURL.js";
import {createBlog} from "../controllers/createBlogController.js";
import {verifyJWT} from "../middlewares/userAuth.js";
import urlFetchLinkPreview from "../controllers/fetchURLPreview.js";
import {fetchLatestBlogs} from "../controllers/fetchLatestPublishedBlogs.js";
import {fetchTrendingBlogs} from "../controllers/fetchTrendingPublishedBlogs.js";

let router = express.Router();

// Link Preview Route
router.get('/fetch-link-preview', urlFetchLinkPreview);
router.get('/upload/get-image-url', upload_url);
router.get('/latest', fetchLatestBlogs);
router.get('/trending', fetchTrendingBlogs);


router.post('/create', verifyJWT, createBlog);


export default router;