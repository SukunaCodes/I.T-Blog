import {models} from "../config/database.js";
import {Op} from "sequelize";

const {Blog} = models;

export const searchBlogsCountByCategory = async (req, res) => {
    try {

        let {tag, query} = req.body;
        if (!(!query && (!tag || typeof tag !== "string"))) {
            let findQuery = {draft: false};
            if (tag) {
                findQuery.tags = {[Op.contains]: Array.isArray(tag) ? tag : [tag]};
            } else if (query) {
                findQuery.title = {[Op.iLike]: `%${query}%`};
            }
            let count = await Blog.count({
                where: findQuery,
            });
            return res.status(200).json({totalDocs: count});
        } else {
            return res.status(400).json({error: "Query or tag must be provided and tag must be a string"});
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({error: err.message});
    }
}