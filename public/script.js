$(document).ready(function() {
    // create a div that holds all the
    // information for a exercise
    function createExerciseDiv(exercise) {
        // converts all exercise properties into
        // an array [[key, value], [key..., value...]]
        const entries = Object.entries(exercise);
        const exerciseDiv = $("<div class='exerciseContainer'>")
        for (const [key, value] of entries) {
            // display all exercise properties that aren't the 
            // id, version and not null
            if (key !== "_id" && key !== "__v" && value !== null) {
                const dataHTML = `<p>${key}: ${value}</p>`
               exerciseDiv.append(dataHTML)
            }
        }
        return exerciseDiv;
    }
    
    // get the most recent workout and display its exercises
    $.ajax({
        method: "GET",
        url: "/recent"
    }).then(data => {
        if (data !== null) {
            $("#recent").show();
            // populate headings/buttons with workout info
            $("#recentWorkoutName").text(data.name);
            $("#recentCreated").text(moment(data.created).calendar());
            $("#recentId").attr("data-id", data._id);
            $("#recent .addNewExercise").attr("data-id", data._id);
            $("#recent .cancel").attr("data-id", data._id);
    
            data.exercises.forEach(exercise => {
                $("#recent .exercises").append(createExerciseDiv(exercise))
            });
        }
    });

    // display all previous workouts and their exercises
    $.ajax({
        method: "GET",
        url: "/previous"
    }).then(workouts => {
        // loops through each workout, creates a div for it and
        // populate it with divs for its exercises
        workouts.forEach((workout, index) => {
            const workoutDiv = $(`<div id="${index}" class='prevWorkoutContainer'>`);
            // html for each workout
            const titleHTML = `
                <h3>${workout.name}</h3>
                <p>${moment(workout.created).calendar()}</p>
                <button class="viewExercises" type="button" data-id=${workout._id}>View Exercises</button>
                <button class="hideExercises" type="button" data-id=${workout._id}>Hide Exercises</button>
                <div class="exercises" data-id=${workout._id}></div>
                <button class="addNewExercise" type="button" data-id=${workout._id}>Add A New Exercise</button>
                <form class="addExercise" data-id=${workout._id}>
                    <input type="text" name="exerciseName" placeholder="Exercise Name" required>
                    <input type="text" name="exerciseType" placeholder="Exercise Type" required>
                    <input type="number" name="duration" placeholder="Duration (minutes)" required>
                    <input type="number" name="distance" placeholder="Distance">
                    <input type="number" name="weight" placeholder="Weight">
                    <input type="number" name="reps" placeholder="Reps">
                    <input type="number" name="sets" placeholder="Sets">
                    <button type="submit">Add Exercise</button>
                    <button type="button" class="cancel" data-id=${workout._id}>Cancel</button>
                </form>
            `
            workoutDiv.append(titleHTML)
            $("#previous").append(workoutDiv)

            workout.exercises.forEach(exercise => {
                $(`#${index} .exercises`).append(createExerciseDiv(exercise))
            });
        });
    });

    // event listener on the form to add a new exercise
    $(document).on("submit", ".addExercise", function(event) {
        event.preventDefault();
        $(this).hide();
        
        // build the new exercise object
        const exerciseObj = {
            id: $(this).data('id'),
            name: $(this).find(":input[name=exerciseName]").val().trim(),
            type: $(this).find(":input[name=exerciseType]").val().trim(),
            duration: $(this).find(":input[name=duration]").val(),
            distance: $(this).find(":input[name=distance]").val(),
            weight: $(this).find(":input[name=weight]").val(),
            reps: $(this).find(":input[name=reps]").val(),
            sets: $(this).find(":input[name=sets]").val()
        } 

        // make a POST request to create exercise
        // and then reload the page to display
        // newly added exercise
        $.ajax({
            method: "POST",
            data: exerciseObj,
            url: "/api/addexercise"
        }).then(data => {
            location.reload();
        });
    });

    // event listener on the form to create a new workout
    $("#newWorkoutForm").on("submit", function(event) {
        event.preventDefault();
        
        // make a POST request to create a new workout
        // then reload the page to display the newly
        // created workout
        $.ajax({
            method: "POST",
            data: { name: $("#newWorkout").val().trim() },
            url: "/api/workout"
        })
        .then(data => {
            location.reload();
        })
        .catch(err => {
            console.log(err);
        });
    });

    // display the add exercise form for the specific
    // workout it was clicked in
    $(document).on("click", ".addNewExercise", function() {
        $(`.addExercise[data-id=${$(this).data("id")}] `).show();
    });

    // display all the exercises for the specific
    // workout the button was clicked in
    $(document).on("click", ".viewExercises", function() {
        // hide 'View Exercises' button, show 'Hide Exercises' button
        // and display the exercises
        $(this).hide();
        $(`.hideExercises[data-id=${$(this).data("id")}]`).show();
        $(`.exercises[data-id=${$(this).data("id")}] `).css("display", "flex");
    });

    // hide all the exercises for the specific workout
    // the button was clicked in
    $(document).on("click", ".hideExercises", function() {
        // hide 'Hide Exercises' button, show 'View Exercises' button
        // and hide the exercises
        $(this).hide();
        $(`.viewExercises[data-id=${$(this).data("id")}]`).show();
        $(`.exercises[data-id=${$(this).data("id")}] `).hide();
    });

    // hide the add exercise form for the workout
    // the button was clicked in
    $(document).on("click", ".cancel", function() {
        $(`.addExercise[data-id=${$(this).data("id")}]`).hide();
    });
})