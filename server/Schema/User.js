import {Sequelize, DataTypes} from 'sequelize';
import 'dotenv/config'

// Initialize sequelize
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});


const profile_imgs_name_list = ["Aizen", "Ayanakoji", "Ichigo", "Sun-Jin-Woo", "Urahara", "Sukuna", "Dante", "Byakuya", "Rukia"];
const profile_imgs_collections_list = ["notionists-neutral", "adventurer-villain", "fun-isekai", "overpowered-shounen", "raging-vessel", "dark-manipulator"];

const User = sequelize.define('user', {
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
    /*// Flattened social links fields
    youtube: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    instagram: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    x: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    substack: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    github: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    medium: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    website: {
        type: DataTypes.STRING,
        defaultValue: "",
    },

    // Flattened account_details
    total_posts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    total_reads: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    // Google Auth
    google_auth: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },*/
}, {timestamps: false},);
export default User;
