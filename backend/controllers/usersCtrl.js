const bcrypt = require("bcrypt");
const models = require("../models");
const asyncLib = require("async");
const jwt = require("jsonwebtoken");

// Routes
module.exports = {
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
    let userId = res.locals.user;

    // Params
    let bio = req.body.bio;

    asyncLib.waterfall(
      [
        function (done) {
          userId
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

    if (userId) {
      models.Like.destroy({ where: { userId: userId } }) //detruit la ou le user a like
        .then(() => models.Publication.findAll({ where: { userId: userId } })) // detruit les commentaire de ses publications
        .catch(function (err) {
          console.log(err);
          return res.status(500).json({
            error: "impossible de récupérer les publications du user ",
          });
        })
        .then((data) =>
          data.map((element) =>
            models.Commentary.destroy({ where: { publicationId: element.id } })
          )
        )
        .catch(function (err) {
          console.log(err);
          return res.status(500).json({
            error:
              "impossible de detruire les commentaires de ses publications",
          });
        })

        .then(() => models.Publication.findAll({ where: { userId: userId } })) //detruit tout les like de ses publications
        .catch(function (err) {
          console.log(err);
          return res.status(500).json({
            error: "impossible récupérer les publications du user",
          });
        })
        .then((data) =>
          data.map((element) =>
            models.Like.destroy({ where: { publicationId: element.id } })
          )
        )
        .catch(function (err) {
          console.log(err);
          return res.status(500).json({
            error: "impossible de detruire les likes de ses publi",
          });
        })

        .then(() => models.Publication.destroy({ where: { userId: userId } })) //detruit ses publications
        .catch(function (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "impossible de detruire ses publications" });
        })
        .then(() => models.Commentary.destroy({ where: { userId: userId } }))
        .catch(function (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "impossible de supprimer les comm" });
        }) // supprimer les comm du user
        .then(() => models.User.destroy({ where: { id: userId } })) //supprime le user
        .catch(function (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "impossible de supprimer le user" });
        })

        .then(function () {
          res.status(201).json({ message: "user supprimé !" });
        });
    } else {
      res.status(404).json({ error: "user not found" });
    }
  },
};
