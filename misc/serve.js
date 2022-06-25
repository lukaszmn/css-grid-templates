// const express = require('express');
import express from 'express';

const app = express();

app.use(express.static('src'));

app.get('/', (req, res) => {
	res.sendFile('src/index.html');
});

app.listen(8080, () => console.log('Listening on http://localhost:8080'));
