import { StyleSheet } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';

interface MapViewWrapperProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  locations: Array<{
    name: string;
    address: string;
    coords?: {
      lat: number;
      lng: number;
    };
    coordinates?: {
      lat: number;
      long: number;
    };
    [key: string]: any;
  }>;
  onMarkerPress?: (location: any) => void;
}

export default function MapViewWrapper({ initialRegion, locations, onMarkerPress }: MapViewWrapperProps) {
  return (
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
      {locations.map((loc, index) => {
        // Support both coordinate formats
        const lat = loc.coords?.lat || loc.coordinates?.lat;
        const lng = loc.coords?.lng || loc.coordinates?.long;
        
        if (!lat || !lng) return null;
        
        return (
          <Marker
            key={index}
            coordinate={{
              latitude: lat,
              longitude: lng,
            }}
            title={loc.name}
            description={loc.address}
            onPress={() => {
              if (onMarkerPress) {
                onMarkerPress(loc);
              }
            }}
          />
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

