import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class Notification extends Model {
        static associate(models){
            // Define relationship: Notification belongs to a Blog
            this.belongsTo(models.Blog, {
                foreignKey: 'blogId',
                as: 'blog',
            });

            // Define relationship: Notifs belong to User (notification_for)
            this.belongsTo(models.User, {
                foreignKey: 'notificationForId',
                as: 'recipient',
            });

            // Define relationship: Notifs belong to User (user)
            this.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'sender',
            });

            // Define relationship: Notifs belong to a Comment (comment)
            this.belongsTo(models.Comment, {
                foreignKey: 'commentId',
                as: 'comment',
            });

            // Define relationship: Notifs belong to a Comment (reply)
            this.belongsTo(models.Comment, {
                foreignKey: 'replyId',
                as: 'reply',
            });

            // Define relationship: Notifs belong to a Comment (replied_on_comment)
            this.belongsTo(models.Comment, {
                foreignKey: 'repliedOnCommentId',
                as: 'repliedOn',
            });
        }
    }

    Notification.init(
        {
            id: {
                allowNull: false,
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [['like', 'comment', 'reply']],
                },
            },
            blogId:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'blogs',
                    key: 'id',
                }
            },
            notificationForId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            commentId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'comments',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            replyId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'comments',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            repliedOnCommentId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'comments',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            seen: {
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
            modelName: 'Notification',
            tableName: 'notification',
        }
    );
    return Notification;
}