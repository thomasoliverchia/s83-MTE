const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/Workoutcontroller");
const auth = require("../auth");

// All workout routes are protected — user must be authenticated
router.post("/addWorkout",              auth, workoutController.addWorkout);
router.get("/getMyWorkouts",            auth, workoutController.getMyWorkouts);
router.put("/updateWorkout/:id",        auth, workoutController.updateWorkout);
router.delete("/deleteWorkout/:id",     auth, workoutController.deleteWorkout);
router.patch("/completeWorkoutStatus/:id", auth, workoutController.completeWorkoutStatus);

module.exports = router;