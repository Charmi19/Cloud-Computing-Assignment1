/*
	This is the api.js file.
	This file uses the NewsData.io API to fetch the latest news headlines
	when a Get request from the client is received.
*/


// Necessary imports
const { default: axios } = require("axios");
const dotenv = require("dotenv").config();
const { response } = require("express");
var express = require("express");
var router = express.Router();


// The following function fetches the latest news headlines based on the country code 
// of the country clicked
router.get("/latestNews/:countryCode", async (req, res) => {
	console.log(
		"We are in /news/latestNews route of the app: countryCode: ",
		req.params.countryCode
	);

	// NewsData.io API key
	const API_KEY = process.env.NEWS_DATA_API_KEY;

	const NEWS_ENDPOINT = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en&country=${req.params.countryCode}`;
	
	// Fetches data by using the NewsData.io endpoint
	try {
		await axios.get(NEWS_ENDPOINT).then((response) => {
			const { data } = response;
			const allNews = data.results;
			const latestNews = allNews;
			res.send({ countryNews: latestNews });
		});
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = router;
