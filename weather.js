const apikey = "7219bab40c2ce6a7e75fe16b22622221";
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const days = [
  "Sunday",
  "Monday",
  "tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

window.addEventListener("load", () => {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=delhi&appid=${apikey}`;

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      weatherReport(data);
    });
});

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormate = hour >= 13 ? hour % 12 : hour;
  const minutes = setMinute(time.getMinutes());
  const ampm = hour >= 12 ? "PM" : "AM";
  timeEl.innerHTML =
    hoursIn12HrFormate +
    ":" +
    minutes +
    "" +
    `<span id="am-pm"> ${ampm} </span>`;
  dateEl.innerHTML = `${days[day]}, ${date} ${months[month]}`;
}, 1000);

const setMinute = (minutes) => {
  return minutes.length === 1 ? `0${minutes}` : minutes;
};

document.getElementById("search").addEventListener("click", () => {
  var place = document.getElementById("input").value;

  var place = document.getElementById("input").value;
  var urlsearch = `http://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}`;

  fetch(urlsearch)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      weatherReport(data);
    });
  // document.getElementById('input').value = '';
});

function weatherReport(data) {
  var urlcast =
    `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` +
    `appid=${apikey}`;

  fetch(urlcast)
    .then((res) => {
      return res.json();
    })
    .then((forecast) => {
      console.log(forecast.city);
      hourForecast(forecast);
      dayForecast(forecast);
      const backgroundImage = getBackgroundImg(data.weather[0].main);
      document.body.style.backgroundImage = `url(${backgroundImage})`;

      console.log(data);
      document.getElementById("city").innerText =
        data.name + ", " + data.sys.country;
      console.log(data.name, data.sys.country);

      console.log(Math.floor(data.main.temp - 273));
      document.getElementById("temperature").innerText =
        Math.floor(data.main.temp - 273) + " °C";

      document.getElementById("clouds").innerText = data.weather[0].description;
      console.log(data.weather[0].description);

      let icon1 = data.weather[0].icon;
      let iconurl = `http://openweathermap.org/img/wn/${icon1}@2x.png`;
      document.getElementById("img").src = iconurl;
    });
}

function hourForecast(forecast) {
  document.querySelector(".templist").innerHTML = "";
  for (let i = 0; i < 5; i++) {
    var date = new Date(forecast.list[i].dt * 1000);
    console.log(
      date.toLocaleTimeString(undefined, "Asia/Kolkata").replace(":00", "")
    );

    let hourR = document.createElement("div");
    hourR.setAttribute("class", "next");

    let div = document.createElement("div");
    let time = document.createElement("p");
    time.setAttribute("class", "time");

    const dt = moment(date).format("hh:mm A");
    time.innerText = dt;
    console.log("my date", dt);

    let temp = document.createElement("p");
    temp.innerText =
      Math.floor(forecast.list[i].main.temp_max - 273) +
      " °C" +
      " / " +
      Math.floor(forecast.list[i].main.temp_min - 273) +
      " °C";

    div.appendChild(time);
    div.appendChild(temp);

    let desc = document.createElement("p");
    desc.setAttribute("class", "desc");
    desc.innerText = forecast.list[i].weather[0].description;

    hourR.appendChild(div);
    hourR.appendChild(desc);
    document.querySelector(".templist").appendChild(hourR);
  }
}

const getBackgroundImg = (type) => {
  const weatherTypes = {
    Clouds: "/assets/clouds.jpg",
    Clear: "/assets/clearSky.jpg",
    Tornado: "/assets/tornado.jpg",
    Squall: "/assets/sqallyWeather.jpg",
    Ash: "/assets/ash.jpg",
    Dust: "/assets/dust.jpg",
    Sand: "/assets/sand.jpg",
    Fog: "/assets/fog.jpg",
    Haze: "/assets/haze.jpg",
    Smoke: "/assets/smoke.jpg",
    Mist: "/assets/mist.jpg",
    Snow: "/assets/snow.jpg",
    Rain: "/assets/rain.jpg",
    Drizzle: "/assets/drizzle.jpg",
    Thunderstorm: "./assets/thunderstorm.jpg",
  };
  return weatherTypes[type];
};

const changeTime = (dt) => {
  // Prepend any date. Use your birthday.
  const timeString12hr = new Date("1970-01-01T" + dt + "Z").toLocaleTimeString(
    "en-US",
    { timeZone: "UTC", hour12: true, hour: "numeric", minute: "numeric" }
  );
  return timeString12hr;
};

function dayForecast(forecast) {
  document.querySelector(".weekF").innerHTML = "";
  for (let i = 8; i < forecast.list.length; i += 8) {
    console.log(forecast.list[i]);
    let div = document.createElement("div");
    div.setAttribute("class", "dayF");

    let day = document.createElement("p");
    day.setAttribute("class", "date");
    day.innerText = new Date(forecast.list[i].dt * 1000).toDateString(
      undefined,
      "Asia/Kolkata"
    );
    div.appendChild(day);

    let temp = document.createElement("p");
    temp.innerText =
      Math.floor(forecast.list[i].main.temp_max - 273) +
      " °C" +
      " / " +
      Math.floor(forecast.list[i].main.temp_min - 273) +
      " °C";
    div.appendChild(temp);

    let description = document.createElement("p");
    description.setAttribute("class", "description");
    description.innerText = forecast.list[i].weather[0].description;
    div.appendChild(description);

    document.querySelector(".weekF").appendChild(div);
  }
}
