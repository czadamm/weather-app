import React from 'react';
import { Pressable, StyleSheet, Text, Image } from 'react-native';
import { NormalizedWeather } from '../services/weatherService';
import { useWeather } from '../context/weatherContext';

interface ForecastDayProps {
  weather: NormalizedWeather;
  dayLabel?: string;
  onPress?: () => void;
  isActive?: boolean;
  isDayTime?: boolean;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getDayName(date: number): string {
  const dateObj = new Date(date * 1000);
  return DAY_NAMES[dateObj.getDay()];
}

export default function ForecastDay({ weather, dayLabel, onPress, isActive = false, isDayTime }: ForecastDayProps) {
  const { isDay: contextIsDay } = useWeather();

  // Use isDayTime prop if provided, otherwise fall back to context isDay
  const isDay = isDayTime !== undefined ? isDayTime : contextIsDay;

  let dayName: string;
  if (dayLabel === 'NOW') {
    dayName = 'Currently';
  } else if (dayLabel === 'TODAY') {
    dayName = 'Today';
  } else {
    dayName = getDayName(weather.date);
  }
  const iconUrl = weather.icon.startsWith('//') ? `https:${weather.icon}` : weather.icon;
  const maxTemp = weather.maxTemp ?? weather.temp;

  const handlePress = () => {
    if (!isActive && onPress) {
      onPress();
    }
  };

  const textColor = isDay ? styles.colorsDay : styles.colorsNight;

  return (
    <Pressable style={[styles.container, isActive && styles.containerActive]} onPress={handlePress} disabled={isActive}>
      <Text style={[styles.dayLabel, textColor]}>{dayName}</Text>
      <Image source={{ uri: iconUrl }} style={styles.icon} resizeMode="contain" />
      <Text style={[styles.temp, textColor]}>{Math.round(maxTemp)}°</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(183, 183, 183, 0.23)',
    borderRadius: 8,
    marginHorizontal: 4,
    paddingVertical: 4,
  },
  containerActive: {
    backgroundColor: 'transparent',
  },
  colorsDay: {
    color: '#000',
  },
  colorsNight: {
    color: '#fff',
  },
  dayLabel: {
    fontSize: 16,
  },
  icon: {
    width: 40,
    height: 40,
  },
  temp: {
    fontSize: 16,
    fontWeight: '500',
  },
});
