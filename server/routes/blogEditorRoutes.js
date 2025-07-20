import express from 'express';
import {upload_url} from "../controllers/blogEditorUploadURL.js";
import {createBlog} from "../controllers/createBlogController.js";
import {verifyJWT} from "../middlewares/userAuth.js";
import urlFetchLinkPreview from "../controllers/fetchURLPreview.js";
import {fetchLatestBlogs} from "../controllers/fetchLatestPublishedBlogs.js";
import {fetchTrendingBlogs} from "../controllers/fetchTrendingPublishedBlogs.js";
import {filterBlogsByTags} from "../controllers/filterBlogsByTags.js";
import {countTotalBlogs} from "../middlewares/totalBlogsCount.js";
import {searchBlogsCountByCategory} from "../middlewares/searchBlogsCountByCategory.js";

let router = express.Router();

router.get('/fetch-link-preview', urlFetchLinkPreview);
router.get('/upload/get-image-url', upload_url);
router.get('/trending', fetchTrendingBlogs);


router.post('/latest', fetchLatestBlogs);
router.post('/create', verifyJWT, createBlog);
router.post('/search', filterBlogsByTags);
router.post('/all-blogs-count', countTotalBlogs);
router.post('/search-blogs-count', searchBlogsCountByCategory);


export default router;