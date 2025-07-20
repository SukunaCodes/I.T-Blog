import {models} from "../config/database.js";
import {Op} from "sequelize";

const {Blog, User} = models;

export const searchBlogsCountByCategory = async (req, res) => {
    let {tag, query, user} = req.body;
    let findQuery;

    if (tag) {
        findQuery = {
            tags: Array.isArray(tag) ? {[Op.contains]: tag} : {[Op.contains]: [tag]},
            draft: false,
        };
    } else if (query) {
        findQuery = {
            draft: false,
            title: {[Op.iLike]: `%${query}%`},
        };
    } else if (user) {
        const userId = parseInt(user);
        if (isNaN(userId)) {
            return res.status(400).json({error: "User must be a valid number"});
        }
        // Verify user exists
        const userExists = await User.findOne({where: {id: userId}});
        if (!userExists) {
            return res.status(404).json({error: "User not found"});
        }
        findQuery = {userId: userId, draft: false}; // Changed from user to userId
    }

    try {
        console.log("FindQuery for count:", findQuery); // Debug log
        let count = await Blog.count({where: findQuery});
        return res.status(200).json({totalDocs: count});
    } catch (err) {
        console.error("Error in searchBlogsCountByCategory:", err.message, err.stack, req.body);
        return res.status(500).json({error: err.message});
    }
};