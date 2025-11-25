import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function LocationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = {
    background: isDark ? '#0f1115' : '#fff',
    surface: isDark ? '#1c1f24' : '#fff',
    text: isDark ? '#f5f7fb' : '#333',
    muted: isDark ? '#a0a6b5' : '#666',
    border: isDark ? '#2a2d34' : '#eee',
  };

  // Parse location data from route params
  let locationData = null;
  try {
    if (id) {
      const decoded = decodeURIComponent(id);
      locationData = JSON.parse(decoded);
      console.log('Location data parsed successfully:', locationData?.name);
    } else {
      console.warn('No id parameter found in route');
    }
  } catch (error) {
    console.error('Error parsing location data:', error);
    console.error('Raw id value:', id);
    locationData = null;
  }

  if (!locationData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Locație negăsită</Text>
        {id && (
          <Text style={[styles.errorText, { fontSize: 12, marginTop: 10 }]}>
            ID: {id.substring(0, 50)}...
          </Text>
        )}
      </View>
    );
  }

  const currentDescription = generatedDescription || locationData.description || locationData.short_description || '';

  const handleReservation = () => {
    // Create WhatsApp link with location name and address
    const message = `Bună! Aș dori să fac o rezervare la ${locationData.name} (${locationData.address || ''})`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    Linking.openURL(whatsappUrl).catch(err => {
      console.error('Error opening WhatsApp:', err);
      alert('Nu s-a putut deschide WhatsApp. Te rugăm să instalezi aplicația.');
    });
  };

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    setGeneratedDescription(null);

    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    const originalDescription = locationData.short_description || locationData.description || 'Mâncare bună';
    
    // If no API key is set, use fallback immediately
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      console.log('No API key configured, using fallback description');
      setTimeout(() => {
        setGeneratedDescription(
          `✨ ${locationData.name} este un loc special unde atmosfera se întâlnește cu experiența culinară. ${originalDescription} Descoperă magia acestui loc și lasă-te sedus de farmecul său unic! 🌟`
        );
        setIsGenerating(false);
      }, 1000); // Simulate loading for better UX
      return;
    }

    try {
      // Using OpenAI API as example - you can replace with Gemini, Anthropic, etc.
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Ești un scriitor creativ care scrie descrieri atractive și captivante pentru restaurante și cafenele. Scrie în română, într-un stil modern și atractiv.',
            },
            {
              role: 'user',
              content: `Rescrie următoarea descriere pentru "${locationData.name}" într-un stil creativ și captivant: "${originalDescription}"`,
            },
          ],
          max_tokens: 150,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', response.status, errorText);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.choices[0]?.message?.content?.trim() || '';
      
      if (generatedText) {
        setGeneratedDescription(generatedText);
      } else {
        throw new Error('Empty response from API');
      }
    } catch (error) {
      console.error('Error generating description:', error);
      // Fallback to a creative description for demo purposes
      const fallbackDescriptions = [
        `✨ ${locationData.name} este un loc special unde atmosfera se întâlnește cu experiența culinară. ${originalDescription} Descoperă magia acestui loc și lasă-te sedus de farmecul său unic! 🌟`,
        `🌟 La ${locationData.name}, fiecare vizită devine o experiență memorabilă. ${originalDescription} Un loc unde tradiția se întâlnește cu inovația, creând momente de neuitat. 🎨`,
        `💫 ${locationData.name} - mai mult decât un simplu local, este o destinație. ${originalDescription} Aici, fiecare detaliu contează și fiecare moment este transformat într-o amintire de preț. ✨`,
      ];
      
      // Pick a random fallback description
      const randomFallback = fallbackDescriptions[Math.floor(Math.random() * fallbackDescriptions.length)];
      setGeneratedDescription(randomFallback);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={{ uri: locationData.image || locationData.image_url || 'https://via.placeholder.com/400' }}
        style={styles.headerImage}
        resizeMode="cover"
      />
      
      <View style={[styles.content, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>{locationData.name}</Text>
        
        {locationData.address && (
          <Text style={[styles.address, { color: theme.muted }]}>📍 {locationData.address}</Text>
        )}

        {locationData.rating && (
          <View style={styles.ratingContainer}>
            <Text style={[styles.rating, { color: isDark ? '#f5c451' : '#FF6B35' }]}>
              ⭐ {locationData.rating}
            </Text>
          </View>
        )}

        <View style={styles.descriptionContainer}>
          <Text style={[styles.descriptionLabel, { color: theme.text }]}>Descriere</Text>
          <Text style={[styles.description, { color: theme.muted }]}>{currentDescription}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            styles.generateButton,
            { backgroundColor: isDark ? '#6c63ff' : '#6366f1' },
            isGenerating && styles.buttonDisabled,
          ]}
          onPress={handleGenerateDescription}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.buttonText}>Se generează...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>✨ Generează Descriere Vibe</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.reservationButton,
            { backgroundColor: isDark ? '#1ebe6b' : '#25D366' },
          ]}
          onPress={handleReservation}
        >
          <Text style={styles.buttonText}>📱 Rezervă</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  rating: {
    fontSize: 18,
    color: '#FF6B35',
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 56,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  generateButton: {
    backgroundColor: '#6366f1',
  },
  reservationButton: {
    backgroundColor: '#25D366', // WhatsApp green
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});

