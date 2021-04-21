const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');

const server = express();

const port = process.env.PORT || 3333;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended:true}));
server.use(morgan('dev'));
server.use(express.static('public'));

server.use(routes);
server.listen(port, ()=> console.log('App listening on port ' + port));