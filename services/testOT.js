var twit = require('twit');
const fs = require('fs');
var config = require('./config.js');
const {HLTV} = require('hltv');


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
        currentRound = data.currentRound;

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
            arrayKillLogs.push(`                           killed                                                          with ${weapon}`);
            arrayPlayerOneNick.push(killerNick);
            arrayPlayerOneSide.push(killerSide);
            arrayPlayerTwoNick.push(victimNick);
            arrayPlayerTwoSide.push(victimSide);
        }
        if(data.log[0].Suicide != undefined && data.log[0].Suicide != previousSuicideLog){
            arrayKillLogs.push(`                                  committed suicide`);
            arrayPlayerOneNick.push(data.log[0].Suicide.playerNick);
            arrayPlayerOneSide.push(data.log[0].Suicide.side);
            arrayPlayerTwoSide.push(undefined);
            arrayPlayerTwoNick.push(undefined);
            previousSuicideLog = data.log[0].Suicide;
        }
        if(data.log[0].BombPlanted !=undefined && data.log[0].BombPlanted != previousBombLog){
            arrayKillLogs.push(`                            planted the bomb (${data.log[0].BombPlanted.tPlayers} Ts alive and ${data.log[0].BombPlanted.ctPlayers} CTs alive)`);
            arrayPlayerOneNick.push(data.log[0].BombPlanted.playerNick);
            arrayPlayerOneSide.push("TERRORIST");
            arrayPlayerTwoSide.push(undefined);
            arrayPlayerTwoNick.push(undefined);
            previousBombLog = data.log[0].BombPlanted;
    
        }
        if(data.log[0].BombDefused != undefined && data.log[0].BombDefused != previousDefusedLog){
            arrayKillLogs.push(`                            defused the bomb.`);
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
            async function saveImage(){
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
                        ctx.rect(405, previousY, 1200, 50)
                        ctx.quadraticCurveTo(405,previousY,1200,50);
                        ctx.lineWidth =10;
                        ctx.strokeStyle = "rgba(191, 0, 0,0.8)";
                        ctx.strokeRect(405,previousY,1200,50);
                        ctx.fillStyle = 'rgba(0,0,0,0.8)'
                        ctx.fill()
                        ctx.closePath();
                        ctx.beginPath();
                        ctx.font = '25px Impact';
                        ctx.fillStyle = 'rgba(255,255,255,1)'
                        ctx.fillText(arrayKillLogs[i],580,previousY+35);
                        ctx.closePath();
                        ctx.beginPath();
                        ctx.font = '25px Impact';
                        ctx.fillStyle = killerNameColor;
                        ctx.fillText(arrayPlayerOneNick[i],420,previousY+35);
                        ctx.closePath();
                        ctx.beginPath();
                        ctx.font = '25px Impact';
                        ctx.fillStyle = killedNameColor;

                        if(arrayPlayerTwoNick[i] != undefined){
                            
                            ctx.fillText(arrayPlayerTwoNick[i],1030,previousY+35);
                            
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
                
                Twitter.post(
                    'statuses/update',
                    {
                        status:`🔵 ${ctTeamName} - ${ctScore} x ${tScore} - ${tTeamName} 🟠\n`+
                        `Map: ${mapName}\n\n`+
                        `📝Round Winner: ${data.log[0].RoundEnd.winner}\n`+
                        `📝Win type: ${verifyWinType(data.log[0].RoundEnd.winType)}\n`+
                        win
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

                function verifyWin(ctTeamName,ctScore,tTeamName,tScore){
                    if(ctScore == 16 && currentRound <=30){
                        console.log("Não chegou no OT e o CT ganhou");
                        return `✅${ctTeamName} won the map!`
                    }
                    else if(tScore == 16 && currentRound <=30){
                        console.log("Não chegou no OT e o TR ganhou");
                        return `✅${tTeamName} won the map!`
                    }
                    else if(currentRound>=31){
                        if(currentRound >limiteAnterior && currentRound <=limiteAnterior+6 && ctScore != 16 || currentRound >limiteAnterior && currentRound <=limiteAnterior+6 && tScore != 16){
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
                            return "";
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