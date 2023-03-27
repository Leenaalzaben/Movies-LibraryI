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
app.put('/updateMovie/:id',updateHandler);
app.delete('/deleteMovie/:movieId',deleteHandler);
app.get("/specificMovie/:id", getSpecificMovieHandeler);
app.get('*', HandlerNotFoundError);

function addMovieHandler(req, res) {
    // console.log(req.body);
    // res.send("OK!")

    let {moviename, overview, comment } = req.body;
    let sql = `INSERT INTO moviedb_table  (moviename,overview,comment) VALUES ($1, $2, $3) RETURNING *;`
    let values = [moviename, overview, comment];
console.log(values);
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
       res.send(error)
    })
   
}

function updateHandler(req, res) {
    // console.log(1111,req.params)
    //new data i eant to update

    let ID = req.params.id;
    let { id, moviename, overview, comment } = req.body;
    let sql = `UPDATE moviedb_table SET id = $1, moviename = $2, overview=$3 ,comment=$4
      WHERE comment = $5 RETURNING *;`;
    let values = [id, moviename, overview, comment,ID];
    client.query(sql, values).then(result => {
        console.log(result.rows);
        res.send(result.rows)
    }).catch();
}

function deleteHandler(req,res){
    let{movieId}=req.params;
    let sql=`DELETE FROM moviedb_table WHERE id =$1;`;
    let value =[movieId];
    client.query(sql,value).then(result=>{
        res.status(204).send("deleted");
    }).catch()

}
function getSpecificMovieHandeler(req,res){

    let sql = `SELECT id FROM moviedb_table;`;
    client.query(sql).then((result)=>{
        console.log(result);
        res.json(result.rows)
    }).catch()
    

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