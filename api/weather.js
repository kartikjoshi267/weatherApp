import { apiKey } from '../constants/';
import axios from 'axios';

const forecastEndPoint = (params) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;

const locationsEndPoint = (params) => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

const apiCall = async (endPoint) => {
  const options = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const { data } = await axios.get(endPoint, options);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const fetchWeatherForecast = params => {
  return apiCall(forecastEndPoint(params));
}

export const fetchLocationsUsingCoordinates = params => {
  return apiCall(locationsUsingCoordinatesEndPoint(params));
}

export const fetchLocations = params => {
  return apiCall(locationsEndPoint(params));
}