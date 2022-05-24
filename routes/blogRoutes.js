const express = require("express");
const blogController = require("../controllers/blogControllers");
const authenticationMiddleware = require("../middleware/authenticationMiddlewares");

const blogRoutes = express();
blogRoutes.get("/", blogController.home);

blogRoutes.get("/login", blogController.login);
blogRoutes.get("/logout", blogController.logout);
blogRoutes.post(
  "/login",
  authenticationMiddleware.checkRequiredFields,
  blogController.login_post
);
blogRoutes.get("/register", blogController.register);
blogRoutes.post(
  "/register",
  authenticationMiddleware.decryptPasswordMiddleWare,
  blogController.register_post
);
blogRoutes.get("/post", blogController.post);
blogRoutes.get("/writePost", blogController.writePost);
blogRoutes.post("/savePost", blogController.savePost);
blogRoutes.get("/deletePost/:id", blogController.deletePost);
blogRoutes.post("/search", blogController.search);
blogRoutes.post("/updatePost/:id", blogController.updatePost);
module.exports = blogRoutes;
