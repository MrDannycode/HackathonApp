import { Image, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: 'https://via.placeholder.com/200/000000/FFFFFF?text=Profile',
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Utilizator</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
});
