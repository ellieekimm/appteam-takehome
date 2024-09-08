const express = require('express');
const app = express();


const mongoose = require('mongoose');
const multer = require("multer");
const axios = require('axios');

const Workout = require('./models/workout.js');

app.use(express.json());
const port = 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



app.post("/workouts", upload.single('image'), async (req, res) => {
    try {
        const { location } = req.body;
        let aqi = null;

        try {
            const waqiurl = `https://api.waqi.info/feed/${location}/?token=0b31933809351cdea6b8900e0281489b68397848`;
            const response = await axios.get(waqiurl);
            if (response) {
                aqi = response.data.data.aqi;
            }
        } catch (error) {
            console.log(error);
        }

        const workout = await Workout.create(req.body);

        if (aqi) {
            workout.air_quality = aqi;
        }

        if (req.file) {
            workout.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        await workout.save();

        res.status(200).send({ message: "Workout saved successfully" });

    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/workouts', async (req, res) => {
    try {
        const { id, minDuration, maxDuration, location, startDate, endDate, minAirQuality, maxAirQuality } = req.query;

        let filter = {};

        if (id) {
            const workout = await Workout.findById(id);
            if (!workout) {
                return res.status(404).json({
                    message: `Workout with ID ${id} not found`
                });
            }
            return res.status(200).json(workout);
        }

        if (minDuration || maxDuration) {
            filter.duration = {};
            if (minDuration) filter.duration.$gte = parseInt(minDuration, 10);
            if (maxDuration) filter.duration.$lte = parseInt(maxDuration, 10);
        }

        if (location) {
            filter.location = location;
        }

        if (startDate || endDate) {
            filter.start_date_local = {};
            if (startDate) {
                filter.start_date_local.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.start_date_local.$lte = new Date(endDate);
            }
        }


        if (minAirQuality || maxAirQuality) {
            filter.air_quality = {};
            if (minAirQuality) {
                filter.air_quality.$gte = parseInt(minAirQuality, 10);
            }
            if (maxAirQuality) {
                filter.air_quality.$lte = parseInt(maxAirQuality, 10);
            }
        }

        const workouts = await Workout.find(filter);

        if (workouts.length === 0) {
            return res.status(404).json({
                message: `No workouts found with the given criteria.`
            });
        }

        res.status(200).json(workouts);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    }
});


app.get('/stats/avg-duration', async (req, res) => {
    try {
        const result = await Workout.aggregate([
            {
                $group: { // used to group documents together by a certain field and perform calculations 
                    _id: null, // all documents treated as part of a single group
                    avgDuration: { $avg: "$duration" } // Assuming `duration` is stored in the workout schema
                }
            }
        ]);

        const averageDuration = result[0].avgDuration;
        res.status(200).json({ averageDuration });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    }
});


app.get('/stats/avg-distance', async (req, res) => {
    try {
        const result = await Workout.aggregate([
            {
                $group: { // used to group documents together by a certain field and perform calculations 
                    _id: null, // all documents treated as part of a single group
                    avgDistance: { $avg: "$distance" } // Assuming `duration` is stored in the workout schema
                }
            }
        ]);

        const avgDistance = result[0].avgDistance;
        res.status(200).json({ avgDistance });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    }
});

app.get('/stats/total-workouts', async (req, res) => {
    try {
        const result = await Workout.aggregate([
            {
                $group: {
                    _id: null,
                    totalWorkouts: { $sum: 1 } 
                }
            }
        ]);

        const totalWorkouts = result.length > 0 ? result[0].totalWorkouts : 0;
        res.status(200).json({ totalWorkouts });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    }
});

app.get('/stats/fastest-pace', async (req, res) => {
    try {
        const result = await Workout.aggregate([
            {
                $addFields: { 
                    pace: { 
                        $cond: { 
                            if: { $gt: ["$duration", 0] }, 
                            then: { $divide: ["$duration", "$distance"] }, 
                            else: 0
                        }
                    }
                }
            },
            {
                $sort: { pace: -1 } 
            },
            {
                $limit: 1 
            }
        ]);

        if (result.length === 0) {
            return res.status(404).json({
                message: "No workouts found to calculate the highest pace."
            });
        }

        const highestPaceWorkout = result[0].pace;
        res.status(200).json(highestPaceWorkout);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    }
});




mongoose.connect('mongodb+srv://admin:admin@takehomeapi.qdjiv.mongodb.net/?retryWrites=true&w=majority&appName=takehomeAPI').then(() => {
    console.log('connected to MongoDB');
    app.listen(port, () => {
        console.log(`API app is running on port ${port}`)
    })
}).catch(() => {
    console.log(error);
})