import sequelize, {models} from "../config/database.js";


const {User, Blog} = models;

export const fetchTrendingBlogs = async (req, res) => {
    let blogMaxLimit = 5;

    try{
        const blogs = await Blog.findAll({
            where: {draft: false},
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['fullname', 'profile_img', 'username']
                },
            ],
            order: [
                [sequelize.literal
                ('"activity"->>\'total_reads\'::text'), 'DESC'],
                [sequelize.literal
                ('"activity"->>\'total_likes\'::text'), 'DESC'],
                ['createdAt', 'DESC'],
            ],
            attributes: ['blog_id', 'title', 'createdAt'],
            limit: blogMaxLimit,
        });
        return res.status(200).json({blogs});
    } catch (err){
        return res.status(500).json({error: err.message});
    }
}