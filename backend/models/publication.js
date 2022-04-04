"use strict";
module.exports = (sequelize, DataTypes) => {
  let Publication = sequelize.define(
    "Publication",
    {
      content: DataTypes.STRING,
      attachment: DataTypes.STRING,
      likes: DataTypes.INTEGER,
    },
    {
      //classMethods: {
      //  associate: function (models) {
      //    // associations can be defined here
      //    models.Publication.belongsTo(models.User, {
      //      foreignKey: {
      //        allowNull: false,
      //      },
      //    });
      //  },
      //},
    }
  );
  Publication.associate = function (models) {
    models.Publication.belongsTo(models.User, {
      foreignKey: "UserId",
      as: "user",
    });
  };
  return Publication;
};
