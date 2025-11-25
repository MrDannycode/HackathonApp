import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// Exemplu de locații; mai târziu le încarci din JSON
const locations = [
  { name: 'Cafenea 1', lat: 44.43, lng: 26.1, description: 'Cafea bună' },
  { name: 'Restaurant 1', lat: 44.44, lng: 26.11, description: 'Mâncare gustoasă' }
];

export default function ExploreScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 44.43,
          longitude: 26.1,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {locations.map(loc => (
          <Marker
            key={loc.name}
            coordinate={{ latitude: loc.lat, longitude: loc.lng }}
            title={loc.name}
            description={loc.description}
            onPress={() => navigation.navigate('Details', { location: loc })}
          />
        ))}
      </MapView>
    </View>
  );
}
