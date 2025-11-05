import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useWeather } from '../context/weatherContext';
import ForecastDay from './ForecastDay';
import { NormalizedWeather } from '../services/weatherService';

function isToday(date: number): boolean {
  const forecastDate = new Date(date * 1000);
  const today = new Date();

  return (
    forecastDate.getDate() === today.getDate() &&
    forecastDate.getMonth() === today.getMonth() &&
    forecastDate.getFullYear() === today.getFullYear()
  );
}

interface ForecastListProps {
  selectedWeather: NormalizedWeather | null;
  onSelectWeather: (weather: NormalizedWeather | null) => void;
  isDayTime?: boolean;
}

export default function ForecastList({ selectedWeather, onSelectWeather, isDayTime }: ForecastListProps) {
  const { currentWeather, forecast, isDay: contextIsDay } = useWeather();

  const isDay = isDayTime !== undefined ? isDayTime : contextIsDay;

  const todayIndex = forecast.findIndex((day) => isToday(day.date));
  const todayForecast = todayIndex !== -1 ? forecast[todayIndex] : null;
  const remainingForecast = forecast.filter((day, index) => index !== todayIndex);

  const isSelected = (weather: NormalizedWeather) => {
    if (!selectedWeather) return false;
    return selectedWeather.date === weather.date;
  };

  const handlePress = (weather: NormalizedWeather) => {
    if (isSelected(weather)) {
      onSelectWeather(null);
    } else {
      onSelectWeather(weather);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        alwaysBounceHorizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {currentWeather && (
          <ForecastDay
            weather={currentWeather}
            dayLabel="NOW"
            isActive={isSelected(currentWeather)}
            onPress={() => handlePress(currentWeather)}
            isDayTime={isDay}
          />
        )}
        {todayForecast && (
          <ForecastDay
            weather={todayForecast}
            dayLabel="TODAY"
            isActive={isSelected(todayForecast)}
            onPress={() => handlePress(todayForecast)}
            isDayTime={isDay}
          />
        )}
        {remainingForecast.map((dayWeather, index) => (
          <ForecastDay
            key={index}
            weather={dayWeather}
            isActive={isSelected(dayWeather)}
            onPress={() => handlePress(dayWeather)}
            isDayTime={isDay}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    marginTop: 100,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
});
