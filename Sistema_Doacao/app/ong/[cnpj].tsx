import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { TopMenuBar } from '@/components/TopMenuBar';

type Params = {
  cnpj?: string;
  name?: string;
  descricao?: string;
  latitude?: string;
  longitude?: string;
  imageUri?: string;
};

export default function OngDetailScreen() {
  const params = useLocalSearchParams<Params>();

  const cnpj = useMemo(() => (typeof params.cnpj === 'string' ? params.cnpj : ''), [params.cnpj]);
  const name = useMemo(() => (typeof params.name === 'string' ? params.name : 'ONG'), [params.name]);
  const descricao = useMemo(() => (typeof params.descricao === 'string' ? params.descricao : ''), [params.descricao]);
  const latitude = useMemo(() => (typeof params.latitude === 'string' ? Number(params.latitude) : NaN), [params.latitude]);
  const longitude = useMemo(() => (typeof params.longitude === 'string' ? Number(params.longitude) : NaN), [params.longitude]);
  const imageUri = useMemo(() => (typeof params.imageUri === 'string' ? params.imageUri : ''), [params.imageUri]);

  return (
    <View style={{ flex: 1, backgroundColor: '#e7f7e6' }}>
      <TopMenuBar />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 18 }}>
        <Text style={{ fontSize: 30, fontWeight: '900', color: '#125f0c', marginBottom: 14 }}>{name}</Text>

        <Image
          source={imageUri ? { uri: imageUri } : require('../../assets/images/ong.png')}
          style={{ width: '100%', height: 220, borderRadius: 18, marginBottom: 14 }}
          resizeMode="cover"
        />

        <View style={{ backgroundColor: '#c4ecc1', borderRadius: 18, padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '900', color: '#0a3b05', marginBottom: 6 }}>Sobre a ONG</Text>

          <Text style={{ color: '#333', lineHeight: 20 }}>
            {descricao?.trim()?.length ? descricao : 'Sem descrição disponível.'}
          </Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/auth/donation',
                  params: { cnpj, targetName: name },
                })
              }
              style={{
                flex: 1,
                backgroundColor: '#125f0c',
                paddingVertical: 12,
                borderRadius: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: '800' }}>Doar</Text>
            </Pressable>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/ong/[cnpj]/mapa',
                  params: { cnpj, name, latitude: String(latitude), longitude: String(longitude) },
                })
              }
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderWidth: 2,
                borderColor: '#125f0c',
                paddingVertical: 12,
                borderRadius: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#125f0c', fontWeight: '800' }}>Localização</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
