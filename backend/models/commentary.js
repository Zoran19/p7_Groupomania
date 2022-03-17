"use strict";
module.exports = (sequelize, DataTypes) => {
  var Commentary = sequelize.define(
    "Commentary",
    {
      // publicationId: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     model: "Publication",
      //     key: "id",
      //   },
      // },
      // userId: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     model: "User",
      //     key: "id",
      //   },
      // },
      commentary: DataTypes.STRING,
    },
    {}
  );
  Commentary.associate = function (models) {
    // associations can be defined here

    /* models.User.belongsToMany(models.Publication, {
      through: models.Commentary,
      foreignKey: "userId",
      otherKey: "publicationId",
    });*/

    /* models.Publication.belongsToMany(models.User, {
      through: models.Commentary,
      foreignKey: "publicationId",
      otherKey: "userId",
    });*/

    models.Commentary.belongsTo(models.User, {
      foreignKey: {
        allowNull: "userId",
        as: "user",
      },
    });

    models.Commentary.belongsTo(models.Publication, {
      foreignKey: "publicationId",
      as: "publication",
    });
  };
  return Commentary;
};
