"use strict";
module.exports = (sequelize, DataTypes) => {
  let Like = sequelize.define(
    "Like",
    {
      publicationId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Publication",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      isLike: DataTypes.INTEGER,
    },
    {}
  );
  Like.associate = function (models) {
    // associations can be defined here

    models.User.belongsToMany(models.Publication, {
      through: models.Like,
      foreignKey: "userId",
      otherKey: "publicationId",
    });

    models.Publication.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: "publicationId",
      otherKey: "userId",
    });

    models.Like.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    models.Like.belongsTo(models.Publication, {
      foreignKey: "publicationId",
      as: "publication",
    });
  };
  return Like;
};
