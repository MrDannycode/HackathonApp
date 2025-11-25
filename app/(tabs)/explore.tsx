import LocationCard from '@/components/LocationCard';
import MapViewWrapper from '@/components/MapViewWrapper';
import { useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ExploreScreen() {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [locations, setLocations] = useState([]);

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

  const initialRegion = locations.length > 0
    ? {
        latitude: locations[0]?.coords?.lat || locations[0]?.coordinates?.lat || 46.77,
        longitude: locations[0]?.coords?.lng || locations[0]?.coordinates?.long || 23.59,
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
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
            Listă
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
          onPress={() => setViewMode('map')}
        >
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
            Hartă
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'list' ? (
        <FlatList
          data={locations}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item }) => (
            <LocationCard
              location={item}
              onPress={() => {
                // Switch to map view and focus on this location (only on native)
                if (Platform.OS !== 'web') {
                  setViewMode('map');
                }
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <MapViewWrapper initialRegion={initialRegion} locations={locations} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
