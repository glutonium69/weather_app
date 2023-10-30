const weatherAPI_key = "ae3de0fe10a34e07a45212158232510"; // https://www.weatherapi.com


// depending on the length of the place name we will showcase them either in h1 or h2 tag
let is_place_name_long = false;


// get weather info using API call and print in console
async function weatherInfo(place) {
	
	// following API call returns a forecast of 7 days including current day
	const url = `http://api.weatherapi.com/v1/forecast.json?key=${weatherAPI_key}&q=${place}&days=7`;
	// fetch API response via calling to the URL
	const res = await fetch(url);
	// convert response to json so returned data can be accessed
	const data = await res.json();

	// calling function by passing the data as argument
	setPlace(data);

	// print data and response to console
	console.log(data);
	console.log(res);
}

weatherInfo("london");



// set the current place name on web
function setPlace(data) {

	// extract essential data
	const country = data.location.country;
	const city = data.location.name;
	const text = city + ", " + country;

	// get related elements
	const place_h1 = document.querySelector(".place_h1");
	const place_h2 = document.querySelector(".place_h2");

	// longer names look really big in h1 tags eg [Concord Regional Airport, United States Of America]
	// hence if name has too many digits implying a long name then we are showing it in a h2 instead of h1
	if (text.length > 27 || is_place_name_long) {
		is_place_name_long = true;
		place_h2.textContent = text;
		place_h1.style.display = "none";
	} else {
		is_place_name_long = false;
		place_h2.textContent = "";
		place_h1.innerHTML = city + ", <br>" + country;
	}
}
