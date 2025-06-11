import {models} from "../config/database.js";
import {Op} from "sequelize";

const {Blog, User} = models;

export const filterBlogsByTags = async (req, res) => {
    let {tag, query, page} = req.body;


    // Validate input
    if (!(!query && (!tag || typeof tag !== "string"))) {
        let findQuery = {draft: false};
        if (tag) {
            findQuery.tags = {[Op.contains]: Array.isArray(tag) ? tag : [tag]};
        } else if (query) {
            findQuery.title = {[Op.iLike]: `%${query}%`};
        }
        let maxLimit = 5;
        let skip = (parseInt(page) - 1) * maxLimit || 0;
        try {
            const blogs = await Blog.findAll({
                where: findQuery,
                include: {
                    model: User,
                    as: 'user',
                    attributes: ['fullname', 'profile_img', 'username'],
                },
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'title', 'description', 'banner', 'activity', 'tags', 'createdAt'],
                limit: maxLimit,
                offset: skip,
            })
            return res.status(200).json({blogs});
        } catch (err) {
            return res.status(500).json({error: err.message});
        }
    } else {
        return res.status(400).json({error: "Query or tag must be provided and tag must be a string"});
    }
};