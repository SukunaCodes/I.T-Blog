import {models} from "../config/database.js";

const {Blog} = models;


export const countTotalBlogs = async (req, res) => {
    try {
        let count = await Blog.count({
            where: {draft: false}
        });
        return res.status(200).json({totalDocs: count});
    } catch (err){
        console.log(err.message);
        return res.status(500).json({error: err.message});
    }
}