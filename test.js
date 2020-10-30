var twit = require('twit');
const fs = require('fs');
var config = require('./config.js');
const {HLTV} = require('hltv');
const { createCanvas } = require('canvas');


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
console.log(matchId);

var strlong = "Othavio Henrico";
console.log(strlong.slice(0,7));


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