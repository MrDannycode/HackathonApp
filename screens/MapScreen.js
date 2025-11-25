import { StyleSheet, View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';

export default function MapScreen({ locations, route }) {
  const selectedLocation = route?.params?.selectedLocation;
  
  const initialRegion = selectedLocation
    ? {
        latitude: selectedLocation.coords?.lat || 46.77,
        longitude: selectedLocation.coords?.lng || 23.59,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : locations.length > 0
    ? {
        latitude: locations[0]?.coords?.lat || 46.77,
        longitude: locations[0]?.coords?.lng || 23.59,
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
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {locations.map((loc, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: loc.coords?.lat || 0,
              longitude: loc.coords?.lng || 0,
            }}
            title={loc.name}
            description={loc.address}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 }
});
