var twit = require('twit');
var config = require('./config.js');
const {HLTV} = require('hltv');
const { createCanvas } = require('canvas');
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

var numberIndice=0;

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

                                        Twitter.post(
                                            'statuses/update',
                                            {
                                                in_reply_to_status_id:tweetReplyId,
                                                is_quote_status:true,
                                                auto_populate_reply_metadata:true,
                                                status:`${result.team1.name} vs ${result.team2.name}\n\n`+
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
                                    status:`Couldn't find a match for the team you're looking for.\nYou typed the wrong name or there's no upcoming match for this team.`
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
                        status:`Please when you use this #, type only the name of one team from www.hltv.org.`
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
    await HLTV.connectToScorebot({id:matchId,
        onDisconnect(){
            return console.log("Partida acabou");
        },
        onScoreboardUpdate: (data,done)=>{

            ctTeamName = data.ctTeamName;
            tTeamName = data.terroristTeamName;
            ctScore = data.ctTeamScore;
            tScore = data.tTeamScore;
            mapName = data.mapName;
            isLive = data.live;

        }, onLogUpdate:(data,done)=>{
            if(data.log[0].RoundStart != undefined){
                strKillLog ="";
                strKillLog2 = "";
            }

            if(data.log[0].Kill != undefined){
                killerSide = data.log[0].Kill.killerSide;
                killerNick = data.log[0].Kill.killerNick;
                victimSide = data.log[0].Kill.victimSide;
                victimNick = data.log[0].Kill.victimNick;
                weapon = data.log[0].Kill.weapon;
                headshot = data.log[0].Kill.headShot;

                if(killerSide == 'TERRORIST'){
                    killerSide = '🟠';
                }else{
                    killerSide = '🔵';
                }
                if(victimSide == 'TERRORIST'){
                    victimSide = '🟠';
                }
                else{
                    victimSide = '🔵';
                }
                strKillLog += `!${killerSide}${killerNick} killed ${victimSide}${victimNick} with ${weapon}.\n`;
                
            }
            if(data.log[0].Suicide != undefined){
                strKillLog += `!${data.log[0].Suicide.playerNick} committed suicide.\n`;
            }
            if(data.log[0].BombPlanted !=undefined){
                strKillLog += `!💣 has been planted.\n`;

            }
            if(data.log[0].BombDefused != undefined){
                strKillLog += `!✂️ has been defused.\n`;
            }

            if(data.log[0].RoundEnd != undefined){

                if(isLive = true){
                    if(ctScore == 0 && tScore == 0){
                        return null;
                    }
                    else{
                        makeTweet();
                    }
                }
                else{
                    return false;
                }

                function makeTweet(){
                    Twitter.post(
                        'statuses/update',
                        {
                            status:`${matchStatus}\n\n`+
                            `🔵 ${ctTeamName} - ${ctScore} x ${tScore} - ${tTeamName} 🟠\n`+
                            `Map: ${mapName}\n\n`+
                            `📝Round Winner: ${data.log[0].RoundEnd.winner}\n`+
                            `📝Win type: ${verifyWinType(data.log[0].RoundEnd.winType)}`+
                            `${verifyWin(ctTeamName,ctScore,tTeamName,tScore)}`
                        },
                        function (err,data,response){
                            if(err != undefined){
                                console.log(err);
                            }
                            else{
                                tweetId = data.id_str;
                                console.log("Primeiro tweet enviado");
                                if(matchStatus =="⚪ THE MATCH HAS ENDED ⚪"){
                                    return null;
                                }else{
                                    postKillLogs(tweetId);
                                    console.log(`🔵 ${ctTeamName} - ${ctScore} x ${tScore} - ${tTeamName} 🟠\n`);
                                }
                            }
                        }
                    );

                    function verifyWin(ctTeamName,ctScore,tTeamName,tScore){
                        if(ctScore == 16 && ctScore+tScore <=30){
                            matchStatus = "⚪ THE MATCH HAS ENDED ⚪";
                            done();
                            return `\n\n✅${ctTeamName} won the map!`;
                        }
                        else if(tScore == 16 && ctScore+tScore <=30){
                            matchStatus = "⚪ THE MATCH HAS ENDED ⚪";
                            done();
                            return `\n\n✅${tTeamName} won the map!`;
                        }else if(ctScore + tScore > 30 && isFinished == false){
                            var i = 0;
                            if(isFinished == false){
                                if(ctScore + tScore >limiteAnterior && ctScore + tScore <=limiteAnterior+6){
                                    if(ctScore == scoreLimit1+4){
                                        isFinished = true;
                                        done();
                                        return `\n\n✅${ctScore} won the map!`;
                                    }
                                    else if(tScore == scoreLimit1 +4){
                                        isFinished = true;
                                        done();
                                        return `\n\n✅${tTeamName} won the map!`;
                                    }
                                }
                                else{
                                    limiteAnterior = limiteAnterior +6;
                                    scoreLimit1 = scoreLimit1+4;
                                }
                            }
                            return "";
                        }
                        else {
                            return "";
                        }
                    }
                    
                    function postKillLogs(tweetId){
                
                        if(strKillLog.length > 200){
                            var i=200;

                            while(strKillLog.slice(i).substr(0,1)!="!"){
                                i--;
                            }
                            strKillLog2 = strKillLog.slice(i);
                            strKillLog = strKillLog.slice(0,i);

                            Twitter.post(
                                'statuses/update',
                                {
                                    in_reply_to_status_id:tweetId,
                                    is_quote_status:true,
                                    auto_populate_reply_metadata:true,
                                    status:`☠️\n${strKillLog}`
                                },
                                function (err,data,response){
                                    if(err != undefined){
                                        console.log(err);
                                        
                                    }
                                    else{
                                        secondTweetID = data.id_str;
                                        console.log("Primeira kill log enviada");
                                        Twitter.post(
                                            'statuses/update',
                                            {
                                                in_reply_to_status_id:secondTweetID,
                                                is_quote_status:true,
                                                auto_populate_reply_metadata:true,
                                                status:`${strKillLog2}`
                                            },
                                            function (error,data,response){
                                                if(error != undefined){
                                                    console.log(error);
                                                    
                                                }
                                                else{
                                                    console.log("Segunda kill log enviada");
                                                
                                                    strKillLog="";
                                                    strKillLog2 ="";
                                                }
                                            }
                                        );
                                    }
                                    
                                }
                            );
                        }
                        else{
                            Twitter.post(
                                'statuses/update',
                                {
                                    in_reply_to_status_id:tweetId,
                                    is_quote_status:true,
                                    auto_populate_reply_metadata:true,
                                    status:`☠️\n${strKillLog}`
                                },
                                function (err,data,response){
                                    if(err != undefined){
                                        console.log(err);
                                    }
                                    else{
                                        strKillLog = "";
                                        console.log(`🔵 ${ctTeamName} - ${ctScore} x ${tScore} - ${tTeamName} 🟠\n`);
                                    }
                                }
                            );
                        }
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