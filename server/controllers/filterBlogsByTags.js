import {models} from "../config/database.js";
import {Op} from "sequelize";

const {Blog, User} = models;

export const filterBlogsByTags = async (req, res) => {
    let {tag, query, page, user} = req.body;


    // Validate input
    if (!(!query && !tag && !user) || (tag && typeof tag !== "string")) {
        let findQuery = {draft: false};
        if (tag) {
            findQuery.tags = {[Op.contains]: Array.isArray(tag) ? tag : [tag]};
        } else if (query) {
            findQuery.title = {[Op.iLike]: `%${query}%`};
        }
        else if (user) {
            const userId = parseInt(user);
            if (isNaN(userId)) {
                return res.status(400).json({ error: "User must be a valid number" });
            }
            // Verify user exists
            const userExists = await User.findOne({ where: { id: userId } });
            if (!userExists) {
                return res.status(404).json({ error: "User not found" });
            }
            findQuery.userId = userId;
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