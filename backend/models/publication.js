
'use strict';
module.exports = (sequelize, DataTypes) => {
  var Publication = sequelize.define('Publication', {
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here

        models.Publication.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  });
  return Publication;
};