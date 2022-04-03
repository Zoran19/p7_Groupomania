const bcrypt = require("bcrypt");
const models = require("../models");
const asyncLib = require("async");
const jwt = require("jsonwebtoken");

// Routes
module.exports = {
  /* register: function (req, res) {
    // Params
    let email = req.body.email;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let password = req.body.password;
    let bio = req.body.bio;

    if (
      email == null ||
      firstName == null ||
      lastName == null ||
      password == null
    ) {
      return res.status(400).json({ error: "missing parameters" });
    }

    if (firstName.length >= 13 || firstName.length <= 1) {
      return res
        .status(400)
        .json({ error: "wrong firstName (must be length 2 - 12)" });
    }

    if (lastName.length >= 13 || lastName.length <= 1) {
      return res
        .status(400)
        .json({ error: "wrong lastName (must be length 2 - 12)" });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "email is not valid" });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        error:
          "password invalid (must length 4 - 8 and include 1 number at least)",
      });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            attributes: ["email"],
            where: { email: email },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              console.error(err);
              return res.status(500).json({ error: "unable to verify user" });
            });
        },
        function (userFound, done) {
          if (!userFound) {
            bcrypt.hash(password, 5, function (err, bcryptedPassword) {
              done(null, userFound, bcryptedPassword);
            });
          } else {
            return res.status(409).json({ error: "user already exist" });
          }
        },
        function (userFound, bcryptedPassword, done) {
          let newUser = models.User.create({
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: bcryptedPassword,
            bio: bio,
            isAdmin: 0,
          })
            .then(function (newUser) {
              done(newUser);
            })
            .catch(function (err) {
              console.error(err);
              return res.status(500).json({ error: "cannot add user" });
            });
        },
      ],
      function (newUser) {
        if (newUser) {
          return res.status(201).json({
            userId: newUser.id,
          });
        } else {
          return res.status(500).json({ error: "cannot add user" });
        }
      }
    );
  },*/

  register: (req, res) => {
    models.User.findOne({ where: { email: req.body.email } }).then((user) => {
      if (user) {
        return res.status(401).json({ error: "email déja utilisé !" });
      } else {
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            models.User.create({
              email: req.body.email,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              password: hash,
              bio: req.body.bio,
              isAdmin: 0,
            })
              .then(() =>
                res.status(201).json({ message: "Utilisateur créé !" })
              )
              .catch((error) => res.status(400).json({ error }));
          })
          .catch((error) => res.status(500).json({ error }));
      }
    });
  },

  login: (req, res) => {
    if (req.body.email == null || req.body.password == null) {
      return res.status(400).json({ error: "missing parameters" });
    }
    models.User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              userId: user.id,
              token: jwt.sign(
                { userId: user.id },
                `${process.env.JWT_SECRET_KEY}`,

                { expiresIn: "24h" }
              ),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  },

  /*  login: function (req, res) {
    // Params
    let email = req.body.email;
    let password = req.body.password;

    if (email == null || password == null) {
      return res.status(400).json({ error: "missing parameters" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { email: email },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              console.log(err);
              return res.status(500).json({ error: "unable to verify user" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            bcrypt.compare(password, userFound.password, function (
              errBycrypt,
              resBycrypt
            ) {
              done(null, userFound, resBycrypt);
            });
          } else {
            return res.status(404).json({ error: "user not exist in DB" });
          }
        },
        function (userFound, resBycrypt, done) {
          if (resBycrypt) {
            done(userFound);
          } else {
            return res.status(403).json({ error: "invalid password" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json({
            userId: userFound.id,
            token: jwtUtils.generateTokenForUser(userFound),
          });
        } else {
          return res.status(500).json({ error: "cannot log on user" });
        }
      }
    );
  },*/

  getUserProfile: function (req, res) {
    // Getting auth header
    const userRes = res.locals.user;
    console.log("userid:", userRes.id);

    models.User.findOne({
      attributes: ["id", "email", "firstName", "lastName", "bio", "isAdmin"],
      where: { id: userRes.id },
    })
      .then(function (user) {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: "user not found" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "cannot fetch user" });
      });
  },

  updateUserProfile: function (req, res) {
    // Getting auth header
    // let userId = res.locals.user;

    // Params
    let bio = req.body.bio;

    asyncLib.waterfall(
      [
        // function (done) {
        //   models.User.findOne({
        //     attributes: ["id", "bio"],
        //     where: { id: userId },
        //   })
        //     .then(function (userFound) {
        //       done(null, userFound);
        //     })
        //     .catch(function (err) {
        //       return res.status(500).json({ error: "unable to verify user" });
        //     });
        // },
        function (done) {
          res.locals.user
            .update({
              bio: bio ? bio : res.locals.user.bio,
            })
            .then(function (userUpdated) {
              done(userUpdated);
            })
            .catch(function (err) {
              console.log(err);
              res.status(500).json({ error: "cannot update user" });
            });
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res.status(500).json({ error: "cannot update user profile" });
        }
      }
    );
  },

  deleteUserProfile: function (req, res) {
    // Getting auth header
    let userId = res.locals.user.id;

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              console.log(err);
              return res.status(500).json({ error: "unable to verify user" });
            });
        },
        function (userFound) {
          if (userFound) {
            models.Like.destroy({ where: { userId: userFound.id } }) //detruit la ou le user a like
              .then(() =>
                models.Publication.findAll({
                  where: { userId: userFound.id },
                })
              )
              .then((
                data // detruit les comm de ses publication
              ) =>
                models.Commentary.destroy({
                  where: { publicationId: data.id },
                })
              )
              .catch(function (err) {
                console.log(err);
                return res.status(500).json({
                  error:
                    "impossible de detruire les commentaire de ses publications",
                });
              })
              .then(() =>
                models.Publication.findAll({
                  //detruit tout les like de ses publications
                  where: { userId: userFound.id },
                })
              )
              .then((publi) =>
                models.Like.destroy({
                  where: { publicationId: publi.id },
                })
              )
              .catch(function (err) {
                console.log(err);
                return res.status(500).json({
                  error: "impossible de detruire les likes de ses publi",
                });
              })

              .then(() =>
                models.Publication.findAll({
                  //detruit  ses publications
                  where: { userId: userFound.id },
                })
              )
              .then(() =>
                models.Publication.destroy({
                  where: { userId: userFound.id },
                })
              )
              .catch(function (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ error: "impossible de detruire ses publi" });
              })
              .then(() =>
                models.User.destroy({
                  where: { id: userFound.id },
                })
              )
              .catch(function (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ error: "impossible de supprimer le user" });
              })

              .then(function () {
                res.status(201).json({ message: "user supprimé !" });
              })
              .catch(function (err) {
                console.log(err);
                res.status(500).json({ error: "impossible de supprimer user" });
              });
          } else {
            res.status(404).json({ error: "user not found" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res.status(500).json({ error: "cannot update user profile" });
        }
      }
    );
  },
};
