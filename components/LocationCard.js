import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LocationCard({ location, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <Image 
          source={{ uri: location.image || location.poza || location.photo }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {location.name || location.nume || 'Locație'}
          </Text>
          {location.address || location.adresa ? (
            <Text style={styles.address} numberOfLines={1}>
              📍 {location.address || location.adresa}
            </Text>
          ) : null}
          {location.description || location.descriere ? (
            <Text style={styles.description} numberOfLines={2}>
              {location.description || location.descriere}
            </Text>
          ) : null}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>
              ⭐ {location.rating || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 4,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '500',
  },
});
