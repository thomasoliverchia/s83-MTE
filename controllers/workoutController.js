const Workout = require("../models/Workout");

// POST /workouts/addWorkout
module.exports.addWorkout = async (req, res) => {
  try {
    const { name, duration, status } = req.body;

    // userId comes from the verified JWT token — never from the request body
    const newWorkout = new Workout({
      name,
      duration,
      status,
      userId: req.user.userId,
    });

    await newWorkout.save();

    return res.status(201).json({
      message: "Workout added successfully",
      workout: newWorkout,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /workouts/getMyWorkouts
module.exports.getMyWorkouts = async (req, res) => {
  try {
    // Only return workouts belonging to the logged-in user
    const workouts = await Workout.find({ userId: req.user.userId });

    return res.status(200).json({ workouts });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /workouts/updateWorkout/:id
module.exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Only the owner can update their workout
    if (workout.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    const { name, duration, status } = req.body;

    // Only update fields that were actually provided
    if (name !== undefined) workout.name = name;
    if (duration !== undefined) workout.duration = duration;
    if (status !== undefined) workout.status = status;

    await workout.save();

    return res.status(200).json({
      message: "Workout updated successfully",
      workout,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /workouts/deleteWorkout/:id
module.exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Only the owner can delete their workout
    if (workout.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    await workout.deleteOne();

    return res.status(200).json({ message: "Workout deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /workouts/completeWorkoutStatus/:id
module.exports.completeWorkoutStatus = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Only the owner can mark their workout as complete
    if (workout.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    workout.status = "completed";
    await workout.save();

    return res.status(200).json({
      message: "Workout marked as completed",
      workout,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
