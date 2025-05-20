import {DataTypes, Model} from 'sequelize';
const profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
const profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

export default (sequelize) => {
    class User extends Model {
    }

    User.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            fullname: {
                type: DataTypes.STRING,
                allowNull: false, // Changed from required: true to align with Sequelize syntax
                validate: {
                    len: [3, 255],
                    toLowerCase(value) {
                        if (value) this.setDataValue('fullname', value.toLowerCase());
                    },
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                    toLowerCase(value) {
                        if (value) this.setDataValue('email', value.toLowerCase());
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true, // Password can be null for Google Auth users
            },
            username: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
                validate: {
                    len: [3, 255],
                },
            },
            bio: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: '',
                validate: {
                    len: [0, 200],
                },
            },
            profile_img: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: () => {
                    return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`;
                },
            },
            account_details: {
                type: DataTypes.JSONB,
                allowNull: true,
                defaultValue: {
                    total_posts: 0,
                    total_reads: 0,
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
                ],
            },

            google_auth: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
        }
    );

    // Define associations as a static method
    User.associate = (models) => {
        User.hasMany(models.Blog, {
            foreignKey: 'userId',
            as: 'blogs',
        });
    };

    return User;
};