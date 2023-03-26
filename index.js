'use strict';
const express = require("express");
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const { Client } = require('pg');
const { json } = require('express');
const PORT = process.env.PORT;
const apiKey = process.env.API_KEY;
let url = `postgres://leena:0000@localhost:5432/movietest`;
const client = new Client(url);
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.post("/addMovie", addMovieHandler);
app.get("/getMovies", getMoviesHandeler);


app.get('*', HandlerNotFoundError);

function addMovieHandler(req, res) {
    console.log(req.body);
    // res.send("OK!")

    let {id, movieName, overview, comment } = req.body;
    let sql = `INSERT INTO moviedb_table  (id ,movieName,overview,comment) VALUES ($1, $2, $3,$4) RETURNING *;`
    let values = [id,movieName, overview, comment];

    client.query(sql, values)
        .then((result) => {
            res.status(201).send("Data received by the server successfully");
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error while saving data to the server");
        });
}
// get to return all data I saved in dB
function getMoviesHandeler(req, res) {
    let sql = `SELECT * FROM moviedb_table`;
    //read all data from database table
    client.query(sql).then((result)=>{
        console.log(result);
        res.json(result.rows)
    }).catch((error)=>{
        HandlerNotFoundError(error,req,res)
    })
   
}





function HandlerNotFoundError(req, res) {
    res.status(404).send("Not Found");
}

function HandlerNotFoundError(err,req,res){
    res.status(500).send(err)
}
































client.connect().then(() => {
    // Run server and make it listening all the time
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

}).catch();