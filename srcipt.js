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
	setCurrentTempAndCondition(data);
	dailyForecast(data);
	airCondition(data);
	weeklyForecast(data);

	// print data and response to console
	console.log(data);
	console.log(res);
}

weatherInfo("russia");



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


// set the current temp info on the web 
// sets up the temperature and sets up the tempInfo icon as well 
function setCurrentTempAndCondition(data) {

	// extract essential data
	const currentTemp = data.current.temp_c;
	const currentCondition = data.current.condition.text;
	const currentConditionIcon = data.current.condition.icon;

	// get related elements
	const temp_h2 = document.querySelector(".current_temp_h2");
	const condition = document.querySelector(".current_condition");
	const img = document.querySelector(".temp img");

	// set up the temp and icon
	temp_h2.innerHTML = Math.round(currentTemp) + "&degC";
	condition.textContent = currentCondition;
	img.src = currentConditionIcon;
}


// set daily forecast
function dailyForecast(data) {
	
	// extract essential data
	const dataHourArray = data.forecast.forecastday[0].hour;
	// get related elements as node list
	const placeHolders = document.querySelectorAll(".dailyForecast .data h3");
	const icons = document.querySelectorAll(".dailyForecast .data img");

	// we r getting todays temp on these times
	// 6 -> 6:00 AM || 18 -> 6:00 PM
	const hours = [6, 9, 12, 15, 18, 21];

	// iterate through the node list
	placeHolders.forEach((holder, index) => {
		// hours are arranged corresponding to the index in the array eg : hour[15] -> 15:00 / 3:00 PM
		// using the index of the placeholder we r getting which hour we are currently updating
		// using that hour as the index we r getting the temp of that hour
		const temp = dataHourArray[hours[index]].temp_c;
		const icon = dataHourArray[hours[index]].condition.icon;
		// set up temp and icon
		holder.innerHTML = temp + "&deg";
		icons[index].src = icon;
	});
}


// set air condition
function airCondition(data) {
	// extract essential data
	const realFeel = data.current.feelslike_c;
	const windSpeed = data.current.wind_kph;
	const rain = data.forecast.forecastday[0].hour[getHour()].chance_of_rain; // chances of rain vary on different hours of the day hence we need to get the current hour from the user end to get the current chances of rain
	const uv = data.current.uv;

	// set the real feel
	const realFeelTag = document.querySelector(".real-feel");
	realFeelTag.innerHTML = realFeel + "&degC";

	// set wind speed
	const windSpeedTag = document.querySelector(".wind-speed");
	windSpeedTag.textContent = windSpeed + "km/h";

	// set chance of rain
	const rainTag = document.querySelector(".rain-chance");
	rainTag.textContent = rain + "%";

	// set uv index
	const uvTag = document.querySelector(".uv-index");
	uvTag.textContent = uv;
}


// get users current hour
function getHour() {
	let date = new Date();
	return date.getHours();
}


// set up the forecast of the following 6 days
function weeklyForecast(data) {
	// extract essential data
	const dataArrWeekly = data.forecast.forecastday;
	// get related element
	const infoData = document.querySelectorAll(".weeklyForecast .info .data");

	for (let i = 1; i < dataArrWeekly.length; i++) {
		// accessing the objects date inside the object if the array that is being passed in the function
		const dayName = getDayName(dataArrWeekly[i].date);
		// querySelectorAll() returns an iterable nodelist
		// in order to access the p tag in the nodes we are first accessing each node elements via inforData[i -1]
		// then we are accessing the e=child nodes which are in an array
		// p tag being the first elements has the index of 0 hence accessed via children[0]
		// substring() only extracts the characters within the given index sunday will be shown as -> sun;  where s[0] and d[3]
		infoData[i - 1].children[0].textContent = dayName.substring(0, 3);
		infoData[i - 1].children[1].children[0].src = dataArrWeekly[i].day.condition.icon;
		infoData[i - 1].children[2].innerHTML = dataArrWeekly[i].day.avgtemp_c + "&degC";
	}
}

// get the day name from the given date
function getDayName(dateString) {
	var date = new Date(dateString);
	return date.toLocaleDateString("en-US", { weekday: "long" });
}
