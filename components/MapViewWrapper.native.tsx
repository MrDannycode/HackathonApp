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
  }>;
}

export default function MapViewWrapper({ initialRegion, locations }: MapViewWrapperProps) {
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
        if (!loc.coords?.lat || !loc.coords?.lng) return null;
        
        return (
          <Marker
            key={index}
            coordinate={{
              latitude: loc.coords.lat,
              longitude: loc.coords.lng,
            }}
            title={loc.name}
            description={loc.address}
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

