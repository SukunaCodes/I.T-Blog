import {models} from "../config/database.js";

const {User} = models;

export const getUserProfile = async (req, res) => {
    try{
        const {username} = req.body;

        const user = await User.findOne({
            where: {
                username: username
            },
            attributes: {
                exclude: ["password", "google_auth", "updatedAt", "blogs"]
            },
        });
        return res.status(200).json(user);
    } catch (err){
        console.log(err);
        return res.status(500).json({error: err.message});
    }
}

