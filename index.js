var twit = require('twit');
var config = require('./config.js');
const {HLTV} = require('hltv');
const {createCanvas, loadImage,Canvas } = require('canvas');
const fs = require('fs');


const express = require('express');
const app = express();
const port = process.env.PORT || 2000;
app.listen(port, () => {
   console.log(`listening on ${port}`);
});

var Twitter =  new twit(config);

const myHLTV = HLTV.createInstance({ loadPage: (url) => fetch(url) });
const stream = Twitter.stream('statuses/filter',{track:'#BotHltv'});

var matchId = "";
var ctTeamName = "";
var tTeamName = "";
var ctScore = "";
var tScore = "";
var isLive = false;
var mapName = "";
var tweetId = "";
var killLog = [];
var strKillLog = "";
var strKillLog2 = "";
var killerNick = "";
var killerSide = "";
var victimSide = "";
var victimNick = "";
var weapon="";
var headshot = "";
var secondTweetID = "";
var winnerTeam = "";
var highlightedPlayer = "";
var matchStatus = "";
var teamId = 8297;
var teamLogo = "";
const width = 1920;
const height = 1080;
var canvas;
var replyTeamName;
var tweetReplyId;
var mapas = 1;
var strMaps = "";
var isMatchLive="";
var matchEvent = "";
var replyUserName = "";
var scoreLimit1 = 15;
var scoreLimit2 = 15;
var isFinished = false;
var limiteAnterior = 30;
var day;
var month;
var year;
var minutes;
var hours;
var date;
var otCtScore = 15
var otTScore = 15
var frozen;
var numberIndice=0;
var previousKillLog = "";
var previousSuicideLog = "";
var previousBombLog = "";
var previousDefusedLog = "";
var previousRoundEndLog = "";
var arrayPlayerOneNick = [];
var arrayPlayerTwoNick = [];
var arrayPlayerOneSide = [];
var arrayPlayerTwoSide = [];
var killerSide;
var killedSide;
var killerNameColor;
var killedNameColor;
var playerOneNick = "";
var playerTwoNick = "";
var mapName = "";
var arrayKillLogs = [];

execBot();

