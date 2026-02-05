import { View, Text } from 'react-native';
import { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { TopMenuBar } from '@/components/TopMenuBar';

type Params = {
  cnpj?: string;
  name?: string;
  latitude?: string;
  longitude?: string;
};

export default function OngMapScreen() {
  const params = useLocalSearchParams<Params>();

  const name = useMemo(() => (typeof params.name === 'string' ? params.name : 'ONG'), [params.name]);
  const latitude = useMemo(() => (typeof params.latitude === 'string' ? Number(params.latitude) : NaN), [params.latitude]);
  const longitude = useMemo(() => (typeof params.longitude === 'string' ? Number(params.longitude) : NaN), [params.longitude]);

  const hasCoords = Number.isFinite(latitude) && Number.isFinite(longitude);

  return (
    <View style={{ flex: 1 }}>
      <TopMenuBar />
      {!hasCoords ? (
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>Localização indisponível</Text>
          <Text style={{ marginTop: 6, color: '#555' }}>A ONG não possui latitude/longitude cadastradas.</Text>
        </View>
      ) : (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={{ latitude, longitude }} title={name} />
        </MapView>
      )}
    </View>
  );
}
