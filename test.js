var twit = require('twit');
const fs = require('fs');
var config = require('./config.js');
const {HLTV} = require('hltv');
const {createCanvas, loadImage } = require('canvas');
const { get } = require('http');


var Twitter =  new twit(config);

const myHLTV = HLTV.createInstance({ loadPage: (url) => fetch(url) });
const stream = Twitter.stream('statuses/filter',{track:'#BotHltv'});

var link = "https://www.hltv.org/matches/2344990/x6tence-vs-c0ntact-betway-nine-to-five-5";
var matchId;
var tweetId;
var indice = 0;
var strMaps = "";
var isLive="";

matchId = link.split('/')[4];

const canvas =  createCanvas(1920,1080);
const ctx = canvas.getContext('2d');
ctx.font = '30px Impact';
ctx.fillText('Awesome',960,540);
ctx.fillStyle = 'blue';
ctx.fillRect(0,0,canvas.width,canvas.height);

var text = ctx.measureText('Awesome!')
ctx.strokeStyle = 'rgba(0,0,0,0.5)'
ctx.beginPath()
ctx.lineTo(50, 102)
ctx.lineTo(50 + text.width, 102)
ctx.stroke();
var canvasBuffer;


canvasBuffer = canvas.toBuffer();
fs.writeFileSync("test.jpeg",canvasBuffer);


// console.log(matchId);

// var strlong = "Othavio Henrico";
// console.log(strlong.slice(0,7));

// var killLog = "!🟠MSL killed 🔵robiin with ak47 !🟠Lekr0 killed 🔵flameZ with inferno !🟠Lekr0 killed 🔵MiGHTYMAX with ak47 !💣 has been planted !🟠aizy killed 🔵Surreal with ak47 !🟠1aizy killed 🔵Surreal with ak47 !🟠2aizy killed 🔵Surreal with ak47 !🟠3aizy killed 🔵Surreal with ak47 !🟠4aizy killed 🔵Surreal with ak47";
// var killLog2;
// console.log(killLog.slice(201).substr(0,1));

// var i=200;

// while(killLog.slice(i).substr(0,1)!="!"){
//     i--;
// }
// killLog2 = killLog.slice(i);
// killLog = killLog.slice(0,i);

// var timestamp = 1604082600000;
// var date = new Date(timestamp);
// console.log(`${date.getUTCHours()}:${date.getUTCMinutes()} ${date.getUTCDate().toString()}`);
// console.log(killLog2);
// console.log(`\na\n${killLog}`);

// var RoundEnd = {
//     counterTerroristScore: 12,
//     terroristScore: 10,       
//     winner: 'TERRORIST',
//     winType: 'CTs_Win'        
//   }

