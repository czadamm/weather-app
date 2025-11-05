import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { searchCities, CitySuggestion } from '../services/weatherService';
import { useWeather } from '../context/weatherContext';

interface AppHeaderProps {
  isDayTime?: boolean;
}

export function AppHeader({ isDayTime }: AppHeaderProps) {
  const [query, setQuery] = useState('Warsaw');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { fetchWeatherData, isDay: contextIsDay } = useWeather();

  const isDay = isDayTime !== undefined ? isDayTime : contextIsDay;

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchCities(searchQuery);
      setSuggestions(results);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleQueryChange = useCallback(
    (text: string) => {
      setQuery(text);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(text);
      }, 400);
    },
    [fetchSuggestions]
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleCitySelect = useCallback(
    (city: CitySuggestion) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setQuery(city.name);
      setSuggestions([]);
      fetchWeatherData(city.name, 7);
    },
    [fetchWeatherData]
  );

  const renderSuggestion = useCallback(
    ({ item }: { item: CitySuggestion }) => (
      <Pressable style={styles.suggestionItem} onPress={() => handleCitySelect(item)}>
        <Text style={styles.suggestionText}>
          {item.name}, {item.region ? `${item.region}, ` : ''}
          {item.country}
        </Text>
      </Pressable>
    ),
    [handleCitySelect]
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={[styles.input, isDay ? styles.colorsDay : styles.colorsNight]}
          placeholder="Search for a city..."
          placeholderTextColor={isDay ? '#737373' : '#242c4e'}
          value={query}
          onChangeText={handleQueryChange}
          autoCapitalize="words"
          autoCorrect={false}
        />
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item.id.toString()}
              keyboardShouldPersistTaps="handled"
              maxToRenderPerBatch={10}
              windowSize={5}
            />
          </View>
        )}
        {isLoading && suggestions.length === 0 && query.length >= 2 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.loadingText}>Loading suggestions...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    width: '100%',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
    zIndex: 1000,
  },
  input: {
    height: 64,
    width: '100%',
    paddingHorizontal: 12,
    fontSize: 28,
    borderRadius: 8,
    textAlign: 'center',
  },
  colorsDay: {
    color: '#272727',
    backgroundColor: 'rgba(150, 89, 111, 0.22)',
  },
  colorsNight: {
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 82,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  loadingText: {
    padding: 16,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});
