var express = require('express');
var router = express.Router();
var putMatchID = require('../services/index.js');

router.get("/",function(req,res){
    res.send("API is working properly");
    putMatchID(req.query.matchID);
    
});

module.exports = router;