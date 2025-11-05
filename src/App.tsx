import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import WeatherPreview from './components/WeatherPreview';
import ForecastList from './components/ForecastList';
import { WeatherProvider, useWeather } from './context/weatherContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppHeader } from './components/AppHeader';
import { NormalizedWeather } from './services/weatherService';
import { StatusBar } from 'expo-status-bar';

const LOCALIZATION = 'Wroclaw';

function AppContent() {
  const { currentWeather, loading, fetchWeatherData, isDay } = useWeather();
  const [selectedWeather, setSelectedWeather] = React.useState<NormalizedWeather | null>(null);

  React.useEffect(() => {
    fetchWeatherData(LOCALIZATION, 7);
  }, [fetchWeatherData]);

  const displayWeather = selectedWeather || currentWeather;
  const isDayTime = selectedWeather ? selectedWeather.isDay === 1 : isDay;
  const isCurrentWeather =
    !selectedWeather ||
    (selectedWeather !== null && currentWeather !== null && selectedWeather.date === currentWeather.date);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <LottieView
        source={isDayTime ? require('./assets/animations/bg-day.json') : require('./assets/animations/bg-night.json')}
        autoPlay
        loop
        style={styles.background}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <AppHeader isDayTime={isDayTime} />
        <ForecastList selectedWeather={selectedWeather} onSelectWeather={setSelectedWeather} isDayTime={isDayTime} />
        {!loading ? (
          displayWeather ? (
            <WeatherPreview {...displayWeather} isCurrentWeather={isCurrentWeather} />
          ) : (
            <Text style={styles.emptyPlaceholder}>API fetching issue. Please use correct API key and try again.</Text>
          )
        ) : (
          <ActivityIndicator size={'large'} />
        )}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <WeatherProvider>
        <AppContent />
      </WeatherProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    zIndex: 1,
  },
  emptyPlaceholder: {
    paddingHorizontal: 40,
    fontSize: 16,
    textAlign: 'center',
  },
});
