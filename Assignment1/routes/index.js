/*
	This is the index.js file.
	This file fetches data from the NewsData.io API and
	renders the index.pug file.
*/

// Necessary imports
var express = require("express");
const dotenv = require("dotenv").config();
var router = express.Router();
const axios = require("axios");
const AWS = require("aws-sdk")

// Promise constructor
AWS.config.setPromisesDependency();

const s3 = new AWS.S3({	apiVersion: '2006-03-01'});

// NewsData.io API key
const API_KEY = process.env.NEWS_DATA_API_KEY



// The following function fetches data from NewsData.io API
// and page counter 
// (the code for S3 bucket is based on the following AWS documentations: 
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
// https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html)

router.get("/", async function (req, res) {
	const NEWS_ENDPOINT = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en`;
	let count;

	try {
		// Get all buckets from the AWS account
		const buckets = await s3.listBuckets().promise();
		let bucket = {}

		// Search for the bucket and put that into the bucket variable
		buckets.Buckets.forEach(bucket_ => {
			if (bucket_.Name == "n10510702-assignment1") {
				bucket = bucket_;
			}
		});


		let params = {
			Bucket: bucket.Name,
		}

		// Get all objects from the desired bucket
		const objects = await s3.listObjectsV2(params).promise();
		// Add the object key to the params
		params.Key = objects.Contents[0].Key;

		// Get the desired object
		const object = await s3.getObject(params).promise();

		// Parse the object into readable data
		const viewCount = JSON.parse(object.Body)

		// Add to the params the count object +1 in a binary string format
		params.Body = JSON.stringify({
			'count': viewCount.count + 1
		});
		count = viewCount.count + 1;
		console.log('count', count)
		// Put this back into  object in the bucket
		await s3.putObject(params).promise();

	} catch (err) {
		console.log(`error:${err}`);
	}

	// Fetch data by using the NewsData.io endpoint
	try {
		await axios.get(NEWS_ENDPOINT).then((response) => {
			const { data } = response;
			const allNews = data.results;	
			const latestNews = allNews;	

			res.render("index", { news: latestNews, count: count });

		});
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = router;

