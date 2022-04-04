"use strict";
module.exports = (sequelize, DataTypes) => {
  const Commentary = sequelize.define(
    "Commentary",
    {
      commentary: DataTypes.STRING,
    },
    {}
  );
  Commentary.associate = function (models) {
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
