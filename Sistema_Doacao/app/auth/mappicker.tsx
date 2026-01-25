import { View, Pressable, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useState } from 'react';
import { router } from 'expo-router';

const INITIAL_LOCATION = {
  latitude: -6.891931027755727,
  longitude: -38.56002467222115,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function MapPicker() {
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  function confirmLocation() {
    if (!marker) return;

    router.replace({
      pathname: '/auth/register',
      params: {
        latitude: marker.latitude.toString(),
        longitude: marker.longitude.toString(),
      },
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        initialRegion={INITIAL_LOCATION}
        style={{ flex: 1 }}
        onPress={(event) => setMarker(event.nativeEvent.coordinate)}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      <Pressable style={styles.button} onPress={confirmLocation}>
        <Text style={styles.buttonText}>Confirmar localização</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    backgroundColor: '#2FC224',
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});