const mongoose = require("mongoose");

const postModalSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    postImage: { type: String, required: true },
  },
  { timestamps: true }
);
const postModal = mongoose.model("Blog", postModalSchema);
module.exports = postModal;
