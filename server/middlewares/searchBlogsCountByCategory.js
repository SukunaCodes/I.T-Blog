import {models} from "../config/database.js";
import {Op} from "sequelize";

const {Blog} = models;

export const searchBlogsCountByCategory = async (req, res) => {
    try {
        let {tag} = req.body;
        if(!tag || typeof tag !== "string"){
            return res.status(400).json({error: "Tag must be a non-empty string"});
        }
        let findQuery = {
            tags: {[Op.contains] : [tag]},
            draft: false,
        };

        let count = await Blog.count({
            where: findQuery,
        });
        return res.status(200).json({totalDocs: count});
    } catch (err){
        console.log(err.message);
        return res.status(500).json({error: err.message});
    }
}