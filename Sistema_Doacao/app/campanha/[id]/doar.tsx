import { View, Text, TextInput, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState, useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { TopMenuBar } from '@/components/TopMenuBar';

type Campanha = {
  id: string;
  nome: string;
  descricao: string;
  foto?: string;
  cnpjOng?: string | null;
};

const DEMO_NAMES: Record<string, string> = {
  'demo-crianca-esperanca': 'Criança Esperança',
  'demo-agasalho': 'Campanha do Agasalho',
  'demo-alimentos': 'Arrecadação de Alimentos',
};

export default function DoarParaCampanha() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token, login, logout, userType } = useAuth();
  const urlApi = process.env.EXPO_PUBLIC_URL_API;

  const [loading, setLoading] = useState(true);
  const [campanha, setCampanha] = useState<Campanha | null>(null);

  const [tipo, setTipo] = useState('Roupas');
  const [quantidade, setQuantidade] = useState('1');
  const [descricao, setDescricao] = useState('');

  const profileIcon = useMemo(() => require('../../../assets/images/UserAnonimo.png'), []);

  async function load() {
    if (!id) return;

    if (String(id).startsWith('demo-')) {
      setCampanha({
        id: String(id),
        nome: DEMO_NAMES[String(id)] ?? 'Campanha',
        descricao: '',
        cnpjOng: null,
      });
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
      setLoading(false);
    } catch (e) {
      console.log('Erro ao carregar campanha', e);
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function enviarDoacao() {
    if (!descricao.trim()) {
      Alert.alert('Preencha a descrição', 'Descreva os itens que você quer doar.');
      return;
    }

    const qtd = Number(quantidade);
    if (!Number.isFinite(qtd) || qtd <= 0) {
      Alert.alert('Quantidade inválida', 'Informe uma quantidade válida (ex.: 1, 2, 3).');
      return;
    }

    if (userType !== 'PF') {
      Alert.alert('Apenas usuário pode doar', 'Faça login como usuário (PF) para registrar uma doação.');
      return;
    }

    const payload = {
      datadoacao: new Date().toISOString(),
      quantidade: qtd,
      tipo: `${tipo} - ${descricao}`,
      email: login,
      cnpj: campanha?.cnpjOng ?? null,
      IDcampanha: String(id),
    };

    try {
      const resp = await fetch(urlApi + '/doacao/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const err = await resp.text();
        console.log('Erro API doação:', err);
        Alert.alert('Erro ao doar', 'Não foi possível registrar sua doação. Veja o console do backend.');
        return;
      }

      Alert.alert('Doação registrada!', 'Obrigado por contribuir ❤️', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      console.log('Erro ao enviar doação', e);
      Alert.alert('Erro de conexão', 'Verifique sua URL da API e se o backend está rodando.');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <TopMenuBar homeIconUrl={require('../../../assets/images/home.png')} profileIconUrl={profileIcon} onLogout={logout} />

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#125f0c', marginBottom: 8 }}>
            Doar para: {campanha?.nome ?? 'Campanha'}
          </Text>

          <View style={{ backgroundColor: '#c4ecc1', borderRadius: 18, padding: 14, gap: 10 }}>
            <Text style={{ fontWeight: '700', color: '#036134' }}>Tipo da doação</Text>
            <TextInput
              value={tipo}
              onChangeText={setTipo}
              placeholder="Ex.: Roupas, Alimentos, Brinquedos..."
              style={{ backgroundColor: 'white', borderRadius: 12, padding: 12 }}
            />

            <Text style={{ fontWeight: '700', color: '#036134' }}>Quantidade</Text>
            <TextInput
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="numeric"
              placeholder="Ex.: 1"
              style={{ backgroundColor: 'white', borderRadius: 12, padding: 12 }}
            />

            <Text style={{ fontWeight: '700', color: '#036134' }}>Descrição dos itens</Text>
            <TextInput
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Ex.: 3 camisas, 2 calças, 1 par de sapatos..."
              multiline
              style={{ backgroundColor: 'white', borderRadius: 12, padding: 12, minHeight: 90, textAlignVertical: 'top' }}
            />

            <Pressable
              onPress={enviarDoacao}
              style={{
                marginTop: 8,
                backgroundColor: '#125f0c',
                paddingVertical: 12,
                borderRadius: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: '800' }}>Confirmar doação</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
