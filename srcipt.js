const weatherAPI_key = "ae3de0fe10a34e07a45212158232510"; // https://www.weatherapi.com


// get weather info using API call and print in console
async function weatherInfo(place) {
	// following API call returns a forecast of 7 days including current day
	const url = `http://api.weatherapi.com/v1/forecast.json?key=${weatherAPI_key}&q=${place}&days=7`;
	// fetch API response via calling to the URL
	const res = await fetch(url);
	// convert response to json so returned data can be accessed
	const data = await res.json();

	// print data and response to console
	console.log(data);
	console.log(res);
}

weatherInfo("usa");
