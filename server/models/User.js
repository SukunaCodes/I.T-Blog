import {DataTypes, Model} from 'sequelize';
import 'dotenv/config'
import sequelize from "../config/database.js";



const profile_imgs_name_list = ["Aizen", "Ayanakoji", "Ichigo", "Sun-Jin-Woo", "Urahara", "Sukuna", "Dante", "Byakuya", "Rukia"];
const profile_imgs_collections_list = ["notionists-neutral", "adventurer-villain", "fun-isekai", "overpowered-shounen", "raging-vessel", "dark-manipulator"];

const User = sequelize.define('user', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    fullname: {
        type: DataTypes.STRING,
        required: true,
        validate: {
            len: [3, 255], // minlength: 3
            toLowerCase(value) {
                if (value) this.setDataValue('fullname', value.toLowerCase()); // toLowerCase: true
            },
        },
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        required: true,
        validate: {
            isEmail: true, //validate email format
            toLowerCase(value) {
                if (value) this.setDataValue('email', value.toLowerCase());
            },
        },
    },
    password: {
        type: DataTypes.STRING,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            len: [3, 255],
        },
    },
    bio: {
        type: DataTypes.STRING,
        defaultValue: "",
        validate: {
            len: [0, 200], //maxlength:200
        },
    },
    profile_img: {
        type: DataTypes.STRING,
        defaultValue: () => {
            return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`;
        },
    },
    social_links: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [
            {platform: 'youtube', url: ''},
            {platform: 'instagram', url: ''},
            {platform: 'x', url: ''},
            {platform: 'substack', url: ''},
            {platform: 'github', url: ''},
            {platform: 'medium', url: ''},
            {platform: 'website', url: ''},
        ]
    },
    account_details: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {
            total_posts: 0,
            total_reads: 0,
        },
    },
    // Google Auth
    google_auth: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {timestamps: true},);
export default User;
