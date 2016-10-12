
var fs = require('fs');
var logFile = "log.txt";
var arg1 = process.argv[2];
var arg2 = process.argv[3];
var log2file = true;

processLiri(arg1, arg2);

//This will process the arguments
function processLiri(arg1, arg2) {
	switch(arg1){
	    case 'init':
	    	//This will initialize the log. It will clear the contents and start a new log
			initLog();
			break;

	    case 'my-tweets':
	        // This will show your last 20 tweets and when they were created at in your terminal/bash window
	        callTwitter();
	        break;

	    case 'spotify-this-song':
	        // This will show information about the song in your terminal/bash window
	        if (arg2) {
	        	callSpotify(arg2);
	        } 
	        else {
				var defaultSong = "The Sign"; //by Ace of Base
	        	callSpotify(defaultSong);
	        }
	        break;

	    case 'movie-this':
	        // This will show information about the movie in your terminal/bash window
	        if (arg2) {
	        	getMovie(arg2);
	        } 
	        else {
				var defaultMovie = "Mr. Nobody";
	       		getMovie(defaultMovie);
	        }
	        break;

	    case 'do-what-it-says':
	        // Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands
	        getRandom();
	        break;
	}
}

// This will display the last 20 tweets and when they were created
function callTwitter() {
	var screenName = 'gudiaz'
	var keys = require('./keys.js');
	var twitter = require('twitter');
	var client = new twitter(keys.twitterKeys);
	var params = {screen_name: screenName};
	client.get('statuses/user_timeline', params, function(err, tweets, response) {
	    if (err) {
			writeLog('callTwitter error: ' + err);
	        return;
	    }
	    writeLog("---------------------------------------------------------------------------");
	    writeLog("- My Last 20 Tweets");
	    writeLog("---------------------------------------------------------------------------");
    	//tweets = JSON.stringify(tweets, null, 2);
	    for (i=0; i<tweets.length; i++) {
	    	if (i<=20) {
	    		writeLog(i+1 + ": " + tweets[i].text + ' tweeted on ' + tweets[i].created_at);
	    		return;
	    	}	
	    }
	});
}

// This will display the following information about the song
// Artist(s), Song's Name, Preview Link, Album
function callSpotify(songName) {
	console.log("Song: " + songName);

	var spotify = require('spotify');
	spotify.search({ type: 'track', query: songName }, function(err, data) {
	    if (err) {
			writeLog('callSpotify error: ' + err);
	        return;
	    }
	    writeLog("---------------------------------------------------------------------------");
	    writeLog("- Spotify Song Details");
	    writeLog("---------------------------------------------------------------------------");
    	//data = JSON.stringify(data, null, 2);
	    writeLog("Artist(s): " + data.tracks.items[0].artists[0].name);
	    writeLog("Song Name: " + data.tracks.items[0].name);
	    writeLog("Preview Link: " + data.tracks.items[0].preview_url);
	    writeLog("Album: " + data.tracks.items[0].album.name);
	});
}

// This will display the following information about the movie
// Title, Year, Rating, Country, Language, Plot, Actors, Rotten Tomatoes Rating and URL
function getMovie(movieName) {
	var request = require('request');
	var sUrl = 'https://www.omdbapi.com/?t=' + movieName + '&type=movie&tomatoes=true';
	console.log("Movie: " + sUrl);
	request(sUrl, function(err, response, data) {
		if (err) {
			writeLog('getMovie error: ' + err);
		    return;
		}
		data = JSON.parse(data);
	    writeLog("---------------------------------------------------------------------------");
	    writeLog("- OMDB Movie Details");
	    writeLog("---------------------------------------------------------------------------");
	    writeLog("Title: " + data.Title);
	    writeLog("Year: " + data.Year);
	    writeLog("Rating: " + data.imdbRating);
	    writeLog("Country: " + data.Country);
	    writeLog("Language: " + data.Language);
	    writeLog("Plot: " + data.Plot);
	    writeLog("Actors: " + data.Actors);
	    writeLog("Rotten Tomatoes Rating: " + data.tomatoUserRating);
	    writeLog("Rotten Tomatoes URL: " + data.tomatoURL);
	});
}

//This will read whatever is in random.txt and process the appropriate function
function getRandom() {
	var fileName = "random.txt"
	fs.readFile(fileName, 'utf8', function(err, data) {
	    if (err) {
	    	writeLog('getRandom error: ' + err);
	    	return;
	    }
    	writeLog("---------------------------------------------------------------------------");
		writeLog(data);
 	
	    var doWhat = data.split(",");
	    processLiri(doWhat[0], doWhat[1]);
	});
}

//In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`
function writeLog(logText) {
    // Print to the console
    console.log(logText);	
    
    if (log2file) {
	    // Append to the log file
	    fs.appendFile(logFile, logText + "\n");
    }
}

//Clear the log and write 'Beginning of log...'
function initLog() {
	fs.writeFile(logFile, 'Beginning of log...\n', function(err) {
	    if (err) {
	    	writeLog(error);
	    	return;
	    }

	    console.log("Log file initialized!");
	});
}