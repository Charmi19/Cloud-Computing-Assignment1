/*
	This is the twitter.js file. 
	This file fetches the keywords data from the NewsData.io API and 
	uses the information to get tweets from the Twitter API.
	The Twit package is use to get all the tweets and the sentiment
	package is use to provide a sentiment score on the tweets.
*/

// Necessary imports
const { default: axios } = require("axios");
const { response } = require("express");
const dotenv = require("dotenv").config();
var express = require("express");
var router = express.Router();

// Importing Twit and sentiment packages
const Twit = require("twit");
const Sentiment = require("sentiment");
const colors = require("colors/safe");

// Twitter credentials
const { CONSUMER_KEY
	, CONSUMER_SECRET
	, ACCESS_TOKEN
	, ACCESS_TOKEN_SECRET
	} = process.env;


const config_twitter = {
	consumer_key: CONSUMER_KEY,
	consumer_secret: CONSUMER_SECRET,
	access_token: ACCESS_TOKEN,
	access_token_secret: ACCESS_TOKEN_SECRET,
	timeout_ms: 60 * 1000,
};

// The following code is from Boostlog article:
// https://boostlog.io/_anshulc95/twitter-sentiment-analysis-using-nodejs-5ad1331247018500491f3b6a/

let api = new Twit(config_twitter);

// The following function extracts the text of the tweets
function get_text(tweet) {
	let txt = tweet.retweeted_status
		? tweet.retweeted_status.full_text
		: tweet.full_text;
	return txt
		.split(/ |\n/)
		.filter((v) => !v.startsWith("http"))
		.join(" ");
}

// The following function extracts the text of the tweets
// and removes any links the text may contain
async function get_tweets(q, count) {
	let tweets = await api.get("search/tweets", {

		q,
		count,
		tweet_mode: "extended",
		lang: "en",
	});
	return tweets.data.statuses.map(get_text);
}

// Output tweets
async function main(title, keyword) {
	let count = 10;
	let tweets = await get_tweets(keyword, count);
	return tweets;
}

// The following function analyses the sentiment of the tweets and gives 
// a score (0 = neutral, < 0 = negative, > 0 = positive)
function analysis(tweets) {
	var sentiment = new Sentiment();
	let results = [];
	for (const tweet of tweets) {
		let score = sentiment.analyze(tweet).comparative;
		if (score > 0) {
			results.push({
				tweet: tweet,
				color: "green",
				score: score,
			});
		} else if (score < 0) {
			results.push({
				tweet: tweet,
				color: "red",
				score: score,
			});
		} else {
			results.push({
				tweet: tweet,
				color: "blue",
				score: score,
			});
		}

	}
	console.log(results);
	return results;
}


// The following function renders the article pug file
router.get("/", (req, res) => {
	const tweets = ["1", "2"];
	console.log(tweets);
	res.render("article", { tweet: "twitterValue" });
});

// The following function extracts the keywords from the clicked headline
// and outputs the tweets on a different page
router.get("/:title/:keywords", async (req, res) => {
	console.log("title: ", req.params.title);
	console.log("keywords: ", req.params.keywords);
	const keyword = req.params.keywords ? req.params.keywords[0] : "covid19";
	try {
		const tweets = await main(req.params.title, keyword);
		console.log(tweets);
		if (tweets) {
			const analysedTweets = analysis(tweets);
			res.render("article", {
				tweets: analysedTweets,
				title: req.params.title,
			});
		}
	} catch (err) {
		console.log(err);
		throw new Error(err);
	}
});

module.exports = router;
