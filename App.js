import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch('https://thecon.ro/hackathon/locations.json')
      .then(res => res.json())
      .then(data => setLocations(data));
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Lista">
          {props => <HomeScreen {...props} locations={locations} />}
        </Stack.Screen>

        <Stack.Screen name="Harta">
          {props => <MapScreen {...props} locations={locations} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
