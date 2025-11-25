import LocationCard from '@/components/LocationCard';
import MapViewWrapper from '@/components/MapViewWrapper';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ExploreScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = {
    background: isDark ? '#0f1115' : '#f5f5f5',
    surface: isDark ? '#1c1f24' : '#fff',
    border: isDark ? '#2a2d34' : '#eee',
    text: isDark ? '#f5f7fb' : '#333',
    muted: isDark ? '#a0a6b5' : '#666',
    toggleActive: isDark ? '#f5f7fb' : '#000',
  };

  const handleLocationPress = (location: any) => {
    // Navigate to detail screen with location data
    try {
      const locationJson = JSON.stringify(location);
      const locationParam = encodeURIComponent(locationJson);
      console.log('Navigating to location:', location.name);
      router.push({
        pathname: '/location/[id]',
        params: { id: locationParam },
      });
    } catch (error) {
      console.error('Error navigating to location:', error);
    }
  };

  useEffect(() => {
    fetch('https://thecon.ro/wp-content/uploads/2025/11/locatii.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          // Normalize data structure to support both formats
          const normalizedData = data.map(item => ({
            ...item,
            // Support both coordinate formats
            coords: item.coordinates 
              ? { lat: item.coordinates.lat, lng: item.coordinates.long }
              : item.coords,
            // Support both image formats
            image: item.image_url || item.image || item.poza || item.photo,
            // Support both name formats
            name: item.name || item.nume,
            // Support both address formats
            address: item.address || item.adresa,
            // Support both description formats
            description: item.short_description || item.description || item.descriere,
          }));
          setLocations(normalizedData);
        } else {
          console.warn('Data is not an array:', data);
          setLocations([]);
        }
      })
      .catch(err => {
        console.error('Error fetching locations:', err);
        // Set empty array on error to prevent crashes
        setLocations([]);
      });
  }, []);

  const filteredLocations = locations.filter(location => {
    const text = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !text ||
      location.name?.toLowerCase().includes(text) ||
      location.address?.toLowerCase().includes(text) ||
      location.description?.toLowerCase().includes(text);

    return matchesSearch;
  });

  const displayLocations = filteredLocations;

  const fallbackLocation = displayLocations[0] || locations[0];

  const initialRegion = fallbackLocation
    ? {
        latitude:
          fallbackLocation?.coords?.lat ||
          fallbackLocation?.coordinates?.lat ||
          46.77,
        longitude:
          fallbackLocation?.coords?.lng ||
          fallbackLocation?.coordinates?.long ||
          23.59,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }
    : {
        latitude: 46.77,
        longitude: 23.59,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="Caută locații..."
          placeholderTextColor={theme.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
      </View>

      <View
        style={[
          styles.toggleContainer,
          {
            backgroundColor: theme.surface,
            shadowOpacity: isDark ? 0 : 0.1,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'list' && [
              styles.toggleButtonActive,
              { backgroundColor: theme.toggleActive },
            ],
          ]}
          onPress={() => setViewMode('list')}
        >
          <Text
            style={[
              styles.toggleText,
              { color: theme.muted },
              viewMode === 'list' && [
                styles.toggleTextActive,
                { color: isDark ? '#000' : '#fff' },
              ],
            ]}
          >
            Listă
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'map' && [
              styles.toggleButtonActive,
              { backgroundColor: theme.toggleActive },
            ],
          ]}
          onPress={() => setViewMode('map')}
        >
          <Text
            style={[
              styles.toggleText,
              { color: theme.muted },
              viewMode === 'map' && [
                styles.toggleTextActive,
                { color: isDark ? '#000' : '#fff' },
              ],
            ]}
          >
            Hartă
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'list' ? (
        <FlatList
          data={displayLocations}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item }) => (
            <LocationCard
              location={item}
              onPress={() => handleLocationPress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                Nicio locație găsită
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
                Ajustează căutarea sau filtrele pentru a vedea alte rezultate.
              </Text>
            </View>
          }
        />
      ) : (
        <MapViewWrapper
          initialRegion={initialRegion}
          locations={displayLocations}
          onMarkerPress={handleLocationPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#eee',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 10,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#000',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    padding: 12,
    paddingBottom: 20,
  },
});
