var twit = require('twit');
const fs = require('fs');
var config = require('./config.js');
const {HLTV} = require('hltv');
const {createCanvas, loadImage,Canvas,Image } = require('canvas');
const { get } = require('http');
const { kill } = require('process');


var Twitter =  new twit(config);

const myHLTV = HLTV.createInstance({ loadPage: (url) => fetch(url) });
const stream = Twitter.stream('statuses/filter',{track:'#BotHltv'});

var link = "https://www.hltv.org/matches/2344990/x6tence-vs-c0ntact-betway-nine-to-five-5";
var matchId;
var tweetId;
var indice = 0;
var strMaps = "";
var isLive="";
var killerSide;
var killerNick;
var victimSide;
var victimNick;
var weapon;
var headshot;
var fodase = "";
var previousKillLog = "";
var previousSuicideLog = "";
var previousBombLog = "";
var previousDefusedLog = "";
var previousRoundEndLog = "";
var killerSide;
var killedSide;
var killerNameColor;
var killedNameColor;
var playerOneNick = "";
var playerTwoNick = "";
var mapName = "";
var arrayKillLogs = [];
var arrayPlayerOneNick = [];
var arrayPlayerTwoNick = [];
var arrayPlayerOneSide = [];
var arrayPlayerTwoSide = [];

matchId = link.split('/')[4];


