"use strict";
module.exports = (sequelize, DataTypes) => {
  let Publication = sequelize.define("Publication", {
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER,
  });
  Publication.associate = function (models) {
    models.Publication.belongsTo(models.User, {
      foreignKey: "UserId",
      as: "user",
    });
  };
  return Publication;
};
