var twit = require('twit');
var moment = require('moment-timezone');
const fs = require('fs');
const config = require('./config/config.js');
const {HLTV} = require('hltv');
const {createCanvas, loadImage,Canvas,Image } = require('canvas');


var Twitter =  new twit(config);

const myHLTV = HLTV.createInstance({ loadPage: (url) => fetch(url) });
const stream = Twitter.stream('statuses/filter',{track:['#BotHltv','#bothltv','#Bothltv']});

var link = "https://www.hltv.org/matches/2345312/yeah-vs-counter-nature-esea-advanced-season-35-north-america";
var matchId;

matchId = link.split('/')[4];

HLTV.getMatch({id:matchId}).then((res)=>{
	console.log(moment(res.date).format('MM/DD/YYYY'));
	console.log(moment(res.date).tz("America/Sao_Paulo").format('HH:mm'));
});

