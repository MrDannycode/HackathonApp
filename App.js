import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import ExploreScreen from './screens/ExploreScreen';
import ProfileScreen from './screens/ProfileScreen';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Bun venit în aplicație!</Text>
      <Button title="Deschide Harta" onPress={() => navigation.navigate("Map")} />
    </View>
  );
}

function MapScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 44.4268,   // București
          longitude: 26.1025,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: 44.4268, longitude: 26.1025 }}
          title="Marker exemplu"
          description="Acesta este un marker în București"
        />
      </MapView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      <Stack.Navigator>
        <Stack.Screen name="Acasa" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