// var getMatch = {
//     TERRORIST: [
//       {
//         steamId: '1:0:27276435',
//         dbId: 13980,
//         name: 'lollipop21k',    
//         score: 21,
//         deaths: 15,
//         assists: 1,
//         alive: false,
//         money: 300,
//         damagePrRound: 106.52380952380952,
//         hp: 0,
//         kevlar: false,
//         helmet: false,
//         nick: 'lollipop21k',
//         hasDefusekit: false,
//         advancedStats: [Object]
//       },
//       {
//         steamId: '1:1:63696630',
//         dbId: 13976,
//         name: 'boX',
//         score: 10,
//         deaths: 16,
//         assists: 4,
//         alive: false,
//         money: 150,
//         damagePrRound: 77.42857142857143,
//         hp: 0,
//         kevlar: false,
//         helmet: false,
//         nick: 'boX',
//         hasDefusekit: false,
//         advancedStats: [Object]
//       },
//       {
//         steamId: '1:1:39964460',
//         dbId: 13155,
//         name: 'speed4k',
//         score: 9,
//         deaths: 14,
//         assists: 1,
//         alive: true,
//         money: 150,
//         damagePrRound: 46.523809523809526,
//         hp: 26,
//         primaryWeapon: 'awp',
//         kevlar: false,
//         helmet: false,
//         nick: 'speed4k',
//         hasDefusekit: false,
//         advancedStats: [Object]
//       },
//       {
//         steamId: '1:1:21627899',
//         dbId: 12269,
//         name: 'Jyo',
//         score: 8,
//         deaths: 15,
//         assists: 2,
//         alive: false,
//         money: 850,
//         damagePrRound: 55.80952380952381,
//         hp: 0,
//         kevlar: false,
//         helmet: false,
//         nick: 'Jyo',
//         hasDefusekit: false,
//         advancedStats: [Object]
//       },
//       {
//         steamId: '1:1:57022557',
//         dbId: 11926,
//         name: 'mds',
//         score: 8,
//         deaths: 15,
//         assists: 1,
//         alive: false,
//         money: 100,
//         damagePrRound: 49.523809523809526,
//         hp: 0,
//         kevlar: false,
//         helmet: false,
//         nick: 'mds',
//         hasDefusekit: false,
//         advancedStats: [Object]
//       }
//     ],
//     CT: [
//       {
//         steamId: '1:0:46888525',
//         dbId: 11940,
//         name: 'neaLaN',
//         score: 18,
//         deaths: 14,
//         assists: 1,
//         alive: false,
//         money: 1350,
//         damagePrRound: 89,
//         hp: 0,
//         kevlar: false,
//         helmet: false,
//         nick: 'neaLaN',
//         hasDefusekit: false,
//         advancedStats: [Object]
//       },
//       {
//         steamId: '1:0:131088388',
//         dbId: 16612,
//         name: 'n0rb3r7',
//         score: 17,
//         deaths: 12,
//         assists: 2,
//         alive: false,
//         money: 1400,
//         damagePrRound: 91.71428571428571,
//         hp: 0,
//         kevlar: false,
//         helmet: false,
//         nick: 'n0rb3r7',
//         hasDefusekit: false,
//         advancedStats: [Object]
//       },
//       {
//         steamId: '1:0:69039258',
//         dbId: 15117,
//         name: 'Keoz',
//         score: 15,
//         deaths: 9,
//         assists: 6,
//         alive: true,
//         money: 3950,
//         damagePrRound: 86.52380952380952,
//         hp: 37,
//         primaryWeapon: 'ak47',
//         kevlar: true,
//         helmet: true,
//         nick: 'Keoz',
//         hasDefusekit: true,
//         advancedStats: [Object]
//       },
//       {
//         steamId: '1:1:26339383',
//         dbId: 964,
//         name: 'mou',
//         score: 15,
//         deaths: 9,
//         assists: 2,
//         alive: true,
//         money: 3150,
//         damagePrRound: 69.66666666666667,
//         hp: 100,
//         primaryWeapon: 'awp',
//         kevlar: true,
//         helmet: true,
//         nick: 'mou',
//         hasDefusekit: true,
//         advancedStats: [Object]
//       },
//       {
//         steamId: '1:1:171557725',
//         dbId: 18752,
//         name: 'kade0',
//         score: 10,
//         deaths: 12,
//         assists: 1,
//         alive: true,
//         money: 1400,
//         damagePrRound: 44.04761904761905,
//         hp: 100,
//         primaryWeapon: 'ak47',
//         kevlar: true,
//         helmet: true,
//         nick: 'kade0',
//         hasDefusekit: false,
//         advancedStats: [Object]
//       }
//     ],
//     ctMatchHistory: {
//       firstHalf: [
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object]
//       ],
//       secondHalf: [ [Object], [Object], [Object], [Object], [Object] ]
//     },
//     terroristMatchHistory: {
//       firstHalf: [
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object]
//       ],
//       secondHalf: [ [Object], [Object], [Object], [Object], [Object] ]
//     },
//     bombPlanted: false,
//     mapName: 'de_dust2',
//     terroristTeamName: 'Nemiga',
//     ctTeamName: 'K23',
//     currentRound: 21,
//     counterTerroristScore: 14,
//     terroristScore: 6,
//     ctTeamId: 7244,
//     tTeamId: 7969,
//     frozen: false,
//     live: true,
//     ctTeamScore: 15,
//     tTeamScore: 15,
//     startingCt: 7969,
//     startingT: 7244
//   }
// // HLTV.connectToScorebot({id:2345099,onScoreboardUpdate:(data,done)=>{
// //     console.log(data.live);
// //     done();
// // }});

