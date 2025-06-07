import {models} from "../config/database.js";
import {Op} from "sequelize";

const {Blog, User} = models;

export const filterBlogsByTags = async (req, res) => {
    let{tag, page} = req.body;

    // Validate Tag
    if(!tag || typeof tag !== 'string'){
        return res.status(400).json({error: "Tag must be a non-empty string"});
    }
    let findQuery = {
        tags: {[Op.contains]: Array.isArray(tag) ? tag : [tag]},
        draft: false,
    };

    let maxLimit = 2;
    let skip = (page - 1) * maxLimit;

    try{
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
    } catch (err){
        return res.status(500).json({error: err.message});
    }
};