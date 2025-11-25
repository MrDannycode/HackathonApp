import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function LocationCard({ location, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: 'row', margin: 10, borderRadius: 8, overflow: 'hidden', elevation: 2 }}>
        <Image source={{ uri: location.image }} style={{ width: 100, height: 100 }} />
        <View style={{ padding: 10, flex: 1 }}>
          <Text style={{ fontWeight: 'bold' }}>{location.name}</Text>
          <Text>{location.rating} ⭐</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
