// Imports
var models = require("../models");
var jwtUtils = require("../utils/jwt.utils");
var asyncLib = require("async");

// Constants
const DISLIKED = 0;
const LIKED = 1;

// Routes
module.exports = {
  likePost: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    // Params
    var publicationId = parseInt(req.params.publicationId);

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
            res.status(404).json({ error: "post already liked" });
          }
        },
        function (publicationFound, userFound, done) {
          if (userFound) {
            models.Like.findOne({
              where: {
                userId: userId,
                publicationId: publicationId,
              },
            })
              .then(function (userAlreadyLikedFound) {
                done(null, publicationFound, userFound, userAlreadyLikedFound);
              })
              .catch(function (err) {
                console.error(err);
                return res
                  .status(500)
                  .json({ error: "unable to verify is user already liked" });
              });
          } else {
            res.status(404).json({ error: "user not exist" });
          }
        },
        function (publicationFound, userFound, userAlreadyLikedFound, done) {
          if (!userAlreadyLikedFound) {
            publicationFound
              .addUser(userFound, { isLike: LIKED })
              .then(function (alreadyLikeFound) {
                done(null, publicationFound, userFound);
              })
              .catch(function (err) {
                console.error(err);
                return res
                  .status(500)
                  .json({ error: "unable to set user reaction" });
              });
          } else {
            if (userAlreadyLikedFound.isLike === DISLIKED) {
              userAlreadyLikedFound
                .update({
                  isLike: LIKED,
                })
                .then(function () {
                  done(null, publicationFound, userFound);
                })
                .catch(function (err) {
                  console.error(err);
                  res
                    .status(500)
                    .json({ error: "cannot update user reaction" });
                });
            } else {
              res.status(409).json({ error: "publication already liked" });
            }
          }
        },
        function (publicationFound, userFound, done) {
          publicationFound
            .update({
              likes: publicationFound.likes + 1,
            })
            .then(function () {
              done(publicationFound);
            })
            .catch(function (err) {
              console.error(err);
              res
                .status(500)
                .json({ error: "cannot update publication like counter" });
            });
        },
      ],
      function (publicationFound) {
        if (publicationFound) {
          return res.status(201).json(publicationFound);
        } else {
          return res.status(500).json({ error: "cannot update publication" });
        }
      }
    );
  },
  dislikePost: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwtUtils.getUserId(headerAuth);

    // Params
    var publicationId = parseInt(req.params.publicationId);

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
            res.status(404).json({ error: "post already liked" });
          }
        },
        function (publicationFound, userFound, done) {
          if (userFound) {
            models.Like.findOne({
              where: {
                userId: userId,
                publicationId: publicationId,
              },
            })
              .then(function (userAlreadyLikedFound) {
                done(null, publicationFound, userFound, userAlreadyLikedFound);
              })
              .catch(function (err) {
                console.error(err);
                return res
                  .status(500)
                  .json({ error: "unable to verify is user already liked" });
              });
          } else {
            res.status(404).json({ error: "user not exist" });
          }
        },
        function (publicationFound, userFound, userAlreadyLikedFound, done) {
          if (!userAlreadyLikedFound) {
            publicationFound
              .addUser(userFound, { isLike: DISLIKED })
              .then(function (alreadyLikeFound) {
                done(null, publicationFound, userFound);
              })
              .catch(function (err) {
                console.error(err);
                return res
                  .status(500)
                  .json({ error: "unable to set user reaction" });
              });
          } else {
            if (userAlreadyLikedFound.isLike === LIKED) {
              userAlreadyLikedFound
                .update({
                  isLike: DISLIKED,
                })
                .then(function () {
                  done(null, publicationFound, userFound);
                })
                .catch(function (err) {
                  console.error(err);
                  res
                    .status(500)
                    .json({ error: "cannot update user reaction" });
                });
            } else {
              res.status(409).json({ error: "publication already disliked" });
            }
          }
        },
        function (publicationFound, userFound, done) {
          publicationFound
            .update({
              likes: publicationFound.likes - 1,
            })
            .then(function () {
              done(publicationFound);
            })
            .catch(function (err) {
              console.error(err);
              res
                .status(500)
                .json({ error: "cannot update publication like counter" });
            });
        },
      ],
      function (publicationFound) {
        if (publicationFound) {
          return res.status(201).json(publicationFound);
        } else {
          return res.status(500).json({ error: "cannot update publication" });
        }
      }
    );
  },
};
