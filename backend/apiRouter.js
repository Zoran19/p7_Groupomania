// Imports
let express = require("express");
let usersCtrl = require("./routes/usersCtrl");
let publicationsCtrl = require("./routes/publicationsCtrl");
let likesCtrl = require("./routes/likesCtrl");
let commentaryCtrl = require("./routes/commentaryCtrl");

// Router
exports.router = (function () {
  let apiRouter = express.Router();

  // Users routes
  apiRouter.route("/users/register/").post(usersCtrl.register);
  apiRouter.route("/users/login/").post(usersCtrl.login);
  apiRouter.route("/users/me/").get(usersCtrl.getUserProfile);
  apiRouter.route("/users/me/").put(usersCtrl.updateUserProfile);
  const multer = require("../middleware/multer-config");

  // publications routes
  apiRouter
    .route("/publications")
    .post(multer, publicationsCtrl.createPublication);
  apiRouter.route("/publications/").get(publicationsCtrl.listPublications);
  apiRouter
    .route("/publications/:publicationId")
    .delete(publicationsCtrl.deletePublication);
  apiRouter
    .route("/publications/:publicationId")
    .put(publicationsCtrl.updatePublication);

  // Likes
  apiRouter
    .route("/publications/:publicationId/vote/like")
    .post(likesCtrl.likePost);
  apiRouter
    .route("/publications/:publicationId/vote/dislike")
    .post(likesCtrl.dislikePost);

  //Commentary
  apiRouter
    .route("/publications/:publicationId/comments")
    .post(commentaryCtrl.createCommentary);

  apiRouter
    .route("/publications/comments")
    .get(commentaryCtrl.listCommentaries);
  apiRouter
    .route("/publications/:publicationId/comments")
    .get(commentaryCtrl.listCommentariesById);

  apiRouter
    .route("/publications/:publicationId/comments/:commentaryId")
    .delete(commentaryCtrl.deleteCommentary);

  apiRouter
    .route("/publications/:publicationId/comments/:commentaryId")
    .put(commentaryCtrl.updateCommentary);

  return apiRouter;
})();