// var ctScore = getMatch.ctTeamScore;
// var tScore = getMatch.tTeamScore;
// var otTScore = 15;
// var otCtScore = 15;
// var isFinished = false;
// var limiteAnterior = 30;
// var scoreLimit1 = 19;
// var scoreLimit2 = 19;
// var ctTeamName = getMatch.ctTeamName;
// var tTeamName = getMatch.terroristTeamName;

// if(ctScore + tScore >= 30 && isFinished == false && getMatch.frozen == false){
//     if(RoundEnd.winner == "CT"){
//         otCtScore++;
//     }
//     else if(RoundEnd.winner == "TERRORIST"){
//         otTScore++;
//     }
    
//     if(otCtScore + otTScore >limiteAnterior && otCtScore + otTScore <=limiteAnterior+6){
//         if(otCtScore == scoreLimit1){
//             isFinished = true;
//             console.log(`\n\n✅${ctTeamName} won the map!`);
//         }
//         else if(otTScore == scoreLimit1){
//             isFinished = true;
//             console.log(`\n\n✅${tTeamName} won the map!`);
//         }
//     }
//     else{
//         limiteAnterior = limiteAnterior +6;
//         scoreLimit1 = scoreLimit1+3;
//     }
//     return console.log("CT: " +otCtScore+" vs " +" T: "+ otTScore);
// }

//APENAS GUARDANDO CÓDIGO

//    else if(ctScore + tScore >= 30 && isFinished == false && frozen == false && data.log[0].RoundEnd.winner != 'DRAW'){
  //     if(RoundEnd.winner == "CT"){
  //         otCtScore++;
  //     }
  //     else if(RoundEnd.winner == "TERRORIST"){
  //         otTScore++;
  //     }
      
  //     if(otCtScore + otTScore >limiteAnterior && otCtScore + otTScore <=limiteAnterior+6){
  //         if(otCtScore == scoreLimit1){
  //             isFinished = true;
  //             Twitter.post(
  //                 'statuses/update',
  //                 {
  //                     status:`🔵 ${ctTeamName} - ${otCtScore} x ${otTScore} - ${tTeamName} 🟠\n`+
  //                     `Map: ${mapName}\n\n`+
  //                     `📝Round Winner: ${data.log[0].RoundEnd.winner}\n`+
  //                     `📝Win type: ${verifyWinType(data.log[0].RoundEnd.winType)}`+
  //                     `\n\n✅${ctTeamName} won the map!`
  //                 },
  //                 function (err,data,response){
  //                     if(err != undefined){
  //                         console.log(err);
  //                     }
  //                     else{
  //                         tweetId = data.id_str;
  //                         console.log("CTs ganharam - tweet enviado");
  //                         if(isFinished ==true){
  //                             return null;
  //                         }else{
  //                             postKillLogs(tweetId);
  //                             console.log(`🔵 ${ctTeamName} - ${otTScore} x ${otTScore} - ${tTeamName} 🟠\n`);
  //                         }
  //                     }
  //                 }
  //             );
  //         }
  //         else if(otTScore == scoreLimit1){
  //             isFinished = true;
  //             Twitter.post(
  //                 'statuses/update',
  //                 {
  //                     status:`🔵 ${ctTeamName} - ${otCtScore} x ${otTScore} - ${tTeamName} 🟠\n`+
  //                     `Map: ${mapName}\n\n`+
  //                     `📝Round Winner: ${data.log[0].RoundEnd.winner}\n`+
  //                     `📝Win type: ${verifyWinType(data.log[0].RoundEnd.winType)}`+
  //                     `\n\n✅${tTeamName} won the map!`
  //                 },
  //                 function (err,data,response){
  //                     if(err != undefined){
  //                         console.log(err);
  //                     }
  //                     else{
  //                         tweetId = data.id_str;
  //                         console.log("Terroristas ganharam - tweet enviado");
  //                         if(isFinished ==true){
  //                             setTimeout(()=>{
  //                                 done();
  //                             },10000);
  //                         }else{
  //                             postKillLogs(tweetId);
  //                             console.log(`🔵 ${ctTeamName} - ${otTScore} x ${otTScore} - ${tTeamName} 🟠\n`);
  //                         }
  //                     }
  //                 }
  //             );
  //         }
  //         else{
  //             Twitter.post(
  //                 'statuses/update',
  //                 {
  //                     status:`🔵 ${ctTeamName} - ${otCtScore} x ${otTScore} - ${tTeamName} 🟠\n`+
  //                     `Map: ${mapName}\n\n`+
  //                     `📝Round Winner: ${data.log[0].RoundEnd.winner}\n`+
  //                     `📝Win type: ${verifyWinType(data.log[0].RoundEnd.winType)}`
  //                 },
  //                 function (err,data,response){
  //                     if(err != undefined){
  //                         console.log(err);
  //                     }
  //                     else{
  //                         tweetId = data.id_str;
  //                         console.log("Ninguém ganhou ainda - tweet enviado");
  //                         if(isFinished ==true){
  //                             setTimeout(()=>{
  //                                 done();
  //                             },10000);
  //                         }else{
  //                             postKillLogs(tweetId);
  //                             console.log(`🔵 ${ctTeamName} - ${otTScore} x ${otTScore} - ${tTeamName} 🟠\n`);
  //                         }
  //                     }
  //                 }
  //             );
  //         }
  //     }
  //     else{
  //         limiteAnterior = limiteAnterior +6;
  //         scoreLimit1 = scoreLimit1+3;
  //     }

  //     return console.log("CT: " +otCtScore+" vs " +" T: "+ otTScore);
  // }

