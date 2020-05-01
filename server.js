const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/populatedb", { useNewUrlParser: true });


// create a new workout
app.post("/api/workout", (req, res) => {
    db.Workout.create(req.body)
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
});

// get all workouts
app.get("/api/workout", (req, res) => {
    db.Workout.find()
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
});

// display all previous workouts
// with their exercises
app.get("/previous", (req, res) => {
    // sorts all the workouts by their id i.e.
    // the time created from the most recent
    // to the least and returns all workouts
    // but the most recent
    db.Workout.find().sort({ _id: -1 }).skip(1)
        .populate("exercises")
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
})

// give the most recent workout with
// their excercises
app.get("/recent", (req, res) => {
    // sorts all the workouts by their id i.e.
    // the time created from the most recent
    // to the least and returns the first
    // document which will be the most
    // recent workout created
    db.Workout.findOne().sort({ _id: -1 })
        .populate("exercises")
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        })
})

// add a new exercise to a workout
app.post("/api/addexercise", ({ body }, res) => {
    db.Exercise
        .create({
            name: body.name,
            type: body.type,
            duration: body.duration,
            weight: body.weight,
            sets: body.sets,
            reps: body.reps,
            distance: body.distance
        })
        // find the workout and add the new exercises to its array of exercises
        // and return the newly updated document
        .then(({ _id }) => db.Workout.findOneAndUpdate({ _id: body.id }, { $push: { exercises: _id } }, { new: true }))
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});
