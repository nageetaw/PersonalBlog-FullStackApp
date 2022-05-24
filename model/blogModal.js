const mongoose = require("mongoose");

const postModalSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    postImage: { type: String, required: true },
  },
  { timestamps: true }
);
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    posts: [postModalSchema],
  },
  { timestamps: true }
);

const blogModal = mongoose.model("Blog", userSchema);
module.exports = blogModal;
