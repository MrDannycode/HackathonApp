import { useColorScheme, useTheme } from '@/hooks/use-color-scheme';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { themePreference, toggleColorScheme, setThemePreference } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = {
    background: isDark ? '#0f1115' : '#f5f5f5',
    card: isDark ? '#1c1f24' : '#fff',
    text: isDark ? '#f5f7fb' : '#333',
    muted: isDark ? '#a0a6b5' : '#555',
  };

  const nextModeLabel =
    (themePreference === 'dark' || (themePreference === 'system' && isDark))
      ? 'Comută pe modul luminos'
      : 'Comută pe modul întunecat';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.profileContainer, { backgroundColor: theme.card }]}>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/6/60/John_Cena_July_2018.jpg',
          }}
          style={styles.profileImage}
        />
        <Text style={[styles.profileName, { color: theme.text }]}>John Cena</Text>
        <Text style={[styles.profileSubtitle, { color: theme.muted }]}>
          You can't see this profile... or can you?
        </Text>

        <TouchableOpacity
          style={[
            styles.themeButton,
            { backgroundColor: isDark ? '#6c63ff' : '#111' },
          ]}
          onPress={toggleColorScheme}
        >
          <Text style={styles.themeButtonText}>{nextModeLabel}</Text>
        </TouchableOpacity>

        {themePreference !== 'system' && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setThemePreference('system')}
          >
            <Text style={[styles.resetButtonText, { color: theme.muted }]}>
              Revino la modul sistem
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 20,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  profileImage: {
    width: 150,
    height: 220,
    borderRadius: 40,
    backgroundColor: '#ddd',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  profileSubtitle: {
    marginTop: 6,
    fontSize: 16,
    textAlign: 'center',
  },
  themeButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  themeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 12,
  },
  resetButtonText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
