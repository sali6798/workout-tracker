const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: {
      type: String,
      trim: true,
      required: "Exercise name required"
  },
  type: {
      type: String,
      trim: true,
      required: "Exercise type required"
  },
  duration: {
      type: Number,
      required: "Duration required"
  },
  weight: Number,
  sets: Number,
  reps: Number,
  distance: Number

});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
