// Imports
const models = require("../models");
const asyncLib = require("async");

const ITEMS_LIMIT = 50;
// Routes
module.exports = {
  createCommentary: function (req, res) {
    // Getting auth header
    let userId = res.locals.user.id;

    // Params
    let publicationId = parseInt(req.params.publicationId);
    const commentary = req.body.commentary;

    if (commentary == null) {
      return res.status(400).json({ error: "missing parameters" });
    }

    if (publicationId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.Publication.findOne({
            where: { id: publicationId },
          })
            .then(function (publicationFound) {
              done(null, publicationFound);
            })
            .catch(function (err) {
              console.error(err);
              return res
                .status(500)
                .json({ error: "unable to verify publication" });
            });
        },
        function (publicationFound, done) {
          if (publicationFound) {
            models.User.findOne({
              where: { id: userId },
            })
              .then(function (userFound) {
                done(null, publicationFound, userFound);
              })
              .catch(function (err) {
                console.error(err);
                return res.status(500).json({ error: "unable to verify user" });
              });
          } else {
            res.status(404).json({ error: "publication doesn't exist" });
          }
        },
        function (userFound, publicationFound, done) {
          if (userFound && publicationFound) {
            models.Commentary.create({
              commentary,
              publicationId,
              UserId: userId,
            })
              .then(function (newCommentary) {
                done(newCommentary);
              })
              .catch((e) =>
                res.status(404).json({ error: "foo error", foo: e })
              );
          } else {
            res.status(404).json({ error: "user or publication  not found" });
          }
        },
      ],
      function (newCommentary) {
        if (newCommentary) {
          return res.status(201).json(newCommentary);
        } else {
          return res.status(500).json({ error: "cannot post commentary" });
        }
      }
    );
  },

  listCommentariesById: function (req, res) {
    // Params
    let publicationId = parseInt(req.params.publicationId);
    if (publicationId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);

    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    asyncLib.waterfall([
      function (done) {
        models.Publication.findOne({
          where: { id: publicationId },
        })
          .then(function (publicationFound) {
            done(null, publicationFound);
          })
          .catch(function (err) {
            console.error(err);
            return res
              .status(500)
              .json({ error: "unable to verify publication" });
          });
      },

      function (publicationFound) {
        if (publicationFound) {
          models.Commentary.findAll({
            where: { publicationId: publicationId },
            limit: !isNaN(limit) ? limit : null,
            offset: !isNaN(offset) ? offset : null,
            include: [
              {
                model: models.User,
                attributes: ["firstName", "lastName"],
              },
            ],
          })
            .then(function (commentaries) {
              if (commentaries) {
                res.status(200).json(commentaries);
              } else {
                res.status(404).json({ error: "no commentaries found" });
              }
            })
            .catch(function (err) {
              console.log(err);
              res.status(500).json({ error: "invalid fields" });
            });
        } else {
          res.status(404).json({ error: "commentaries  not found" });
        }
      },
    ]);
  },

  listCommentaries: function (req, res) {
    // Params

    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);

    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    asyncLib.waterfall([
      function () {
        {
          models.Commentary.findAll({
            limit: !isNaN(limit) ? limit : null,
            offset: !isNaN(offset) ? offset : null,
            include: [
              {
                model: models.User,
                attributes: ["firstName", "lastName"],
              },
            ],
          })
            .then(function (commentaries) {
              if (commentaries) {
                res.status(200).json(commentaries);
              } else {
                res.status(404).json({ error: "no commentaries found" });
              }
            })
            .catch(function (err) {
              console.log(err);
              res.status(500).json({ error: "invalid fields" });
            });
        }
      },
    ]);
  },

  deleteCommentary: async function (req, res) {
    // Getting auth header
    let userId = res.locals.user.id;
    const user = await models.User.findOne({ where: { id: userId } });
    // Params
    let publicationId = parseInt(req.params.publicationId);
    let commentaryId = parseInt(req.params.commentaryId);

    if (publicationId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    models.Commentary.findOne({ where: { id: commentaryId } })
      .then((post) => {
        console.log("user.isAdmin", user.isAdmin);
        if (post.UserId === userId || user.isAdmin) {
          post
            .destroy({
              where: { id: commentaryId },
            })
            .then(() =>
              res.status(201).json({ message: "commentaire supprim?? !" })
            )
            .catch((error) =>
              res.status(400).json({ error, message: error.message })
            )

            .catch((error) =>
              res.status(400).json({ error, message: error.message })
            );
        } else {
          res.status(401).json({
            message: "Vous n'??tes pas autoris?? ?? supprimer ce post !",
          });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "impossible de trouver la publication" });
      });
  },

  updateCommentary: async function (req, res) {
    // Getting auth header
    let userId = res.locals.user.id;
    const user = await models.User.findOne({ where: { id: userId } });
    // Params
    let publicationId = parseInt(req.params.publicationId);
    let commentaryId = parseInt(req.params.commentaryId);

    if (publicationId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    await models.Commentary.findOne({ where: { id: commentaryId } })
      .then((post) => {
        console.log("user.isAdmin", user.isAdmin);
        if (post.UserId === userId || user.isAdmin) {
          post
            .update({
              commentary: req.body.commentary,
            })
            .then(() =>
              res.status(201).json({ message: "commentaire modifi?? !" })
            )
            .catch((error) => res.status(400).json({ message: error.message }));
        } else {
          res.status(401).json({
            message: "Vous n'??tes pas autoris?? ?? modifier ce post !",
          });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "impossible de trouver la publication" });
      });
  },
};