async function execBot(){
    stream.on('tweet',function(tweet){
        try{
            tweetReplyId = tweet.id_str;
            replyUserName = tweet.user.screen_name;
            if(tweet.text.substr(9).trim().length>1){
                replyTeamName = tweet.text.split('#BotHltv')[1].trim().toLowerCase();
                if(tweet.user.screen_name == "BotHltv"){
                    return null;
                }
                else if(tweet.user.screen_name == "FireXter" && tweet.text.split('#BotHltv')[1].trim() +1 >3){
                    if(matchId !=""){
                        HLTV.connectToScorebot({id:matchId,onConnect:(data,done)=>{
                            done();
                        }});
                        matchId = tweet.text.split('#BotHltv')[1].trim();
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
                    else{
                        matchId = tweet.text.split('#BotHltv')[1].trim();
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
                    
                    
                }
                else {
                    strMaps = "";
                    isMatchLive = "";
                    numberIndice = 0;
                    HLTV.getMatches().then((res) => {
        
                        for(var i = 0;i<=res.length;i++){
                            try{
                                if(res[i].team1.name.toLowerCase() == replyTeamName || res[i].team2.name.toLowerCase() == replyTeamName){
                                    HLTV.getMatch({id:res[i].id}).then(result=>{

                                        if(result.format =="Best of 3"){
                                            mapas = 3;
                                        }
                                        else if(result.format =="Best of 2"){
                                            mapas = 2;
                                        }
                                        else if(result.format =="Best of 1"){
                                            mapas = 1;
                                        }
                                        else{
                                            mapas = 5;
                                        }
                                        console.log(result.maps);
                                        for(var k = 0;k<mapas;k++){
                                            strMaps += `Map ${(k)+1}: ${result.maps[k].name} ${result.maps[k].result}\n`
                                        }
                                        result.live == false ? isMatchLive = "❌" : isMatchLive="✅"
                                        matchEvent=result.event.name;
                                        
                                        console.log(result);
                                        date = new Date(result.date);
                                        day = date.getUTCDate().toString();
                                        minutes = date.getUTCMinutes();
                                        hours = date.getUTCHours()-3;
                                        year = date.getUTCFullYear();
                                        month = date.getUTCMonth()+1;

                                        Twitter.post(
                                            'statuses/update',
                                            {
                                                in_reply_to_status_id:tweetReplyId,
                                                is_quote_status:true,
                                                auto_populate_reply_metadata:true,
                                                status:`${result.team1.name} vs ${result.team2.name}\n\n`+
                                                `Date: ${month}/${day}/${year} - Time: ${hours}:${minutes} UTC-3\n`+
                                                `Event: ${matchEvent}\n`+
                                                `Format: ${result.format}\n`+
                                                `Maps: \n${strMaps}`+
                                                `Is it live now? R: ${isMatchLive}`
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
                            catch{
                                console.log("Deu ruim");
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
    arrayPlayerOneNick = [];
    arrayPlayerTwoNick = [];
    arrayPlayerOneSide = [];
    arrayPlayerTwoSide = [];
    await HLTV.connectToScorebot({id:matchId,
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

        }, onLogUpdate:(data,done)=>{
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
                arrayKillLogs.push(`                                        planted the bomb (${data.log[0].BombPlanted.tPlayers} Ts alive and ${data.log[0].BombPlanted.ctPlayers} CTs alive)`);
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
                ctScore = data.log[0].RoundEnd.counterTerroristScore;
                tScore = data.log[0].RoundEnd.terroristScore;
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

                if(ctScore == 0 && tScore == 0){
                    return null;
                }
                //REGULAR TIME
                else {
                    makeTweet();
                }

                function makeTweet(){
                    var win = verifyWin(ctTeamName,ctScore,tTeamName,tScore)
                    if(win != ""){
                        if(win.toLowerCase().includes(ctTeamName)){
                            makeTweetWin(ctTeamName,ctScore,tScore);
                        }else if(win.toLowerCase().includes(tTeamName)){
                            makeTweetWin(ctTeamName,ctScore,tScore);
                        }
                    }
                    else{
                        Twitter.post(
                            'statuses/update',
                            {
                                status:`🔵 ${ctTeamName} - ${ctScore} x ${tScore} - ${tTeamName} 🟠\n`+
                                `Map: ${mapName}\n\n`+
                                `📝Round Winner: ${data.log[0].RoundEnd.winner}\n`+
                                `📝Win type: ${verifyWinType(data.log[0].RoundEnd.winType)}`
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
                    }
                    

                    function makeTweetWin(winnerTeamName,ctScore,tScore){
                        Twitter.post(
                            'statuses/update',
                            {
                                status:`The match has ended\n`+
                                `🔵 ${ctTeamName} - ${ctScore} x ${tScore} - ${tTeamName} 🟠\n`+
                                `Map: ${mapName}\n\n`+
                                `✅${winnerTeamName} won the map!`
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

                    function verifyWin(ctTeamName,ctScore,tTeamName,tScore){
                        if(ctScore == 16 && ctScore+tScore <=30){
                            console.log("Não chegou no OT e o CT ganhou");
                            return `✅${ctTeamName} won the map!`
                        }
                        else if(tScore == 16 && ctScore+tScore <=30){
                            console.log("Não chegou no OT e o TR ganhou");
                            return `✅${tTeamName} won the map!`
                        }
                        else if(ctScore + tScore>30){
                            if(ctScore + tScore >limiteAnterior && ctScore + tScore <=limiteAnterior+6){
                                if(ctScore == scoreLimit1){
                                    console.log("Chegou aqui no OT e o CT ganhou");
                                    return `✅${ctTeamName} won the map!`
                                }
                                else if(tScore == scoreLimit1){
                                    console.log("Chegou aqui no OT e o TR ganhou");
                                    return `✅${tTeamName} won the map!`
                                }
                            }
                            else{
                                limiteAnterior = limiteAnterior +6;
                                scoreLimit1 = scoreLimit1+3;
                            }
                        }
                        else {
                            return "";
                        }
                        return "";
                    }
                    
                    function postKillLogs(tweetId){

                        Twitter.post(
                            'media/upload',
                            {	
                                media:fs.readFileSync(`killLog.png`,{encoding:'base64'}),
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





//TESTES

// createImage(teamId);

async function createImage(teamId){
    console.log(teamId);

    await HLTV.getTeam({id:teamId}).then(res=>{
        teamLogo = res.logo;
        canvas = createCanvas(width,height,'svg');
        const context = canvas.getContext('2d');
        context.fillStyle = '#fff';
        context.fillRect(0,0,width,height);
        context.font = 'bold 70pt Menlo';
        context.textAlign = 'center';
        context.fillStyle = '#fff';
        context.fillText(`${res.name} won the match!`);
        var data = canvas.toDataURL('image/png', (err, jpeg) => { console.log(err)});
        const buffer = canvas.toBuffer('image/png',{quality: 0.75, progressive: false, chromaSubsampling: true});
        fs.writeFileSync('./src/image.png',buffer);

        Twitter.post(
            'media/upload',
            {
                media_data:'buffer'
            },
            function (err,data,response){
                if(err != undefined){
                    console.log(err);
                }
            }
        );

    }).catch(err =>{
        console.error(err);
    });   
}