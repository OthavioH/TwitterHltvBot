var twit = require('twit');
var moment = require('moment-timezone');
const fs = require('fs');
const config = require('./config/config.js');
const {HLTV} = require('hltv');
const {createCanvas, loadImage,Canvas,Image } = require('canvas');

const logs = require('./tests/logs.json');

function testCatchTweet(){
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
}

testLogsImage();

function testLogsImage(){
	let arrayKillLogs = [];

	for (let index = 0; index < logs.length; index++) {
		if(logs[index].logType === "Kill" ){
			killerSide = logs[index].Kill.killerSide;
			killerNick = logs[index].Kill.killerNick;
			victimSide = logs[index].Kill.victimSide;
			victimNick = logs[index].Kill.victimNick;
			weapon = logs[index].Kill.weapon;
			headshot = logs[index].Kill.headShot;

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
			logs[index].Kill.killerSide = killerSide;
			logs[index].Kill.victimSide = victimSide;
			arrayKillLogs.push({
				logType:'Kill',
				killObject:logs[index].Kill,
			});
		}
		if(logs[index].logType === "Suicide"){
			if(logs[index].Suicide.side == 'TERRORIST'){
				logs[index].Suicide.side = 'TERRORIST';
			}else{
				logs[index].Suicide.side = 'CT';
			}


			arrayKillLogs.push({
				logType:'Suicide',
				suicideObject:logs[index].Suicide,
			})
			// arrayKillLogs.push(`                                  committed suicide`);
		}
		if(logs[index].logType === "BombPlanted"){

			arrayKillLogs.push({
				logType:'BombPlanted',
				plantedObject:logs[index].BombPlanted
			})
		}
		if(logs[index].logType === "BombDefused"){

			arrayKillLogs.push({
				logType:'BombDefused',
				defusedObject:logs[index].BombDefused
			})
		}
		
		if(logs[index].logType == "RoundEnd"){
			saveImage(arrayKillLogs);
			ctScore = logs[index].RoundEnd.counterTerroristScore;
			tScore = logs[index].RoundEnd.terroristScore;
			console.log(arrayKillLogs);
		}
	}		
}


async function saveImage(arrayKillLogs){
	const mapName = "de_mirage";

	const canvas =  createCanvas(1920,1080);
	const ctx = canvas.getContext('2d');
	let previousY=25;
	loadImage(`./assets/maps/${mapName}.jpg`).then(async (image)=>{
		ctx.drawImage(image, 0,0, 1920, 1080);
		
		console.log("Imagem criada");
	});

	function createLogBackground(){
		ctx.beginPath();
		ctx.rect(405, previousY, 1200, 50)
		ctx.quadraticCurveTo(405,previousY,1200,50);
		ctx.lineWidth =10;
		ctx.strokeStyle = "rgba(191, 0, 0,0.8)";
		ctx.strokeRect(405,previousY,1200,50);
		ctx.fillStyle = 'rgba(0,0,0,0.8)'
		ctx.fill()
		ctx.closePath();
		ctx.beginPath();
	}

	for(indice = 0;indice<arrayKillLogs.length;indice++){
		killLogs = arrayKillLogs[indice];
		if(indice == 0){
			await createLogBackground();
		}
		createLogBackground();

		if(killLogs.logType === 'Kill'){
			firstPlayerNameColor = verifySide(killLogs.killObject.killerSide);
			victimNameColor = verifySide(killLogs.killObject.victimSide);
			const victimNick = killLogs.killObject.victimNick;
			ctx.beginPath();
			ctx.font = '25px Impact';
			ctx.fillStyle = firstPlayerNameColor;
			ctx.fillText(killLogs.killObject.killerNick,795,previousY+35);
			ctx.closePath();
			await loadImage(`./assets/${killLogs.killObject.weapon}.png`).then((img)=>{

				ctx.drawImage(img,1045,previousY,70,50);
				
			});

			if(killLogs.killObject.headShot == true){
				await loadImage('./assets/headshot.png').then((image)=>{
					ctx.drawImage(image,1145, previousY,50,45);
				})
			}
			ctx.beginPath();
			ctx.font = '25px Impact';
			ctx.fillStyle = victimNameColor;
			ctx.fillText(victimNick,1230,previousY+35);
			ctx.closePath();
			
		}
		if(killLogs.logType === 'Suicide'){
			firstPlayerNameColor = verifySide(killLogs.suicideObject.playerNick);
			ctx.beginPath();
			ctx.font = '25px Impact';
			ctx.fillStyle = firstPlayerNameColor;
			ctx.fillText(killLogs.suicideObject.playerNick,420,previousY+35);
			ctx.closePath();
			await loadImage(`./assets/suicide.png`).then((img)=>{

				ctx.drawImage(img,620,previousY,70,50);

				ctx.beginPath();
				ctx.font = '25px Impact';
				ctx.fillStyle = firstPlayerNameColor;
				ctx.fillText(killLogs.suicideObject.playerNick,1030,previousY+35);
				ctx.closePath();
			});
			
		}
		if(killLogs.logType === 'BombPlanted'){
			firstPlayerNameColor = 'rgba(255, 157, 38,0.8)';
			ctx.beginPath();
			ctx.font = '25px Impact';
			ctx.fillStyle = firstPlayerNameColor;
			ctx.fillText(killLogs.plantedObject.playerNick,800,previousY+35);
			ctx.closePath();
			const ctPlayers = killLogs.plantedObject.ctPlayers;
			const tPlayers = killLogs.plantedObject.tPlayers;

			ctx.beginPath();
			ctx.font = '25px Impact';
			ctx.fillStyle = '#fff';
			ctx.fillText(`CTs alive: ${ctPlayers} Ts alive: ${tPlayers}`,930,previousY+35);
			ctx.closePath();
			await loadImage(`./assets/c4.png`).then((img)=>{

				ctx.drawImage(img,845,previousY-20,100,90);
			});
		}
		if(killLogs.logType === 'BombDefused'){
			firstPlayerNameColor = 'rgba(38, 121, 255,0.8)';
			const playerNick = killLogs.defusedObject.playerNick;
			ctx.beginPath();
			ctx.font = '25px Impact';
			ctx.fillStyle = firstPlayerNameColor;
			ctx.fillText(playerNick,920,previousY+35);
			ctx.closePath();
			await loadImage(`./assets/defuse_kit.png`).then((img)=>{

				ctx.drawImage(img,980,previousY+4,50,40);
			});
		}
		
		previousY = previousY + 80;
	}
	canvasBuffer = canvas.toBuffer('image/png');
	fs.writeFileSync("./assets/killLog.png",canvasBuffer);
}

function verifySide(killerSide){
	if(killerSide == "TERRORIST"){
			return 'rgba(255, 157, 38,0.8)';
	}
	else if(killerSide == "CT"){
			return 'rgba(38, 121, 255,0.8)';
	}
}