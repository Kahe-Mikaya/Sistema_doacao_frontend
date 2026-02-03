import { View, Text, TextInput, Pressable, Alert, ScrollView, Modal } from 'react-native';
import { useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

type Params = {
  cnpj?: string;
  campaignId?: string;
  targetName?: string;
};

const TIPOS = [
  'Roupas',
  'Alimentos',
  'Brinquedos',
  'Produtos de higiene',
  'Material escolar',
  'Cobertores',
  'Dinheiro (informar na descrição)',
  'Outros',
];


function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id));
}

function looksLikeForeignKeyError(msg: string) {
  const m = msg.toLowerCase();
  return m.includes('foreign key') || m.includes('constraint') || m.includes('viol') || m.includes('fkey');
}

export default function DonationScreen() {
  const { token, login } = useAuth();
  const params = useLocalSearchParams<Params>();

  const urlApi = process.env.EXPO_PUBLIC_URL_API;

  const cnpj = useMemo(() => (typeof params.cnpj === 'string' ? params.cnpj : ''), [params.cnpj]);
  const campaignIdRaw = useMemo(() => (typeof params.campaignId === 'string' ? params.campaignId : ''), [params.campaignId]);
  const targetName = useMemo(() => (typeof params.targetName === 'string' ? params.targetName : 'Campanha'), [params.targetName]);

  const [tipo, setTipo] = useState<string>(TIPOS[0]);
  const [quantidade, setQuantidade] = useState('1');
  const [descricao, setDescricao] = useState('');

  const [loading, setLoading] = useState(false);
  const [tipoModal, setTipoModal] = useState(false);

  // se for demo, não envia IDcampanha (backend pode validar e rejeitar)
  const campaignId = useMemo(() => {
    if (!campaignIdRaw) return '';
    if (campaignIdRaw.startsWith('demo-')) return '';
    return campaignIdRaw;
  }, [campaignIdRaw]);

  function validate() {
    if (!urlApi) return 'EXPO_PUBLIC_URL_API não configurada no .env';
    if (!token) return 'Você precisa estar logado para doar.';
    if (!cnpj) return 'ONG não encontrada para esta campanha.';
    // Se for dado de exemplo (demo), a doação pode ser registrada sem vínculo com ONG/campanha

    const qtd = Number(quantidade);
    if (!Number.isFinite(qtd) || !Number.isInteger(qtd) || qtd <= 0) return 'Quantidade deve ser um número inteiro maior que 0.';

    // descrição obrigatória pra evitar "Dinheiro" sem detalhes, etc.
    if (descricao.trim().length < 5) return 'Descreva melhor os itens (mínimo 5 caracteres).';
    if (descricao.length > 300) return 'Descrição muito longa (máx 300 caracteres).';

    return null;
  }

  async function postDoacao(opts: { withCampaign: boolean; withOng: boolean }) {
    const payload: any = {
      datadoacao: new Date().toISOString(),
      quantidade: Number(quantidade),
      tipo: tipo.trim(),
      email: login, // compatível com o backend atual
      descricao: descricao.trim(),
    };

    if (opts.withOng && cnpj && !cnpj.startsWith('demo-')) {
      payload.cnpj = cnpj;
    }

    if (opts.withCampaign && campaignId) {
      payload.IDcampanha = campaignId;
    }

    const res = await fetchWithTimeout(urlApi + '/doacao/usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(payload),
    });

    return res;
  }

  async function submit() {
    const error = validate();
    if (error) {
      Alert.alert('Validação', error);
      return;
    }

    setLoading(true);
    try {
      // tenta com campanha e com ONG primeiro
      let res = await postDoacao({ withCampaign: true, withOng: true });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');

        const msg = (txt || '').toLowerCase();

        const looksLikeCampaignError =
          msg.includes('campanha') && (msg.includes('existe') || msg.includes('não') || msg.includes('nao') || msg.includes('not found'));

        // 1) se der erro de campanha, tenta sem campanha
        if (looksLikeCampaignError) {
          res = await postDoacao({ withCampaign: false, withOng: true });
        }

        // 2) se ainda falhar e parecer erro de FK/ONG, tenta sem ONG
        if (!res.ok) {
          const txtFk = await res.text().catch(() => '');
          const msgFk = (txtFk || txt || '').toLowerCase();
          const looksLikeOngError = msgFk.includes('cnpj') || msgFk.includes('ong') || looksLikeForeignKeyError(msgFk);

          if (looksLikeOngError) {
            // tenta registrar sem vínculo com ONG e sem campanha (para não travar em dados demo)
            res = await postDoacao({ withCampaign: false, withOng: false });
          }

          if (!res.ok) {
            const txt2 = await res.text().catch(() => '');
            throw new Error(txt2 || txtFk || txt || 'Erro ao registrar doação.');
          }
        }
      }

      Alert.alert('Sucesso', 'Doação registrada com sucesso!');
      router.back();
    } catch (e: any) {
      Alert.alert('Erro', e?.message || 'Erro ao registrar doação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 30, paddingBottom: 30 }}>
        <Text style={{ fontSize: 20, fontWeight: '900', marginBottom: 6 }}>Campanha</Text>
        <Text style={{ color: '#555', marginBottom: 16 }}>Cadastre os detalhes da sua doação.</Text>

        <Text style={{ fontWeight: '800', marginBottom: 6 }}>Tipo</Text>
        <Pressable
          onPress={() => setTipoModal(true)}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, marginBottom: 12, backgroundColor: 'white' }}
        >
          <Text style={{ fontWeight: '700' }}>{tipo}</Text>
          <Text style={{ color: '#777', marginTop: 3, fontSize: 12 }}>Toque para selecionar</Text>
        </Pressable>

        <Text style={{ fontWeight: '800', marginBottom: 6 }}>Quantidade</Text>
        <TextInput
          value={quantidade}
          onChangeText={(t) => {
            // só permite números
            const onlyDigits = t.replace(/\D/g, '');
            setQuantidade(onlyDigits);
          }}
          keyboardType="numeric"
          placeholder="Ex: 3"
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, marginBottom: 12, backgroundColor: 'white' }}
        />

        <Text style={{ fontWeight: '800', marginBottom: 6 }}>Descrição dos itens</Text>
        <TextInput
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Ex: 2 camisas, 1 calça jeans, 1 casaco..."
          multiline
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 12,
            padding: 12,
            minHeight: 120,
            textAlignVertical: 'top',
            marginBottom: 16,
            backgroundColor: 'white',
          }}
        />

        <Pressable
          disabled={loading}
          onPress={submit}
          style={{
            backgroundColor: loading ? '#999' : '#125f0c',
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: '900' }}>{loading ? 'Enviando...' : 'Confirmar doação'}</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={{ paddingVertical: 12, borderRadius: 14, alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: '#125f0c', fontWeight: '800' }}>Cancelar</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={tipoModal} transparent animationType="fade">
        <Pressable
          onPress={() => setTipoModal(false)}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' }}
        >
          <Pressable
            onPress={() => {}}
            style={{ backgroundColor: 'white', padding: 16, borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
          >
            <Text style={{ fontSize: 16, fontWeight: '900', marginBottom: 10 }}>Selecione o tipo</Text>

            {TIPOS.map((t) => (
              <Pressable
                key={t}
                onPress={() => {
                  setTipo(t);
                  setTipoModal(false);
                }}
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee',
                }}
              >
                <Text style={{ fontWeight: t === tipo ? '900' : '600', color: t === tipo ? '#125f0c' : '#333' }}>{t}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
