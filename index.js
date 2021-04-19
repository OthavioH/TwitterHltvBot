const twit = require('twit');
const config = require('./config/config.js');
const {HLTV} = require('hltv');
const {createCanvas, loadImage } = require('canvas');
const moment = require('moment-timezone');
const fs = require('fs');

const Twitter =  new twit(config);

const stream = Twitter.stream('statuses/filter',{track:['#BotHltv','#bothltv','#Bothltv']});
const streamTeste = Twitter.stream('statuses/filter',{track:['#bothltvteste']});

var matchId = "";
var ctTeamName = "";
var tTeamName = "";
var ctScore = "";
var tScore = "";
var mapName = "";
var tweetId = "";
var killerNick = "";
var killerSide = "";
var victimSide = "";
var victimNick = "";
var weapon="";
var highlightedPlayer = "";
var reply;
var tweetReplyId;
var mapas = 1;
var strMaps = "";
var isMatchLive="";
var matchEvent = "";
var replyUserName = "";
var numberIndice=0;
var killerSide;
var firstPlayerNameColor;
var victimNameColor;
var mapName = "";
var arrayKillLogs = [];
let indice;
let killLogs = [];


function putMatchId(matchId){
    console.log("Match updated");
    connectHLTVBot(matchId);
}

execBot();

async function execBot(){
    streamTeste.on('tweet',function(tweet){
        console.log("LOG SESSION");
        try{
            tweetReplyId = tweet.id_str;
            replyUserName = tweet.user.screen_name;
            if(tweet.text.substr(9).trim().length>1){
                reply = tweet.text.toLowerCase().split('#bothltvteste')[1].trim();
                if(tweet.user.screen_name == "BotHltv"){
                    return null;
                }
                else if(tweet.user.screen_name == "FireXter" && reply +1 >3){
                    
                    matchId = reply;
                    Twitter.post(
                        'statuses/update',
                        {
                            in_reply_to_status_id:tweetReplyId,
                            is_quote_status:true,
                            auto_populate_reply_metadata:true,
                            status:`Match updated`
                        }
                    );
                    connectHLTVBot(matchId);
                }
                else {
                    strMaps = "";
                    isMatchLive = "";
                    numberIndice = 0;
                    HLTV.getMatches().then((res) => {
        
                        for(var i = 0;i<=res.length;i++){
                            try{
                                if(res[i].team1.name.toLowerCase().includes(reply) || res[i].team2.name.toLowerCase().includes(reply)){
                                    HLTV.getMatch({id:res[i].id}).then(result=>{
                                        strMaps = "";
                                        mapas = result.maps.length;
                                        console.log(mapas);
                                        for(var k = 0;k<mapas;k++){
                                            strMaps += `Map ${(k)+1}: ${result.maps[k].name} ${result.maps[k].result}\n`
                                        }
                                        result.live == false ? isMatchLive = "❌ The game hasn't started" : isMatchLive="✅ The game is live!";
                                        matchEvent=result.event.name;

                                        Twitter.post(
                                            'statuses/update',
                                            {
                                                in_reply_to_status_id:tweetReplyId,
                                                is_quote_status:true,
                                                auto_populate_reply_metadata:true,
                                                status:`${result.team1.name} vs ${result.team2.name}\n\n`+
                                                `Date: ${moment(result.date).tz("America/Sao_Paulo").format('DD/MM/YYYY')} - Time: ${moment(result.date).tz("America/Sao_Paulo").format('HH:mm')} (BRT)\n`+
                                                `Event: ${matchEvent}\n`+
                                                `Format: ${result.format}\n`+
                                                `Maps: \n${strMaps}`+
                                                isMatchLive
                                            },
                                            function (error,data,response){
                                                if(error != undefined){
                                                    console.log("Erro no tweet\n"+error);
                                                }
                                            }
                                        );
                                    });
                                    numberIndice = -400;
                                }
                                else{
                                    numberIndice = numberIndice + 1;
                                }
                            }
                            catch {
                                console.log("deu ruim")
                            }
                            
                        }
                        if(numberIndice >=0){
                            strMaps="";
                            isMatchLive = "";
                            numberIndice = 0;

                            Twitter.post(
                                'statuses/update',
                                {
                                    in_reply_to_status_id:tweetReplyId,
                                    is_quote_status:true,
                                    auto_populate_reply_metadata:true,
                                    status:`Couldn't find a match for the team you're looking for.`
                                },
                                function (error,data,response){
                                    if(error != undefined){
                                        console.log("Erro no tweet de erro\n"+error);
                                    }
                                }
                            );
                        }
                    });
            
                }
        
            }
            else{
                Twitter.post(
                    'statuses/update',
                    {
                        in_reply_to_status_id:tweetReplyId,
                        is_quote_status:true,
                        auto_populate_reply_metadata:true,
                        status:`Please when you use this #, type the name of a team from www.hltv.org.`
                    },
                    function (error,data,response){
                        if(error != undefined){
                            console.log("Erro in the error Tweet\n"+error);
                        }
                    }
                );
            }
        }
        catch{
            console.log("Sem texto");
        }
    });    
}
// connectHLTVBot();

