$(document).ready(function() {
    $.ajax({
        method: "GET",
        url: "/recent"
    }).then(data => {
        $("#recentWorkoutName").text(data.name);
        $("#recentCreated").text(moment(data.created).calendar());
        $("#recentId").attr("data-id", data._id);
        $("#recent .addNewExercise").attr("data-id", data._id);
        $("#recent .cancel").attr("data-id", data._id);

        data.exercises.forEach(exercise => {
            const entries = Object.entries(exercise);
            const exerciseDiv = $("<div class='exerciseContainer'>")
            for (const [key, value] of entries) {
                if (key !== "_id" && key !== "__v" && value !== null) {
                    const dataHTML = `<p>${key}: ${value}</p>`
                   exerciseDiv.append(dataHTML)
                }
            }
            $("#recent .exercises").append(exerciseDiv)
        });
    })

    $.ajax({
        method: "GET",
        url: "/previous"
    }).then(workouts => {
        console.log(workouts)
        workouts.forEach((workout, index) => {
            const workoutDiv = $(`<div id="${index}" class='prevWorkoutContainer'>`);
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
                const entries = Object.entries(exercise);
                const exerciseDiv = $("<div class='exerciseContainer'>")
                for (const [key, value] of entries) {
                    if (key !== "_id" && key !== "__v" && value !== null) {
                        const dataHTML = `<p>${key}: ${value}</p>`
                       exerciseDiv.append(dataHTML)
                    }
                }
                $(`#${index} .exercises`).append(exerciseDiv)
            });
        })
        
    })

    $(document).on("submit", ".addExercise", function(event) {
        event.preventDefault();
        $(this).hide();
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

        console.log(exerciseObj)

        $.ajax({
            method: "POST",
            data: exerciseObj,
            url: "/api/addexercise"
        }).then(data => {
            location.reload();
        })
    })

    $("#newWorkoutForm").on("submit", function(event) {
        event.preventDefault();
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
        })
    })

    $(document).on("click", ".addNewExercise", function() {
        $(`.addExercise[data-id=${$(this).data("id")}] `).show();
    })

    $(document).on("click", ".viewExercises", function() {
        $(this).hide();
        $(`.hideExercises[data-id=${$(this).data("id")}]`).show();
        $(`.exercises[data-id=${$(this).data("id")}] `).css("display", "flex");
    })

    $(document).on("click", ".hideExercises", function() {
        $(this).hide();
        $(`.viewExercises[data-id=${$(this).data("id")}]`).show();
        $(`.exercises[data-id=${$(this).data("id")}] `).hide();
    })

    $(document).on("click", ".cancel", function() {
        $(`.addExercise[data-id=${$(this).data("id")}] `).hide();
    })
})