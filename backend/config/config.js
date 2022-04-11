module.exports = {
  development: {
    username: process.env.USERNAME_BDD,
    password: process.env.PASSWORD_BDD,
    database: process.env.NAME_BDD,
    host: process.env.HOST_BDD,
    dialect: `${process.env.DIALECT_BDD}`,
  },
};
