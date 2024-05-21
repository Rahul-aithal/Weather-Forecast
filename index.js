import apiKey from "./api_key";

function getLocation() {

  return new Promise((res, rej) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          res({ latitude, longitude });
        },
        error => {
          rej(new Error("Unable to retrieve location: " + error.message));
        }
      );
    } else {
      rej(new Error("Geolocation is not supported by this browser."));
    }
  });
}

function upadteValues(report = {}) {
  const windspeed = document.getElementsByClassName("windspeed")
  const humi = document.getElementsByClassName("humi")
  const temperatures = document.getElementsByClassName("temperature")
  const description = document.getElementsByClassName("description")

  description[0].innerHTML = report.weather[0].main
  temperatures[0].innerText = report.main.temp + "°C";

  humi[0].innerHTML = 'Humidity: ' + report.main.humidity + "%"

  windspeed[0].innerHTML = "Wind: " + Math.round((report.wind.speed * (60 ** 2)) / 1000) + "km/h"
}



async function weather(CityName = undefined, lat = undefined, lon = undefined) {
  
  const baseUrl = "https://api.openweathermap.org/data/2.5/weather?"
  let res
  if (lat !== undefined && lon !== undefined) {
    res = await fetch(`${baseUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
  
  }
  else if (CityName !== undefined) {
    res = await fetch(`${baseUrl}q=${CityName}&appid=${apiKey}&units=metric`)
    
  }
  else {
    throw new Error('City or coordinates must be provided.');
  }
  return (await res.json())
}




const main = async () => {
  let report
  const CityNames = document.getElementById('weather');


  if (CityNames.value === "Current Location" || CityNames.value === "") {

    try {
      let Locs = await getLocation()
      report = await weather(undefined, Locs.latitude, Locs.longitude);
      upadteValues(report)

    }
    catch (error) {
      alert(error.message);
      return;
    }
  }

  CityNames.addEventListener('change', async (event) => {
    const location = event.target.value;
    report = await weather(location, undefined, undefined);
    if (report.cod === "404") {
      alert("Enter a valid city name")
    }
    upadteValues(report)
  })
}


document.addEventListener('DOMContentLoaded', main)