HLTV.connectToScorebot({id:2345002,
	onScoreboardUpdate:(data,done)=>{
		mapName = data.mapName;
	},
  onLogUpdate:(data,done)=>{
		if(data.log[0].RoundStart != undefined){
			fodase ="";
			previousKillLog = "";
			previousSuicideLog = "";
			previousBombLog = "";
			previousDefusedLog = "";
			previousRoundEndLog = "";
			arrayKillLogs = [];
			arrayPlayerOneNick = [];
			arrayPlayerOneSide = [];
			arrayPlayerTwoNick = [];
			arrayPlayerTwoSide = [];
		}

		if(data.log[0].Kill != undefined && data.log[0].Kill != previousKillLog){
			killerSide = data.log[0].Kill.killerSide;
			killerNick = data.log[0].Kill.killerNick;
			victimSide = data.log[0].Kill.victimSide;
			victimNick = data.log[0].Kill.victimNick;
			weapon = data.log[0].Kill.weapon;
			headshot = data.log[0].Kill.headShot;

			if(killerSide == 'TERRORIST'){
					killerSide = 'TERRORIST';
			}else{
					killerSide = 'CT';
			}
			if(victimSide == 'TERRORIST'){
					victimSide = 'TERRORIST';
			}
			else{
					victimSide = 'CT';
			}
			previousKillLog = data.log[0].Kill;
			arrayKillLogs.push(`                                       killed                                                                                                      with ${weapon}`);
			arrayPlayerOneNick.push(killerNick);
			arrayPlayerOneSide.push(killerSide);
			arrayPlayerTwoNick.push(victimNick);
			arrayPlayerTwoSide.push(victimSide);
						
		}
		if(data.log[0].Suicide != undefined && data.log[0].Suicide != previousSuicideLog){
			arrayKillLogs.push(`                                        committed suicide`);
			arrayPlayerOneNick.push(data.log[0].Suicide.playerNick);
			arrayPlayerOneSide.push(data.log[0].Suicide.side);
			arrayPlayerTwoSide.push(undefined);
			arrayPlayerTwoNick.push(undefined);
			previousSuicideLog = data.log[0].Suicide;
		}
		if(data.log[0].BombPlanted !=undefined && data.log[0].BombPlanted != previousBombLog){
			arrayKillLogs.push(`                                        planted the bomb.(${data.log[0].BombPlanted.tPlayers} Ts alive and ${data.log[0].BombPlanted.ctPlayers} CTs alive)`);
			arrayPlayerOneNick.push(data.log[0].BombPlanted.playerNick);
			arrayPlayerOneSide.push("TERRORIST");
			arrayPlayerTwoSide.push(undefined);
			arrayPlayerTwoNick.push(undefined);
			previousBombLog = data.log[0].BombPlanted;
		}
		if(data.log[0].BombDefused != undefined && data.log[0].BombDefused != previousDefusedLog){
			arrayKillLogs.push(`                                        defused the bomb.`);
			arrayPlayerOneNick.push(data.log[0].BombDefused.playerNick);
			arrayPlayerOneSide.push("CT");
			arrayPlayerTwoSide.push(undefined);
			arrayPlayerTwoNick.push(undefined);
			previousDefusedLog = data.log[0].BombDefused;
		}

		if(data.log[0].RoundEnd != undefined && data.log[0].RoundEnd != previousRoundEndLog ){
			saveImage()
			previousRoundEndLog = data.log[0].RoundEnd;
			function saveImage(){
				const canvas =  createCanvas(1920,1080);
				const ctx = canvas.getContext('2d');
				var previousY=25;
				console.log(arrayPlayerOneNick);
					loadImage(`./src/${mapName}.jpg`,).then((image)=>{
						ctx.drawImage(image, 0,0, 1920, 1080);
						console.log("Chegou até aqui");
						for(var i = 0;i<arrayKillLogs.length;i++){
							killerNameColor = verifyKillerSide(arrayPlayerOneSide[i]);
							killedNameColor = verifyKilledSide(arrayPlayerTwoSide[i]);
							ctx.beginPath();
							ctx.rect(425, previousY, 1200, 50)
							ctx.quadraticCurveTo(425,previousY,1200,50);
							ctx.lineWidth =10;
							ctx.strokeStyle = "rgba(191, 0, 0,0.8)";
							ctx.strokeRect(425,previousY,1200,50);
							ctx.fillStyle = 'rgba(0,0,0,0.8)'
							ctx.fill()
							ctx.closePath();
							ctx.beginPath();
							ctx.font = '25px Impact';
							ctx.fillStyle = 'rgba(255,255,255,1)'
							ctx.fillText(arrayKillLogs[i],600,previousY+35);
							ctx.closePath();
							ctx.beginPath();
							ctx.font = '25px Impact';
							ctx.fillStyle = killerNameColor;
							ctx.fillText(arrayPlayerOneNick[i],440,previousY+35);
							ctx.closePath();
							ctx.beginPath();
							ctx.font = '25px Impact';
							ctx.fillStyle = killedNameColor;

							if(arrayPlayerTwoNick[i] != undefined){
								
								ctx.fillText(arrayPlayerTwoNick[i],910,previousY+35);
								
							}
							ctx.closePath();
							previousY = previousY + 80;
						}
						canvasBuffer = canvas.toBuffer('image/png');
						fs.writeFileSync("killLog.png",canvasBuffer);
						console.log("Imagem criada");
					});
				function verifyKillerSide(killerSide){
					if(killerSide == "TERRORIST"){
							return 'rgba(255, 157, 38,0.8)';
					}
					else if(killerSide == "CT"){
							return 'rgba(38, 121, 255,0.8)';
					}
				}
				
				function verifyKilledSide(victimSide){
					if(victimSide == "TERRORIST"){
							return 'rgba(255, 157, 38,0.8)';
					}
					else if(victimSide == "CT"){
							return 'rgba(38, 121, 255,0.8)';
					}
					else{
						return 'rgba(255, 157, 38,0)';
					}
				}
			}
			
				// Twitter.post(
				// 	'media/upload',
				// 	{	
				// 		media:fs.readFileSync('killLog.jpeg',{encoding:'base64'}),
				// 	},
				// 	function (err,data,response){
				// 		if(err != undefined){
				// 			console.log(err);
				// 		}
				// 		else{
				// 			Twitter.post('statuses/update', {status: 'Kill Log as image test', media_ids: [data.media_id_string]}, function(err, params, res) {
				// 				if (err) console.log(err);
				// 			});
				// 			console.log("Kill log enviado");	
				// 		}
				// 	}
				// );
		}
  }
})