//secret
const apiResponse = await window.weatherStore.api();

const weather_type = await window.weatherStore.weather_code();

//tell if day or night
const day_or_night = (hours) => {
    const isDay = hours > 6 && hours < 20;
    if (isDay === true) {
        return { time: "day", };
    } else {
        return "night";
    };
};

//display current weather and temp base on date and time 
(async () => {
    const weather = await apiResponse;
    // console.log(weather.status, " ", weather.data);

    const hour_ = weather.data.hourly.time;
    const temp_ = weather.data.hourly.temperature_2m;
    const weather_code = weather.data.hourly.weather_code;

    const current_time = new Date(Date.now());

    //weather info combined
    const weather_info = hour_.map((time_, index) => ({
        time: new Date(time_), //time
        temperature: temp_[index], //temperature
        weather_code: weather_code[index] //weather
    }));

    //display the current time
    const current_weather = weather_info.filter((info) => {
        const weather_time = new Date(info.time);
        return current_time.getDate() === weather_time.getDate() && current_time.getHours() === weather_time.getHours();
    });

    const weather_number = current_weather[0].weather_code;
    const weather_temp = current_weather[0].temperature;
    const weather_time = current_weather[0].time.getHours();

    // search the weather code using the weather number
    const weather_day = day_or_night(weather_time) === 'day' ? weather_type[weather_number].day : weather_type[weather_number].night;
    const temp = weather_temp.toString() + " °C";
    window.weatherStore.temp(temp);

    //  locate button
    const locate_ = document.querySelector(".location");
    locate_.innerHTML = '<img src="location.png">'

    locate_.addEventListener("click", async() => {
        await window.weatherStore.location();
    });

    const info_weather = () => {

        const date_ = new Date();
        //time
        let hours = date_.getHours();
        let minutes = date_.getMinutes();
        const seconds = date_.getSeconds();

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours  % 12 || 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        document.querySelector(".weather").innerHTML = `
            <img src="${weather_day.image}" alt="${weather_day.description}">
            <h1>${weather_day.description}</h1>
            <h2>${weather_temp} °C</h2>
            <h3>${hours} : ${minutes} : ${seconds} ${ampm}</h3>    
        `;
    };

    //update everysecond
    setInterval(info_weather, 1000);
    info_weather();

})();