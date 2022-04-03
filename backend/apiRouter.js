// Imports
let express = require("express");
let usersCtrl = require("./routes/usersCtrl");
let publicationsCtrl = require("./routes/publicationsCtrl");
let likesCtrl = require("./routes/likesCtrl");
let commentaryCtrl = require("./routes/commentaryCtrl");
const uploadCtrl = require("./routes/upload");
const auth = require("../backend/middleware/auth");
//const multers = require("../backend/middleware/multer-config");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
// TODO: Il n'y a pas de restrictions sur le type de fichier ou la taille
const uploadMiddleware = multer({ storage: storage });

// Router
exports.router = (function () {
  let apiRouter = express.Router();

  // Users routes
  apiRouter.post("/users/register/", usersCtrl.register);
  apiRouter.post("/users/login/", usersCtrl.login);
  apiRouter.get("/users/me/", auth, usersCtrl.getUserProfile);
  apiRouter.put("/users/me/", auth, usersCtrl.updateUserProfile);
  apiRouter.delete("/users/me/", auth, usersCtrl.deleteUserProfile);

  // publications routes
  apiRouter.post("/publications", auth, publicationsCtrl.createPublication);
  apiRouter.get("/publications/", auth, publicationsCtrl.listPublications);
  apiRouter.delete(
    "/publications/:publicationId",
    auth,
    publicationsCtrl.deletePublication
  );
  apiRouter.put(
    "/publications/:publicationId",
    auth,
    publicationsCtrl.updatePublication
  );

  // Likes
  apiRouter.post(
    "/publications/:publicationId/vote/like",
    auth,
    likesCtrl.likePost
  );
  apiRouter.post(
    "/publications/:publicationId/vote/dislike",
    auth,
    likesCtrl.dislikePost
  );

  //Commentary
  apiRouter.post(
    "/publications/:publicationId/comments",
    auth,
    commentaryCtrl.createCommentary
  );
  apiRouter.get(
    "/publications/comments",
    auth,
    commentaryCtrl.listCommentaries
  );
  apiRouter.get(
    "/publications/:publicationId/comments",
    auth,
    commentaryCtrl.listCommentariesById
  );
  apiRouter.delete(
    "/publications/:publicationId/comments/:commentaryId",
    auth,
    commentaryCtrl.deleteCommentary
  );
  apiRouter.put(
    "/publications/:publicationId/comments/:commentaryId",
    auth,
    commentaryCtrl.updateCommentary
  );

  // Upload route
  apiRouter.post(
    "/upload",
    // auth,
    uploadMiddleware.single("file"),
    uploadCtrl.upload
  );

  return apiRouter;
})();
