const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: [3, "name is too short"],
      max: 28,
    },
    password: { type: String, required: true, min: [8, "to short"], max: 18 },
  },
  { timestamp: true }
);
const userModal = mongoose.model("Users", userSchema);
module.exports = userModal;

//-------------------Validation using mongoose--------------------
// var breakfastSchema = new Schema({
//   eggs: {
//     type: Number,
//     min: [6, "Too few eggs"],
//     max: 12,
//     required: [true, "Why no eggs?"],
//   },
//   drink: {
//     type: String,
//     enum: ["Coffee", "Tea", "Water"],
//   },
// });

// const Tank = mongoose.model("Tank", yourSchema);

// const small = new Tank({ size: "small" });
// small.save(function (err) {
//   if (err) return handleError(err);
//   // saved!
// });

// // or

// Tank.create({ size: "small" }, function (err, small) {
//   if (err) return handleError(err);
//   // saved!
// });

// // or, for inserting large batches of documents
// Tank.insertMany([{ size: "small" }], function (err) {});
