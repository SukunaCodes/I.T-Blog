import {DataTypes, Model} from 'sequelize';

export default (sequelize) => {
    class Comment extends Model {
        static associate(models){
            // Define relationship: Comments belong to a Blog
            this.belongsTo(models.Blog, {
                foreignKey: 'blogId',
                as: 'blog',
            });

            // Define relationship: Comments belong to a User
            this.belongsTo(models.User, {
                foreignKey: 'blogUserId',
                as: 'blogUser',
            });

            //Define relationship: Comments belongs to a User(who commented)
            this.belongsTo(models.User, {
                foreignKey: 'commentedBy',
                as: 'commenter',
            });

            // Define self-referential relationship: Comment has manu child Comments
            this.belongsTo(models.Comment, {
                foreignKey: 'parentId',
                as: 'children',
                onDelete: 'CASCADE',
            });

            // Define self-referential relationship: Comment belongs to a parent Comment
            this.belongsTo(models.Comment, {
                foreignKey: 'parentId',
                as: 'parent',
            });
        }
    }

    Comment.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            blogId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model: 'blogs',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            blogUserId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            comment: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            commentedBy: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            isReply: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            parentId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'comments',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            commentedAt: {
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
            modelName: 'Comment',
            tableName: 'comments',
            timestamps: false,
        }
    );
    return Comment;
}