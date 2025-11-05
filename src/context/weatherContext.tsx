import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { getCurrentWeather, getForecastByCity, NormalizedWeather } from '../services/weatherService';

interface WeatherContextType {
  currentWeather: NormalizedWeather | null;
  forecast: NormalizedWeather[];
  city: string;
  loading: boolean;
  loadingForecast: boolean;
  error: string | null;
  errorForecast: string | null;
  isDay: boolean;
  fetchCurrentWeather: (city: string) => Promise<void>;
  fetchForecast: (city: string, days?: number) => Promise<void>;
  fetchWeatherData: (city: string, days?: number) => Promise<void>;
  setCity: (city: string) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

interface WeatherProviderProps {
  children: ReactNode;
}

export function WeatherProvider({ children }: WeatherProviderProps) {
  const [currentWeather, setCurrentWeather] = useState<NormalizedWeather | null>(null);
  const [forecast, setForecast] = useState<NormalizedWeather[]>([]);
  const [city, setCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingForecast, setLoadingForecast] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorForecast, setErrorForecast] = useState<string | null>(null);

  const fetchCurrentWeather = useCallback(async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const weather = await getCurrentWeather(cityName);
      if (weather) {
        setCurrentWeather(weather);
        setCity(cityName);
      } else {
        setError('Failed to fetch current weather');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching current weather');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchForecast = useCallback(async (cityName: string, days: number = 7) => {
    setLoadingForecast(true);
    setErrorForecast(null);
    try {
      const forecastData = await getForecastByCity(cityName, days);
      if (forecastData) {
        setForecast(forecastData);
      } else {
        setErrorForecast('Failed to fetch forecast');
      }
    } catch (err) {
      setErrorForecast(err instanceof Error ? err.message : 'Error fetching forecast');
    } finally {
      setLoadingForecast(false);
    }
  }, []);

  const fetchWeatherData = useCallback(
    async (cityName: string, days: number = 7) => {
      await Promise.all([fetchCurrentWeather(cityName), fetchForecast(cityName, days)]);
    },
    [fetchCurrentWeather, fetchForecast]
  );

  const updateCity = useCallback((cityName: string) => {
    setCity(cityName);
  }, []);

  const isDay = currentWeather?.isDay === 1;

  const value: WeatherContextType = {
    currentWeather,
    forecast,
    city,
    loading,
    loadingForecast,
    error,
    errorForecast,
    isDay,
    fetchCurrentWeather,
    fetchForecast,
    fetchWeatherData,
    setCity: updateCity,
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather(): WeatherContextType {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
