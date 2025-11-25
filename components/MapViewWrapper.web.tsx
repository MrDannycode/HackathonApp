import { StyleSheet, Text, View } from 'react-native';

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
    [key: string]: any;
  }>;
  onMarkerPress?: (location: any) => void;
}

export default function MapViewWrapper({ initialRegion, locations, onMarkerPress }: MapViewWrapperProps) {
  return (
    <View style={styles.webMapPlaceholder}>
      <Text style={styles.webMapText}>Hartă disponibilă doar pe iOS și Android</Text>
      <Text style={styles.webMapSubtext}>Folosiți aplicația pe un dispozitiv mobil pentru a vedea harta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  webMapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  webMapSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

