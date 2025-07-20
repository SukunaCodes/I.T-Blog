import {models} from "../config/database.js";
import {Op} from "sequelize";

const {User} = models;

export const searchUsers = async (req, res) => {

    let maxLimit = 50;

    try{
        const {query} = req.body;

        const users = await User.findAll({
            where: {
                username: {[Op.iLike]: `%${query}%`} //Case-sensitive search
            },
            attributes: ['fullname', 'profile_img', 'username'],
            limit: maxLimit
        })
        return res.status(200).json({users});
    }
    catch (err){
        return res.status(500).json({error: err.message});
    }
}