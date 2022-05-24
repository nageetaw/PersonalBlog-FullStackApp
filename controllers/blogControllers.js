const blogModal = require("../model/blogModal");
const path = require("path");
const localStorage = require("local-storage");
const mongoose = require("mongoose");

// const ObjectId = mongoose.Types.ObjectId;

const bcrypt = require("bcrypt");

async function home(req, res) {
  const posts = await blogModal.find(
    { posts: { $exists: true } },
    { _id: 0, posts: 1 }
  );
  let allPosts = [];
  posts.forEach((postArray) => {
    postArray.posts.forEach((post) => {
      allPosts.push(post);
    });
  });

  res.render("home", { posts: allPosts });
}

function login(req, res) {
  res.render("login");
}

async function login_post(req, res) {
  blogModal
    .findOne({ name: req.body.name })
    .then((response) => {
      bcrypt.compare(req.body.password, response.password, (error, matched) => {
        if (matched) {
          console.log("current user id when user login is" + response._id);
          localStorage.set("id", response._id);
          res.redirect("/post");
        } else res.send("Incorrect password");
      });
    })
    .catch((err) => {
      res.send(err);
    });
}
function logout(req, res) {
  localStorage.clear();
  res.redirect("/");
}
function register(req, res) {
  res.render("register");
}

function register_post(req, res) {
  const newUser = new blogModal({
    ...req.body,
  });
  newUser
    .save()
    .then((result) => {
      localStorage.set("id", result._id);
      res.redirect("/post");
    })
    .catch((err) => res.send(err));
}

async function post(req, res) {
  const currentUserId = localStorage.get("id");
  const userPostData = await blogModal.findOne(
    { _id: currentUserId },
    { _id: 0, posts: 1 }
  );
  if (userPostData) res.render("posts", { posts: userPostData.posts });
  else res.render("writePost");
}
function writePost(req, res) {
  res.render("writePost");
}
function savePost(req, res) {
  const { title, description } = req.body;
  const { postImage } = req.files;
  const currentUserId = localStorage.get("id");

  postImage.mv(
    path.resolve(__dirname, "../public/images", postImage.name),
    (error) => {
      if (!error) {
        console.log("current user is " + currentUserId);
        blogModal.updateOne(
          {
            _id: currentUserId,
          },
          {
            $push: {
              posts: { title, description, postImage: postImage.name },
            },
          },
          (err) => {
            if (err) {
              res.send(`Error: ` + err);
            } else res.redirect("/post");
          }
        );
      } else res.send(`Error: ` + error);
    }
  );
}

function deletePost(req, res) {
  const postId = req.params.id;
  const currentUserId = localStorage.get("id");
  blogModal
    .findOne({ _id: currentUserId })
    .then((result) => {
      result.posts.pull(postId);
      result.save();
      res.redirect("/post");
    })
    .catch((error) => res.send(error));
}

function search(req, res) {
  const { search } = req.body;
  blogModal
    .find(
      { "posts.title": { $regex: new RegExp(search, "i") } },
      { _id: 0, posts: 1 }
    )
    .then((result) => {
      console.log(result);
      let allPosts = [];
      result.forEach((postArray) => {
        postArray.posts.forEach((post) => {
          allPosts.push(post);
        });
      });

      res.render("home", { posts: allPosts });
    })
    .catch((err) => res.send(err));
}

function updatePost(req, res) {
  const postId = req.params.id;
  const currentUserId = localStorage.get("key");
  console.log("body " + req.body.length);
  if (req.files) {
    const { postImage } = req.files;
    postImage.mv(
      path.resolve(__dirname, "../public/images/", postImage.name),
      (err) => {
        if (!err) {
          blogModal
            .findOne({ "posts._id": postId })
            .then((result) => {
              result.posts.id(postId).title = req.body.title;
              result.posts.id(postId).description = req.body.description;
              result.posts.id(postId).postImage = postImage.name;

              result.save();
              res.redirect("/post");
            })
            .catch((error) => res.send(error));
        } else res.redirect("/post");
      }
    );
  } else {
    blogModal
      .findOne({ "posts._id": postId })
      .then((result) => {
        result.posts.id(postId).title = req.body.title;
        result.posts.id(postId).description = req.body.description;
        result.save();
        res.redirect("/post");
      })
      .catch((error) => res.send(error));
  }
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
  updatePost,
};
