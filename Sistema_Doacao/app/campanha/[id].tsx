import { View, Text, Image, FlatList, Pressable, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { TopMenuBar } from '@/components/TopMenuBar';

type Campanha = {
  id: string;
  nome: string;
  descricao: string;
  foto?: string;
  cnpjOng?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type ONG = {
  cnpj: string;
  nome: string;
  descricao?: string | null;
  telefone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  foto?: string | null;
};

const SCREEN_WIDTH = Dimensions.get('window').width;

const DEMO: Record<string, { campanha: Campanha; ong: ONG }> = {
  'demo-crianca-esperanca': {
    campanha: {
      id: 'demo-crianca-esperanca',
      nome: 'Criança Esperança',
      descricao:
        'Campanha nacional de mobilização social para apoiar projetos que protegem direitos de crianças e adolescentes. Este é um exemplo demonstrativo — ao cadastrar campanhas pelo backend, os dados reais aparecem aqui.',
      foto: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=60',
      latitude: -22.9068,
      longitude: -43.1729,
      cnpjOng: 'demo-ong',
    },
    ong: {
      cnpj: 'demo-ong',
      nome: 'ONG Parceira (Exemplo)',
      descricao: 'Exemplo de ONG parceira para demonstrar o fluxo.',
      telefone: '(00) 00000-0000',
      latitude: -22.9068,
      longitude: -43.1729,
      foto: 'https://images.unsplash.com/photo-1520975958225-1a087a1b4b33?auto=format&fit=crop&w=1200&q=60',
    },
  },
  'demo-agasalho': {
    campanha: {
      id: 'demo-agasalho',
      nome: 'Campanha do Agasalho',
      descricao:
        'Arrecadação de roupas e cobertores para pessoas em situação de vulnerabilidade durante períodos mais frios. Este é um exemplo demonstrativo.',
      foto: 'https://images.unsplash.com/photo-1520975958225-1a087a1b4b33?auto=format&fit=crop&w=1200&q=60',
      latitude: -23.5505,
      longitude: -46.6333,
      cnpjOng: 'demo-ong-2',
    },
    ong: {
      cnpj: 'demo-ong-2',
      nome: 'ONG Solidária (Exemplo)',
      descricao: 'Exemplo de ONG parceira para demonstrar o mapa.',
      telefone: '(00) 00000-0000',
      latitude: -23.5505,
      longitude: -46.6333,
      foto: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&w=1200&q=60',
    },
  },
  'demo-alimentos': {
    campanha: {
      id: 'demo-alimentos',
      nome: 'Arrecadação de Alimentos',
      descricao:
        'Coleta de cestas básicas e itens essenciais para famílias em insegurança alimentar. Este é um exemplo demonstrativo.',
      foto: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1200&q=60',
      latitude: -7.1195,
      longitude: -34.8450,
      cnpjOng: 'demo-ong-3',
    },
    ong: {
      cnpj: 'demo-ong-3',
      nome: 'ONG de Apoio (Exemplo)',
      descricao: 'Exemplo de ONG para demonstrar o fluxo completo.',
      telefone: '(00) 00000-0000',
      latitude: -7.1195,
      longitude: -34.8450,
      foto: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=60',
    },
  },
};

export default function CampanhaDetalhes() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token, login, logout } = useAuth();
  const urlApi = process.env.EXPO_PUBLIC_URL_API;

  const [loading, setLoading] = useState(true);
  const [campanha, setCampanha] = useState<Campanha | null>(null);
  const [ong, setOng] = useState<ONG | null>(null);

  const profileIcon = useMemo(() => require('../../assets/images/UserAnonimo.png'), []);

  async function load() {
    if (!id) return;

    // DEMO fallback
    if (String(id).startsWith('demo-') && DEMO[String(id)]) {
      setCampanha(DEMO[String(id)].campanha);
      setOng(DEMO[String(id)].ong);
      setLoading(false);
      return;
    }

    try {
      // campanha
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

      // ongs (para pegar localização e nome)
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
      console.log('Erro ao carregar campanha', e);
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  const imagensCarousel = useMemo(() => {
    const list: string[] = [];
    if (campanha?.foto) {
      list.push(String(campanha.foto).startsWith('http') ? String(campanha.foto) : urlApi + '/uploads/ong/' + campanha.foto);
    }
    if (ong?.foto) {
      list.push(String(ong.foto).startsWith('http') ? String(ong.foto) : urlApi + '/uploads/ong/' + ong.foto);
    }
    // imagem extra para deixar o carrossel mais “real”
    list.push('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=60');
    return list;
  }, [campanha?.foto, ong?.foto]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <TopMenuBar
        homeIconUrl={require('../../assets/images/home.png')}
        profileIconUrl={profileIcon}
        onLogout={logout}
      />

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#125f0c', marginBottom: 12 }}>
            {campanha?.nome ?? 'Campanha'}
          </Text>

          <FlatList
            data={imagensCarousel}
            horizontal
            pagingEnabled
            keyExtractor={(item, index) => item + index}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={{ width: SCREEN_WIDTH - 32, height: 220, borderRadius: 18, marginRight: 10 }}
                resizeMode="cover"
              />
            )}
          />

          <View style={{ marginTop: 14, backgroundColor: '#c4ecc1', borderRadius: 18, padding: 14 }}>
            {!!ong?.nome && (
              <Text style={{ color: '#036134', fontWeight: '700', marginBottom: 6 }}>ONG: {ong.nome}</Text>
            )}

            <Text style={{ color: '#0d0d0d', lineHeight: 20 }}>
              {campanha?.descricao ?? 'Sem descrição.'}
            </Text>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <Pressable
                onPress={() => router.push({ pathname: '/campanha/[id]/doar', params: { id: String(id) } })}
                style={{
                  flex: 1,
                  backgroundColor: '#125f0c',
                  paddingVertical: 12,
                  borderRadius: 14,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontWeight: '800' }}>Doar para campanha</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push({ pathname: '/campanha/[id]/mapa', params: { id: String(id) } })}
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
      )}
    </View>
  );
}
