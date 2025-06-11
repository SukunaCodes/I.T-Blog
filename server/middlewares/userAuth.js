import jwt from 'jsonwebtoken';
import { models } from '../config/database.js';
import {nanoid} from "nanoid";


const {User} = models;

// Function to check on existing usernames in the Database and generate one if exists
export const generateUsername = async (email) => {
    let username = email.split('@')[0];
    let isUsernameExist = await User.findOne({ where: { username } })

    isUsernameExist ? username += nanoid().substring(0, 4) : "";

    return username;
}

export const formatDataToSend = (user) => {
    const access_token = jwt.sign({id: user.id}, process.env.SECRET_ACCESS_KEY)
    return {
        access_token,
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        profile_img: user.profile_img
    }
}

export const verifyJWT = (req, res, next) => {
    try{
        let authHeader = req.headers['authorization'];
        let token = authHeader && authHeader.split(" ")[1];

        if(token === null){
            return res.status(401).json({error: "No access token!"})
        }
        jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
            if (err){
                return res.status(403).json({error: "Access Token is invalid!"})
            }
            req.user = user.id
            next()
        })
    } catch (err){
        return res.status(500).json({error: err.message})
    }
}

/*
export const verifyJWToken = (req, res, next) => {
  try{
      let token = req.header('Authorization');
      if(!token){
          return res.status(403).json({message: "Access Denied"});
      }
      if(token.startsWith('Bearer ')){
          token = token.slice(7, token.length).trimLeft();
      }

      const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
  } catch (error) {
      res.status(500).json({message: error.message});
  }
};*/