// stream.on('tweet',function(tweet){
//   	tweetId = tweet.id_str;
// 	matchId = tweet.text.split('#BotHltv')[1].trim();
// 	console.log(tweet);
// 	if(tweet.user.screen_name == "FireXter" && tweet.text.split('#BotHltv')[1].trim() +1 >3){
// 		console.log("tweet do dono.");
// 	}
// });

// var numero = "oioioioi";



// HLTV.getMatches().then((res) => {

// 	for(var i = 0;i<=res.length;i++){
// 		if(res[i].team1.name == "OG" || res[i].team2.name == "OG"){
// 			HLTV.getMatch({id:res[i].id}).then(result=>{
// 				switch(result.format){
// 					case "Best of 3":
// 						indice = 3;
// 						break;
// 					case "Best of 2":
// 						indice = 2;
// 						break;
// 					case "Best of 1":
// 						indice = 1;
// 						break;
// 				}
// 				for(var i = 0;i<indice;i++){
// 					strMaps += `Map ${i+1}: ${result.maps[i].name} ${result.maps[i].result}\n`
// 				}
// 				console.log(strMaps);
// 				result.live == false ? isLive = "no" : isLive="yes"
// 				console.log("Is it live now? R: " + isLive);
// 			});
// 		}
// 		else{
// 			console.log("There's no match for this team");
// 		}
// 	}
	
// });

// if(numero + numero >1){
// 	console.log("aeeeeeeee");
// }

// function testTweetImage(){
//     /**
//  * Video Tweet constructor
//  **/
// var VideoTweet = function (data) {

//     var self = this;
//     self.file_path = data.file_path;
//     self.tweet_text = data.tweet_text;
//     self.total_bytes = undefined;
//     self.media_id = undefined;
//     self.processing_info = undefined;
  
//     // retreives file info and inits upload on complete
//     fs.stat(self.file_path, function (error, stats) {
//       self.total_bytes = stats.size
//       self.upload_init();
//     });
//   };
  
  
//   /**
//    * Inits media upload
//    */
//   VideoTweet.prototype.upload_init = function () {
  
//     console.log('INIT');
  
