import { View, Pressable, Text } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { HorizontalCardList } from '../horizontalCardList';
import { useEffect, useState } from 'react';
import { VerticalCardList } from '../verticalCardList';
import { router } from 'expo-router';

type OngApi = {
  cnpj: string;
  nome: string;
  descricao: string;
  telefone: string;
  latitude: number;
  longitude: number;
  foto: any;
  avaliacoes: [];
  campanhas: [];
  doacoes: [];
};

export function HomeContent() {
  const [ongsData, setOngsData] = useState<any[]>([]);
  const [campanhasData, setCampanhasData] = useState<any[]>([]);
  const { token, userType } = useAuth();
  const urlApi = process.env.EXPO_PUBLIC_URL_API;

  async function getOngs() {
    try {
      const response = await fetch(urlApi + '/ongs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
      const apiData = await response.json();

      if (Array.isArray(apiData)) {
        const newData = apiData.map((element: OngApi) => ({
          avaliacoes: element.avaliacoes,
          campanhas: element.campanhas,
          id: element.cnpj,
          descricao: element.descricao,
          latitude: element.latitude,
          longitude: element.longitude,
          name: element.nome,
          telefone: element.telefone,
          doacoes: element.doacoes,
          image: element.foto ? { uri: urlApi + '/uploads/ong/' + element.foto } : require('../../assets/images/ong.png'),
        }));
        setOngsData(newData);
      } else {
        setOngsData([]);
      }
    } catch (error) {
      console.log('erro ongs', error);
      setOngsData([]);
    }
  }

  async function getCampanhas() {
    try {
      const response = await fetch(urlApi + '/campanha', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });

      const apiData = await response.json();

      let rawList: any[] = [];
      if (apiData && apiData.body && Array.isArray(apiData.body)) {
        rawList = apiData.body;
      } else if (Array.isArray(apiData)) {
        rawList = apiData;
      }

      if (rawList.length > 0) {
        const formattedData = rawList.map((item: any) => ({
          id: item.id,
          name: item.nome || 'Campanha de doação',
          descricao: item.descricao || 'Sem descrição',
          image: item.foto ? { uri: urlApi + '/uploads/ong/' + item.foto } : require('../../assets/images/ong.png'),
        }));
        setCampanhasData(formattedData);
      } else {
        setCampanhasData([]);
      }
    } catch (error) {
      console.log('erro campanhas:', error);
      setCampanhasData([]);
    }
  }

  useEffect(() => {
    getOngs();
    getCampanhas();
  }, []);

  // DEMO (caso o backend ainda não tenha campanhas cadastradas)
  const demoCampanhas = [
    {
      id: 'demo-crianca-esperanca',
      name: 'Criança Esperança',
      image: { uri: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=1200&q=60' },
      descricao:
        'Campanha nacional de mobilização social para apoiar projetos que protegem direitos de crianças e adolescentes. (Exemplo demonstrativo no app).',
    },
    {
      id: 'demo-agasalho',
      name: 'Campanha do Agasalho',
      image: { uri: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=60' },
      descricao:
        'Arrecadação de roupas e cobertores para pessoas em situação de vulnerabilidade durante períodos mais frios. (Exemplo demonstrativo no app).',
    },
    {
      id: 'demo-alimentos',
      name: 'Arrecadação de Alimentos',
      image: { uri: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1200&q=60' },
      descricao:
        'Coleta de cestas básicas e itens essenciais para famílias em insegurança alimentar. (Exemplo demonstrativo no app).',
    },
  ];

  const campanhasParaMostrar = campanhasData.length > 0 ? campanhasData : demoCampanhas;

  return (
    <View style={{ flex: 1, padding: 20, paddingTop: 30 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#125f0c' }}>Seja bem vindo !</Text>

        {userType === 'PJ' && (
          <Pressable
            onPress={() => router.push('/auth/registerCampanha')}
            style={{
              backgroundColor: '#125f0c',
              paddingVertical: 8,
              paddingHorizontal: 15,
              borderRadius: 20,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>+ Campanha</Text>
          </Pressable>
        )}
      </View>

      <HorizontalCardList title="ONGs Próximas a você" data={ongsData} />

      <VerticalCardList
        title="Campanhas em andamento"
        data={campanhasParaMostrar}
        onPressItem={(item) => router.push({ pathname: '/campanha/[id]', params: { id: item.id } })}
      />
    </View>
  );
}
