import {models} from "../config/database.js";

const {Blog, User} = models;

export const fetchLatestBlogs = async (req, res) => {
    let blogMaxLimit = 5;

    try{
        const blogs = await Blog.findAll({
            where: {draft: false}, // Filter blogs
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['fullname', 'profile_img', 'username']
                },
            ],
            order: [['createdAt', 'DESC']],
            attributes: ['blog_id', 'title', 'description', 'banner', 'activity', 'tags', 'createdAt'],
            limit: blogMaxLimit,
        });
        return res.status(200).json({blogs});
    } catch (err){
        return res.status(500).json({error: err.message});
    }

}