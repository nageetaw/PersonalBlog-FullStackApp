const postModal = require("../model/postModal");
const path = require("path");
const userModal = require("../model/user");
const bcrypt = require("bcrypt");

async function home(req, res) {
  const posts = await postModal.find();
  res.render("home", { posts });
}

function login(req, res) {
  res.render("login");
}

async function login_post(req, res) {
  userModal
    .findOne({ name: req.body.name })
    .then((response) => {
      bcrypt.compare(req.body.password, response.password, (error, matched) => {
        if (matched) res.redirect("/post");
        else res.send("Incorrect password");
      });
    })
    .catch((err) => {
      res.send(err);
    });
}
function logout(req, res) {
  res.redirect("/");
}
function register(req, res) {
  res.render("register");
}

function register_post(req, res) {
  const newUser = new userModal({
    ...req.body,
  });
  newUser
    .save()
    .then((result) => res.redirect("/post"))
    .catch((err) => res.send(err));
}
async function post(req, res) {
  const posts = await postModal.find();
  res.render("posts", { posts });
}
function writePost(req, res) {
  res.render("writePost");
}
function savePost(req, res) {
  const { title, description } = req.body;
  const { postImage } = req.files;
  console.log(__dirname);
  postImage.mv(
    path.resolve(__dirname, "../public/images", postImage.name),
    (error) => {
      if (!error) {
        const newPost = new postModal({
          title,
          description,
          postImage: postImage.name,
        });
        newPost
          .save()
          .then((result) => res.redirect("/post"))
          .catch((error) => res.redirect("/writePost"));
      } else res.send(error);
    }
  );
}

function deletePost(req, res) {
  const id = req.params.id;

  postModal.findOneAndDelete(
    {
      _id: id,
    },
    (err, doc) => {
      if (err) {
        console.log(`Error: ` + err);
      }
      return res.redirect("/post");
    }
  );
}

function search(req, res) {
  const { search } = req.body;
  postModal
    .find({ title: { $regex: search } })
    .then((result) => res.render("home", { posts: result }))
    .catch((err) => res.redirect("/"));
}
module.exports = {
  home,
  login,
  register,
  post,
  writePost,
  savePost,
  deletePost,
  login_post,
  register_post,
  logout,
  search,
};
