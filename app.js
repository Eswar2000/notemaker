const express = require('express');
const mongoose = require('mongoose');

const app = express()

app.get('/', (req, res) => {
    res.send("<h2>Server running successfully</h2>");
});

app.post('/temp', (req, res) => {
    console.log("NodeJS and ReactJS are connected successfully");
});

app.listen(3001);