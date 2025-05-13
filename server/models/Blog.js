import {DataTypes, Model} from 'sequelize';

export default (sequelize) => {
    class Blog extends Model {
        static associate(models) {
            // Define relationship: Blog belongs to a User
            this.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
            });
        }
    }

    Blog.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 255],
                },
            },
            banner: {
              type: DataTypes.STRING,
              allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            tags: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE'
            },
            activity: {
                type: DataTypes.JSONB,
                allowNull: true,
                defaultValue: {
                    total_likes: 0,
                    total_comments: 0,
                    total_reads: 0,
                    total_parent_comments: 0,
                },
            },
            comments: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            draft: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Blog',
            tableName: 'blogs',
        }
    );
    return Blog;
};