//     var self = this;
  
//     t.post('media/upload', 
//         {
//       'command': 'INIT',
//       'media_type': 'video/mp4',
//       'total_bytes': self.total_bytes,
//       'media_category': 'tweet_video'
//     },
  
//     // inits media upload
//   function (error, response, body) {
//       // store media ID for later reference
//       console.log(body)
//       self.media_id = response.media_id_string;
  
//       // start appening media segments
//       self.upload_append();
//     })
  
//   }
  
  
//   /**
//    * Uploads/appends video file segments
//    */
//   VideoTweet.prototype.upload_append = function () {
  
//     var buffer_length = 5000000;
//     var buffer = Buffer.alloc(buffer_length);
//     var bytes_sent = 0;
  
//     var self = this;
  
//     // open and read video file
//     fs.open(self.file_path, 'r', function(error, file_data) {
  
//       var bytes_read, data,
//       segment_index = 0,
//       segments_completed = 0;
  
//       // upload video file in chunks
//       while (bytes_sent < self.total_bytes) {
  
//         console.log('APPEND');
  
//         bytes_read = fs.readSync(file_data, buffer, 0, buffer_length, null);
//         data = bytes_read < buffer_length ? buffer.slice(0, bytes_read) : buffer;
        
  
//         t.post('media/upload', 
//         {
//             command: 'APPEND',
//             media_id: self.media_id,
//             segment_index: segment_index,
//             media_data: data.toString('base64')
//         },
  
//         function (error, response, body) {
  
//           segments_completed = segments_completed + 1;
  
//           console.log('segment_completed');
//           if (segments_completed == segment_index) {
//                  console.log(body)
//             console.log('Upload chunks complete');
//             console.log(error)
//             self.upload_finalize();
//           }
//         });
        
//         bytes_sent = bytes_sent + buffer_length;
//         segment_index = segment_index + 1;
//       }
//     });
  
//   }
  
  
//   /**
//    * Finalizes media segments uploaded 
//    */
//   VideoTweet.prototype.upload_finalize = function () {
  
//     console.log('FINALIZE');
  
//     var self = this;
  
//     t.post('media/upload', 
//         {
//       'command': 'FINALIZE',
//       'media_id': self.media_id
//     },
    
//     function(error, response, body) {
//       console.log(body)
//       self.check_status(response.processing_info);
      
//     });
//   }
  
//   /**
//    * Checks status of uploaded media
//    */
//   VideoTweet.prototype.check_status = function (processing_info) {
//     var self = this;
  
//     // if response does not contain any processing_info, then video is ready
//     if (!processing_info) {
//       self.tweet();
//       return;
//     }
  
//     console.log('STATUS');
//     t.get('media/upload', 
//     {
//       'command': 'STATUS',
//       'media_id': self.media_id
//     },
  
//     // check processing status 
//    function(error, response, body) {
//     console.log(body)
  
//       console.log('Media processing status is ' + processing_info.state);
  
//       if (processing_info.state == 'succeeded') {
//         self.tweet();
//         return
//       }
    
//       else if (processing_info.state == 'failed') {
//         return;
//       }
  
//       // check status again after specified duration
//       var timeout_length = processing_info.check_after_secs ? processing_info.check_after_secs * 1000 : 0;
  
//       console.log('Checking after ' + timeout_length + ' milliseconds');
  
//       setTimeout(function () {
//         self.check_status(processing_info)
//       }, timeout_length);
//     });
//   }
  
  
//   /**
//    * Tweets text with attached media
//    */
//   VideoTweet.prototype.tweet = function () {
  
//     var self = this;
  
//     t.post('statuses/update', 
//         {
//       'status': self.tweet_text,
//       'media_ids': self.media_id
//     })
  
//     // publish Tweet
  
  
  
//   }
  
  
//   /**
//    * Instantiates a VideoTweet
//    */
//   videoTweet = new VideoTweet({
//     file_path: '',
//     tweet_text: 'I just uploaded a video with the @TwitterAPI and #nodejs.'
//   });  
// }