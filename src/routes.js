const express = require('express');
const MatchController = require('./controllers/MatchController');

const routes = express.Router();

routes.get('/',(req,res)=>{res.send("Hello")})
routes.get('/get_matches',MatchController.index);
routes.get('/set_match/:matchID',MatchController.connectMatch);

module.exports = routes;