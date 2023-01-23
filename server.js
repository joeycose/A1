/*********************************************************************************
* BTI425 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Giuseppe Cosentino Student ID: ______________ Date: Sun, Jan 22
* Cyclic Link: https://fair-teal-eel-hose.cyclic.app/
*
********************************************************************************/ 

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
require('dotenv').config();
const MoviesDB = require("./modules/moviesDB.js")
const db = new MoviesDB();

// port number that our app is running on
const HTTP_PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API Listening' })
});


db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on : ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});

// POST /api/movies
app.post("/api/movies", async (req, res) => {
    try {
        const newMovie = await db.addNewMovie(req.body);
        return res.status(201).json(newMovie);
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});

// GET /api/movies
app.get("/api/movies", async (req, res) => {
    const { page, perPage, title } = req.query;

    try {
        const movies = await db.getAllMovies(page, perPage, title);
        return res.status(200).json(movies);
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});

// GET /api/movies/:id
app.get("/api/movies/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const movie = await db.getMovieById(id);
        return res.status(200).json(movie);
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});

// PUT /api/movies/:id
app.put("/api/movies/:id", async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
        const updatedMovie = await db.updateMovieById(data, id);
        return res.status(204).json(updatedMovie);
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});

// DELETE /api/movies/:id
app.delete("/api/movies/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMovie = await db.deleteMovieById(id);
        return res.status(204).json(deletedMovie);
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});

// app.listen(HTTP_PORT, () => {
//     console.log('Ready to handle requests on port ' + HTTP_PORT)
// });

