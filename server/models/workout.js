const mongoose = require('mongoose');

const workoutSchema = mongoose.Schema(
    {
        name: { // personal name of the workout
            type: String, 
            required: [true, 'Workout name is required'],
        }, 
        type: {
            type: String, 
            required: [true, 'Type is required']
        },
        duration: { 
            type: Number, // duration in minutes
            required: [true, 'Duration is required'], 
            min: [0, 'Duration must be a positive number'],
        }, 
        distance: { // length in miles
            type: Number, 
            required: [true, 'Distance is required'], 
            min: [0, 'Distance must be a positive number'],
        }, 
        start_date_local: { // date of the workout based on user's location
            type: Date, 
            default: Date.now, 
            required: [true, 'Start date is required']
        }, 
        location: { 
            type: String, 
            required: [true, 'Location is required']
        }, 
        air_quality: {
            type: Number
        },
        caloriesBurned: { // calories burned during the workout 
            type: Number, 
            min: [0, 'Calories burned must be a positive number'],
            default: 0
        }, 
        notes: { // any notes on the workout
            type: String,
            maxlength: [500, 'Notes cannot exceed 500 characters']
        }, 
        image: {
            data: Buffer,
            contentType: String
        }
    }
)

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;