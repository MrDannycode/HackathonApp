import { Image, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/6/60/John_Cena_July_2018.jpg',
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Cena</Text>
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
    height: 250,
    borderRadius: 40,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
});
