"use strict";
module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define("User", {
    email: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
  });
  return User;
};
