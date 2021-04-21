const express = require('express');
const MatchController = require('./controllers/MatchController');

const routes = express.Router();

routes.get('/',(req,res)=>{res.send("Hello")})
routes.get('/matches',MatchController.getAllMatches);
routes.get('/match/connect/:matchID',MatchController.connectMatch);

module.exports = routes;