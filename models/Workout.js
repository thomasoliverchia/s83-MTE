const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },

  name: {
    type: String,
    required: [true, "Workout name is required"],
  },

  duration: {
    type: String,
    required: [true, "Duration is required"],
  },

  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },

  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Workout", workoutSchema);