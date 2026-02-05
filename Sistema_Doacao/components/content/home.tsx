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
    const [ongsData, setOngsData] = useState([])
    const [campanhasData, setCampanhasData] = useState([])
    const { token, userType } = useAuth();
    const urlApi = process.env.EXPO_PUBLIC_URL_API

    async function getOngs() {
        try {
            const response = await fetch(urlApi + "/ongs/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
            })
            const apiData = await response.json()
            console.log("API ONGs - Dados brutos:", apiData);
            if (apiData) {
                const newDate = apiData.map((element: OngApi) => ({
                    avaliacoes: element.avaliacoes,
                    campanhas: element.campanhas,
                    id: element.cnpj,
                    cnpj: element.cnpj, // CNPJ para doação
                    descricao: element.descricao,
                    latitude: element.latitude,
                    longitude: element.longitude,
                    name: element.nome,
                    telefone: element.telefone,
                    doacoes: element.doacoes,
                    image: { uri: urlApi + "/uploads/ong/" + element.foto }
                }));
                setOngsData(newDate)
            }
        } catch (error) {
            console.log("erro ongs")
        }
    }

    async function getCampanhas() {
        try {
            const response = await fetch(urlApi + "/campanha", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
            })

            const apiData = await response.json()
            console.log("--- DEBUG CAMPANHAS ---");
            console.log("Status:", response.status);
            console.log("Dados:", apiData);

            let rawList = [];
            if (apiData && apiData.body && Array.isArray(apiData.body)) {
                rawList = apiData.body;
            } else if (Array.isArray(apiData)) {
                rawList = apiData;
            }

            if (rawList.length > 0) {
                const formattedData = rawList.map((item: any) => ({
                    id: item.id || String(Math.random()),
                    idCampanha: item.id,
                    cnpj: item.cnpjOng,
                    name: item.nome || "Nova Campanha", // Pega o nome real se existir
                    descricao: item.descricao  || "Sem descrição disponível",
                    image: item.foto ? { uri: urlApi + "/uploads/ong/" + item.foto } : require("../../assets/images/ong.png")
                }))
                setCampanhasData(formattedData as any)
            } else {
                setCampanhasData([])
            }
        } catch (error) {
            console.log("erro campanhas:", error)
        }
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
          descricao: item.descricao || 'Campanha em andamento. Consulte os detalhes para saber como doar e qual a necessidade prioritária.',
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

  // DEMO (caso o backend ainda não tenha dados cadastrados)
  const demoOngs = [
    {
      id: 'demo-ias',
      name: 'Instituto Ayrton Senna',
      image: { uri: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=60' },
      descricao:
        'Educação que transforma vidas: apoio a projetos de alfabetização, permanência escolar e formação de professores. Suas doações ajudam a ampliar oportunidades para crianças e jovens. (Exemplo demonstrativo no app).',
      latitude: -7.1195,
      longitude: -34.8450,
    },
    {
      id: 'demo-cvb',
      name: 'Cruz Vermelha Brasileira',
      image: { uri: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=800&q=60' },
      descricao:
        'Apoio humanitário em emergências, campanhas de saúde e assistência social. Doe para fortalecer ações de acolhimento, triagem e distribuição de donativos. (Exemplo demonstrativo no app).',
      latitude: -7.1153,
      longitude: -34.8631,
    },
    {
      id: 'demo-acao-cidadania',
      name: 'Ação da Cidadania',
      image: { uri: 'https://images.unsplash.com/photo-1603749459299-0334c9b1b1e6?auto=format&fit=crop&w=800&q=60' },
      descricao:
        'Combate à fome e à pobreza com arrecadação e distribuição de alimentos, cestas básicas e itens essenciais. Sua doação vira dignidade na mesa de famílias vulneráveis. (Exemplo demonstrativo no app).',
      latitude: -7.1030,
      longitude: -34.8610,
    },
    {
      id: 'demo-pastoral-crianca',
      name: 'Pastoral da Criança',
      image: { uri: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=60' },
      descricao:
        'Acompanhamento de gestantes e crianças com foco em saúde, nutrição e desenvolvimento. Doações ajudam em materiais, ações educativas e suporte às famílias. (Exemplo demonstrativo no app).',
      latitude: -7.0857,
      longitude: -34.8368,
    },
    {
      id: 'demo-graacc',
      name: 'GRAACC (Exemplo)',
      image: { uri: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=60' },
      descricao:
        'Apoio a crianças e adolescentes em tratamento, com foco em acolhimento e bem‑estar. Doe itens e ajude a manter redes de cuidado e suporte. (Exemplo demonstrativo no app).',
      latitude: -7.1350,
      longitude: -34.8730,
    },
    {
      id: 'demo-ong-solidaria',
      name: 'ONG Solidária (Exemplo)',
      image: { uri: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=60' },
      descricao:
        'Rede de voluntários para arrecadar roupas, cobertores e calçados em bom estado e entregar a pessoas em situação de vulnerabilidade. (Exemplo demonstrativo no app).',
      latitude: -7.0900,
      longitude: -34.8550,
    },
  ];

  const ongsParaMostrar = (() => {
    const base = Array.isArray(ongsData) ? ongsData : [];
    const merged = [...base];

    for (const item of demoOngs) {
      const exists = merged.some((x) => String(x.id) === String(item.id));
      if (!exists) merged.push(item);
    }

    return merged.slice(0, 8);
  })();

  // DEMO (caso o backend ainda não tenha campanhas cadastradas)
  const demoCampanhas = [
    {
      id: 'demo-crianca-esperanca',
      name: 'Criança Esperança',
      image: { uri: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=60' },
      descricao:
        'Mobilização para apoiar projetos sociais que protegem direitos de crianças e adolescentes. As doações ajudam a financiar ações de educação, alimentação, proteção e desenvolvimento em comunidades carentes. (Exemplo demonstrativo no app).',
    },
    {
      id: 'demo-agasalho',
      name: 'Campanha do Agasalho',
      image: { uri: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=60' },
      descricao:
        'Arrecadação de roupas, cobertores e calçados para pessoas em situação de vulnerabilidade durante períodos frios. Doe peças limpas e em bom estado e ajude a aquecer quem mais precisa. (Exemplo demonstrativo no app).',
    },
    {
      id: 'demo-alimentos',
      name: 'Arrecadação de Alimentos',
      image: { uri: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1200&q=60' },
      descricao:
        'Coleta de cestas básicas e itens essenciais (arroz, feijão, leite, óleo, higiene) para famílias em insegurança alimentar. Sua contribuição impacta diretamente a rotina de quem está passando necessidade. (Exemplo demonstrativo no app).',
    },
    {
      id: 'demo-brinquedos',
      name: 'Doe Brinquedos',
      image: { uri: 'https://images.unsplash.com/photo-1587651288886-35d3d1d9c5d7?auto=format&fit=crop&w=1200&q=60' },
      descricao:
        'Campanha para arrecadar brinquedos e materiais educativos para crianças de comunidades vulneráveis. Itens simples podem transformar o dia e estimular o aprendizado. (Exemplo demonstrativo no app).',
    },
  ];

  const campanhasParaMostrar =  campanhasData.length > 0 ? campanhasData : demoCampanhas;

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

      <HorizontalCardList
        title="ONGs Próximas a você"
        data={ongsParaMostrar}
        onPressItem={(ong) =>
          router.push({
            pathname: '/ong/[cnpj]',
            params: {
              cnpj: ong.id,
              name: ong.name,
              descricao: ong.descricao ?? '',
              latitude: String(ong.latitude ?? ''),
              longitude: String(ong.longitude ?? ''),
              imageUri: typeof ong.image === 'object' && (ong.image as any).uri ? (ong.image as any).uri : '',
            },
          })
        }
      />

      <VerticalCardList
        title="Campanhas em andamento"
        data={campanhasParaMostrar}
        onPressItem={(item) => router.push({ pathname: '/campanha/[id]', params: { id: item.id } })}
      />
    </View>
  );
}
