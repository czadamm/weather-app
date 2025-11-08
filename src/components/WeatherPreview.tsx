import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { NormalizedWeather } from '../services/weatherService';

const DETAILS_COLOR = '#fff';
const DETAILS_FONT_SIZE = 18;
const BOLDED_FONT_SIZE = 26;

interface WeatherPreviewProps extends NormalizedWeather {
  isCurrentWeather?: boolean;
}

export default function WeatherPreview({ isCurrentWeather = false, ...data }: WeatherPreviewProps) {
  const iconUrl = data.icon.startsWith('//') ? `https:${data.icon}` : data.icon;
  const isDay = iconUrl.includes('day');

  return (
    <View style={styles.padding}>
      <View style={styles.outerContainer}>
        <ScrollView style={{ flex: 1 }} alwaysBounceVertical={false} showsVerticalScrollIndicator={false}>
          <View style={styles.innerContainer}>
            <Image source={{ uri: iconUrl }} style={styles.icon} resizeMode="contain" />
            <Text style={[styles.temperature, { color: isDay ? 'black' : 'white' }]}>
              <Text style={styles.label}>{!isCurrentWeather ? 'Avg: ' : 'Now: '}</Text>
              {Math.round(data.temp)}°
            </Text>
            <Text style={styles.condition}>{data.condition}</Text>
            {data.feelsLike !== undefined && (
              <Text style={styles.feelsLike}>
                Feels like: <Text style={styles.bolded}>{Math.round(data.feelsLike)}°</Text>
              </Text>
            )}
            {data.maxTemp !== undefined && data.minTemp !== undefined && (
              <View style={styles.tempRange}>
                <Text style={styles.tempText}>
                  Highest: <Text style={styles.bolded}>{Math.round(data.maxTemp)}°</Text>
                </Text>
                <Text style={styles.tempText}>
                  Lowest: <Text style={styles.bolded}>{Math.round(data.minTemp)}°</Text>
                </Text>
              </View>
            )}
            <Text style={styles.humidity}>
              Humidity: <Text style={styles.bolded}>{data.humidity}%</Text>
            </Text>
            {data.chanceOfRain !== undefined && (
              <Text style={styles.rainChance}>
                Chance of rain: <Text style={styles.bolded}>{data.chanceOfRain}%</Text>
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  padding: {
    width: '100%',
    padding: 16,
    flex: 1,
  },
  outerContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'rgba(183, 183, 183, 0.23)',
  },
  innerContainer: {
    padding: 40,
    alignItems: 'center',
  },
  date: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  icon: {
    width: 100,
    height: 100,
  },
  temperature: {
    fontSize: 66,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  label: {
    fontSize: DETAILS_FONT_SIZE,
    fontWeight: 'normal',
  },
  condition: {
    fontSize: 22,
    fontWeight: 700,
    color: DETAILS_COLOR,
    marginTop: 8,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  feelsLike: {
    fontSize: DETAILS_FONT_SIZE,
    color: DETAILS_COLOR,
    marginTop: 8,
  },
  tempRange: {
    flexDirection: 'row',
    marginTop: DETAILS_FONT_SIZE,
    justifyContent: 'center',
  },
  tempText: {
    fontSize: DETAILS_FONT_SIZE,
    color: DETAILS_COLOR,
    marginHorizontal: 8,
  },
  humidity: {
    fontSize: DETAILS_FONT_SIZE,
    color: DETAILS_COLOR,
    marginTop: 12,
  },
  rainChance: {
    fontSize: DETAILS_FONT_SIZE,
    color: DETAILS_COLOR,
    marginTop: 8,
  },
  bolded: {
    fontSize: BOLDED_FONT_SIZE,
    fontWeight: 700,
  },
});
