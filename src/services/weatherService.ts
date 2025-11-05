import { CONFIG } from "../../config";

const API_URL = CONFIG.WEATHER_API_URL;
const API_KEY = CONFIG.WEATHER_API_KEY;
const lang = CONFIG.WEATHER_API_LNG;

export interface NormalizedWeather {
  date: number;
  temp: number;
  maxTemp?: number;
  minTemp?: number;
  feelsLike?: number;
  humidity: number;
  condition: string;
  icon: string;
  chanceOfRain?: number;
  isDay?: number;
}

export interface CitySuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

export async function getCurrentWeather(city: string): Promise<NormalizedWeather | null> {
  const url = `${API_URL}/current.json?key=${API_KEY}&q=${city}&lang=${lang}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Error fetching data');
    }

    const data = await res.json();
    return mappedCurrentWeather(data);
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getForecastByCity(city: string, days: number) {
  const url = `${API_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${days}&lang=${lang}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Error fetching data');
    }

    const data = await res.json();
    return mappedForecastWeather(data);
  } catch (err) {
    console.log(err);
  }
}

function mappedCurrentWeather(data: any): NormalizedWeather {
  const { current } = data;

  return {
    date: current.last_updated_epoch,
    temp: current.temp_c,
    feelsLike: current.feelslike_c,
    humidity: current.humidity,
    condition: current.condition.text,
    icon: current.condition.icon,
    isDay: current.is_day,
  };
}

function mappedForecastWeather(data: any): NormalizedWeather[] {
  return data.forecast.forecastday.map((day: any) => ({
    date: day.date_epoch,
    temp: day.day.avgtemp_c,
    maxTemp: day.day.maxtemp_c,
    minTemp: day.day.mintemp_c,
    humidity: day.day.avghumidity,
    condition: day.day.condition.text,
    icon: day.day.condition.icon,
    chanceOfRain: day.day.daily_chance_of_rain,
    isDay: day.day.is_day ?? 1,
  }));
}

export async function searchCities(query: string): Promise<CitySuggestion[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const url = `${API_URL}/search.json?key=${API_KEY}&q=${query}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Error fetching city suggestions');
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.log(err);
    return [];
  }
}
