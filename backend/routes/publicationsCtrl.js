const models = require("../models");

const ITEMS_LIMIT = 50;

// Routes
module.exports = {
  createPublication: function (req, res) {
    // Getting auth header
    let userId = res.locals.user.id;

    // Params
    let content = req.body.content;

    if (content == null) {
      return res.status(400).json({ error: "missing parameters" });
    }

    models.Publication.create({
      content: content,
      attachment: req.body.attachment,
      likes: 0,
      UserId: userId,
    })
      .then(() => res.status(201).json({ message: "publi créer!" }))
      .catch((error) =>
        res.status(400).json({ error, message: error.message })
      );
  },
  listPublications: function (req, res) {
    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);

    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    models.Publication.findAll({
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.User,
          attributes: ["firstName", "lastName"],
        },
      ],
    })
      .then(function (publications) {
        if (publications) {
          res.status(200).json(publications);
        } else {
          res.status(404).json({ error: "no publications found" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "invalid fields" });
      });
  },

  deletePublication: async function (req, res) {
    // Getting auth header
    let userId = res.locals.user.id;
    const user = await models.User.findOne({ where: { id: userId } });
    // Params
    let publicationId = parseInt(req.params.publicationId);

    if (publicationId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    models.Publication.findOne({ where: { id: publicationId } })
      .then((post) => {
        if (post.UserId === userId || user.isAdmin) {
          models.Like.destroy({ where: { publicationId: publicationId } })
            .then(() =>
              models.Commentary.destroy({
                where: { publicationId: publicationId },
              })
            )
            .then(() =>
              models.Publication.destroy({ where: { id: publicationId } })
                .then(() =>
                  res.status(201).json({ message: "publication supprimé !" })
                )
                .catch((error) =>
                  res.status(400).json({ error, message: error.message })
                )
            )
            .catch((error) =>
              res.status(400).json({ error, message: error.message })
            );
        } else {
          res.status(401).json({
            message: "Vous n'êtes pas autorisé à supprimer ce post !",
          });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "impossible de trouver la publication" });
      });
  },

  updatePublication: async function (req, res) {
    // Getting auth header
    let userId = res.locals.user.id;
    const user = await models.User.findOne({ where: { id: userId } });
    // Params
    let publicationId = parseInt(req.params.publicationId);

    if (publicationId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    models.Publication.findOne({ where: { id: publicationId } })
      .then((post) => {
        if (post.UserId === userId || user.isAdmin) {
          post
            .update({
              content: req.body.content,
            })
            .then(res.status(201).json({ message: "publication modifié !" }))
            .catch((error) =>
              res.status(400).json({ error, message: error.message })
            );
        } else {
          res.status(401).json({
            message: "Vous n'êtes pas autorisé à modifier ce post !",
          });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "impossible de trouver la publication" });
      });
  },
};