async function connectHLTVBot(matchId){
    scoreLimit1 = 15;
    scoreLimit2 = 15;
    isFinished = false;
    limiteAnterior = 30;
    matchStatus = "";
    ctScore = 0;
    tScore = 0;
    strKillLog = "";
    strKillLog2 = "";
    arrayKillLogs = [];

    HLTV.connectToScorebot({id:matchId,
        onDisconnect:(data)=>{
            strKillLog = "";
            strKillLog2 = "";
            return console.log("Bot desconectado do Scorebot");
        },
        onScoreboardUpdate: (data,done)=>{

            ctTeamName = data.ctTeamName;
            tTeamName = data.terroristTeamName;
            mapName = data.mapName;
            isLive = data.live;
            frozen = data.frozen;
            currentRound = data.currentRound;

        }, onLogUpdate:(data,done)=>{
            if(data.log[0].RoundStart != undefined){
                arrayKillLogs = [];
            }
            // && data.log[0].Kill !== arrayKillLogs[arrayKillLogs.length-1].killObject
            if(data.log[0].Kill !== undefined ){
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
                data.log[0].Kill.killerSide = killerSide;
                data.log[0].Kill.victimSide = victimSide;
                arrayKillLogs.push({
                    logType:'Kill',
                    killObject:data.log[0].Kill,
                });
            }
            if(data.log[0].Suicide != undefined){
                if(data.log[0].Suicide.side == 'TERRORIST'){
                    data.log[0].Suicide.side = 'TERRORIST';
                }else{
                    data.log[0].Suicide.side = 'CT';
                }


                arrayKillLogs.push({
                    logType:'Suicide',
                    suicideObject:data.log[0].Suicide,
                })
                // arrayKillLogs.push(`                                  committed suicide`);
            }
            if(data.log[0].BombPlanted !=undefined){

                arrayKillLogs.push({
                    logType:'BombPlanted',
                    plantedObject:data.log[0].BombPlanted
                })
            }
            if(data.log[0].BombDefused != undefined){

                arrayKillLogs.push({
                    logType:'BombDefused',
                    plantedObject:data.log[0].BombDefused
                })
            }
        
            if(data.log[0].RoundEnd != undefined){
                saveImage();
                ctScore = data.log[0].RoundEnd.counterTerroristScore;
                tScore = data.log[0].RoundEnd.terroristScore;
                console.log(arrayKillLogs);
                async function saveImage(){
                    const canvas =  createCanvas(1920,1080);
                    const ctx = canvas.getContext('2d');
                    var previousY=25;
                    loadImage(`./assets/maps/${mapName}.jpg`).then(async (image)=>{
                        ctx.drawImage(image, 0,0, 1920, 1080);
                        console.log("Chegou até aqui");
                        
                        console.log("Imagem criada");
                    });
                    for(indice = 0;indice<arrayKillLogs.length;indice++){
                        killLogs = arrayKillLogs[indice];
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
                        if(killLogs.logType === 'Kill'){
                            firstPlayerNameColor = verifySide(killLogs.killObject.killerSide);
                            victimNameColor = verifySide(killLogs.killObject.victimSide);
                            const victimNick = killLogs.killObject.victimNick;
                            ctx.beginPath();
                            ctx.font = '25px Impact';
                            ctx.fillStyle = firstPlayerNameColor;
                            ctx.fillText(killLogs.killObject.killerNick,420,previousY+35);
                            ctx.closePath();
                            await loadImage(`./assets/${killLogs.killObject.weapon}.png`).then((img)=>{

                                ctx.drawImage(img,620,previousY,200,70);
                                
                            });
                            ctx.beginPath();
                            ctx.font = '25px Impact';
                            ctx.fillStyle = victimNameColor;
                            ctx.fillText(victimNick,1030,previousY+35);
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
                            ctx.fillText(killLogs.plantedObject.playerNick,420,previousY+35);
                            ctx.closePath();
                            const ctPlayers = killLogs.plantedObject.ctPlayers;
                            const tPlayers = killLogs.plantedObject.tPlayers;
                            await loadImage(`./assets/c4.png`).then((img)=>{

                                ctx.drawImage(img,620,previousY,70,50);

                                ctx.beginPath();
                                ctx.font = '25px Impact';
                                ctx.fillStyle = '#fff';
                                ctx.fillText(`CTs alive: ${ctPlayers} Ts alive: ${tPlayers}`,1030,previousY+35);
                                ctx.closePath();
                            });
                        }
                        if(killLogs.logType === 'BombDefused'){
                            firstPlayerNameColor = 'rgba(38, 121, 255,0.8)';
                            const playerNick = killLogs.defusedObject.playerNick;
                            ctx.beginPath();
                            ctx.font = '25px Impact';
                            ctx.fillStyle = firstPlayerNameColor;
                            ctx.fillText(playerNick,420,previousY+35);
                            ctx.closePath();
                            await loadImage(`./assets/defuse_kit.png`).then((img)=>{

                                ctx.drawImage(img,620,previousY,200,200);
                            });
                        }
                        
                        previousY = previousY + 80;
                    }
                    function verifySide(killerSide){
                        if(killerSide == "TERRORIST"){
                                return 'rgba(255, 157, 38,0.8)';
                        }
                        else if(killerSide == "CT"){
                                return 'rgba(38, 121, 255,0.8)';
                        }
                    }
                    canvasBuffer = canvas.toBuffer('image/png');
                    fs.writeFileSync("./assets/killLog.png",canvasBuffer);
                }
                

                if(ctScore == 0 && tScore == 0){
                    return null;
                }
                //REGULAR TIME
                else {
                    makeTweet();
                }

                function makeTweet(){
                    Twitter.post(
                        'statuses/update',
                        {
                            status:`🔵 ${ctTeamName} - ${ctScore} x ${tScore} - ${tTeamName} 🟠\n`+
                            `Map: ${mapName}\n\n`+
                            `📝Round Winner: ${data.log[0].RoundEnd.winner}\n`+
                            `📝Win type: ${verifyWinType(data.log[0].RoundEnd.winType)}\n`
                        },
                        function (err,data,response){
                            if(err != undefined){
                                console.log(err);
                            }
                            else{
                                tweetId = data.id_str;
                                console.log("Primeiro tweet enviado");
                                
                                postKillLogs(tweetId);
                                console.log(`🔵 ${ctTeamName} - ${ctScore} x ${tScore} - ${tTeamName} 🟠\n`);
                                
                            }
                        }
                    );
                    

                    function makeTweetWin(winnerTeamName,ctScore,tScore){
                        Twitter.post(
                            'statuses/update',
                            {
                                status:`The match has ended\n`+
                                `🔵 ${ctTeamName} - ${ctScore} x ${tScore} - ${tTeamName} 🟠\n`+
                                `Map: ${mapName}\n\n`+
                                win
                            },
                            function (err,data,response){
                                if(err != undefined){
                                    console.log(err);
                                }
                                else{
                                    tweetId = data.id_str;
                                    console.log("Tweet de win enviado");
                                }
                            }
                        );
                    }
                    
                    function postKillLogs(tweetId){

                        Twitter.post(
                            'media/upload',
                            {	
                                media:fs.readFileSync(`./assets/killLog.png`,{encoding:'base64'}),
                            },
                            function (err,data,response){
                                if(err != undefined){
                                    console.log(err);
                                }
                                else{
                                    Twitter.post(
                                        'statuses/update', 
                                        {
                                            status: '======= Kill Logs =======',
                                            in_reply_to_status_id:tweetId,
                                            is_quote_status:true,
                                            auto_populate_reply_metadata:true, 
                                            media_ids: [data.media_id_string]
                                        }, 
                                        function(err, params, res) {
                                        if (err) console.log(err);
                                    });
                                    console.log("Kill log enviado");	
                                }
                            }
                        );
                    }
                }
            }  
        }
    })
}

function verifyWinType(winType) {
    if(winType == "Terrorists_Win"){
        return "The terrorists eliminated the enemy."
    }else if(winType == "CTs_Win"){
        return "The CTs eliminated the enemy or the round time is over."
    }else if(winType == "Target_Bombed"){
        return "The bomb exploded."
    }else if(winType == "Bomb_defuse"){
        return "The bomb has been defused."
    }else{
        return winType;
    }
}



function tweetHighlightedPlayer(tweetId){
    HLTV.getMatch({id:matchId}).then(res =>{
        highlightedPlayer = res.highlightedPlayer.name;
    });
    Twitter.post(
        'statuses/update',
        {
            in_reply_to_status_id:tweetId,
            is_quote_status:true,
            auto_populate_reply_metadata:true,
            status:`MVP: ${highlightedPlayer}`
        },
        function (error,data,response){
            if(error != undefined){
                console.log(error);
            }
        }
    );
}

module.exports = putMatchId;