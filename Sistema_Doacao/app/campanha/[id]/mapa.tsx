import { View, Text, ActivityIndicator } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '@/contexts/AuthContext';
import { TopMenuBar } from '@/components/TopMenuBar';

type Campanha = {
  id: string;
  nome: string;
  cnpjOng?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type ONG = {
  cnpj: string;
  nome: string;
  latitude?: number | null;
  longitude?: number | null;
};

const DEMO_COORDS: Record<string, { nome: string; latitude: number; longitude: number }> = {
  'demo-crianca-esperanca': { nome: 'ONG Parceira (Exemplo)', latitude: -22.9068, longitude: -43.1729 },
  'demo-agasalho': { nome: 'ONG Solidária (Exemplo)', latitude: -23.5505, longitude: -46.6333 },
  'demo-alimentos': { nome: 'ONG de Apoio (Exemplo)', latitude: -7.1195, longitude: -34.8450 },
};

export default function MapaOng() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token, logout } = useAuth();
  const urlApi = process.env.EXPO_PUBLIC_URL_API;

  const [loading, setLoading] = useState(true);
  const [campanha, setCampanha] = useState<Campanha | null>(null);
  const [ong, setOng] = useState<ONG | null>(null);

  const profileIcon = useMemo(() => require('../../../assets/images/UserAnonimo.png'), []);

  async function load() {
    if (!id) return;

    if (String(id).startsWith('demo-') && DEMO_COORDS[String(id)]) {
      setCampanha({ id: String(id), nome: 'Campanha', cnpjOng: null });
      setOng({ cnpj: 'demo', nome: DEMO_COORDS[String(id)].nome, latitude: DEMO_COORDS[String(id)].latitude, longitude: DEMO_COORDS[String(id)].longitude });
      setLoading(false);
      return;
    }

    try {
      const resp = await fetch(urlApi + '/campanha/' + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
      const raw = await resp.json();
      const c: Campanha = raw?.body ?? raw;
      setCampanha(c);

      const respOng = await fetch(urlApi + '/ongs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
      const rawOng = await respOng.json();

      if (Array.isArray(rawOng) && c?.cnpjOng) {
        const found = rawOng.find((o: any) => o.cnpj === c.cnpjOng);
        if (found) setOng(found);
      }

      setLoading(false);
    } catch (e) {
      console.log('Erro ao carregar mapa', e);
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  const lat = ong?.latitude ?? campanha?.latitude ?? -7.1195;
  const lng = ong?.longitude ?? campanha?.longitude ?? -34.8450;
  const nome = ong?.nome ?? 'ONG';

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <TopMenuBar homeIconUrl={require('../../../assets/images/home.png')} profileIconUrl={profileIcon} onLogout={logout} />

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ padding: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#125f0c' }}>Localização da ONG</Text>
            <Text style={{ marginTop: 4, color: '#036134' }}>{nome}</Text>
          </View>

          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: Number(lat),
              longitude: Number(lng),
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
          >
            <Marker coordinate={{ latitude: Number(lat), longitude: Number(lng) }} title={nome} />
          </MapView>
        </View>
      )}
    </View>
  );
}
