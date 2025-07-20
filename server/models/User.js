import {DataTypes, Model} from 'sequelize';

const profile_imgs_name_list = [
    "Neo", "Tinkerbell", "Thor", "Loki", "Dracula", "Angel", "Napoleon", "Mia", "Coco", "Gracie",
    "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki", "Zeus", "Athena", "Apollo", "Hera", "Poseidon", "Vampire", "Wizard", "Elf", "Goblin", "Dragon", "Phoenix", "Mermaid", "Unicorn", "Griffin", "Centaur", "Ninja", "Samurai", "Pirate", "Knight", "Archer", "Star", "Comet", "Galaxy", "Nebula", "Eclipse", "Blaze", "Frost", "Storm", "Thunder", "Shadow", "River", "Ocean", "Sky", "Forest", "Meadow", "Sunny", "Moony", "Spark", "Breeze", "Flame"
];
const profile_imgs_collections_list = [
    "notionists-neutral", "adventurer-neutral", "fun-emoji", "adventurer", "avataaars", "big-ears", "big-ears-neutral", "big-smile", "bottts", "bottts-neutral", "croodles", "croodles-neutral", "identicon", "initials", "lorelei", "lorelei-neutral", "micah", "miniavs", "notionists", "open-peeps", "personas", "pixel-art", "pixel-art-neutral", "shapes", "thumbs"
];

export default (sequelize) => {
    class User extends Model {
        static associate(models) {
            // Define relationship: User has many
            User.hasMany(models.Blog, {
                foreignKey: 'userId',
                as: 'blogs',
                onDelete: 'CASCADE',
            });
            // Define relationship: User has many Comments (as the blog's author)
            User.hasMany(models.Comment, {
                foreignKey: 'blogUserId',
                as: 'authoredBlogComments',
                onDelete: 'CASCADE',
            });

            // Define relationship: User has many comments (as the commenter)
            User.hasMany(models.Comment, {
                foreignKey: 'commentedBy',
                as: 'userComments',
                onDelete: 'CASCADE',
            });

            // Define relationship: User has many Notifications (as recipient)
            User.hasMany(models.Notification, {
                foreignKey: 'notificationForId',
                as: 'receivedNotifications',
                onDelete: 'CASCADE',
            });

            // Define relationship: User has many Notifications (as sender)
            User.hasMany(models.Notification, {
                foreignKey: 'userId',
                as: 'sentNotifications',
                onDelete: 'CASCADE',
            });
        }
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


    return User;
};