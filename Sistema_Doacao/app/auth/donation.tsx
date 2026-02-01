
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function DonationScreen() {
    const { cnpj, campaignId, targetName } = useLocalSearchParams();
    const { token, login, isAuthenticated, userType } = useAuth();
    const API_URL = process.env.EXPO_PUBLIC_URL_API;

    const [quantidade, setQuantidade] = useState('');
    const [tipo, setTipo] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDonation = async () => {
        if (!isAuthenticated) {
            Alert.alert('Erro', 'Você precisa estar logado para doar.');
            return;
        }

        if (userType === 'PJ') {
            Alert.alert('Aviso', 'No momento, apenas doadores físicos podem realizar doações pelo app.');
            return;
        }

        if (!quantidade || !tipo) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);

        const donationData = {
            datadoacao: new Date().toISOString(),
            quantidade: Number(quantidade),
            tipo: tipo,
            email: login?.toLowerCase(), // O email do doador (PF)
            cnpj: cnpj || null,         // ONG que recebe
            IDcampanha: campaignId || null, // Campanha que recebe
        };

        // DEBUG CRUCIAL:
        console.log("=== TENTATIVA DE DOAÇÃO (PF) ===");
        console.log("DADOS:", JSON.stringify(donationData, null, 2));

        try {
            const response = await fetch(`${API_URL}/doacao/usuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(donationData),
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Sucesso', 'Obrigado por sua doação!', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            } else {
                console.error('Erro na doação:', result);
                Alert.alert('Erro', result.message || 'Não foi possível realizar a doação.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            Alert.alert('Erro', 'Erro de conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Nova Doação</Text>
                <Text style={styles.subtitle}>Para: {targetName}</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Quantidade / Valor</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: 50, 10kg, 5 peças..."
                        value={quantidade}
                        onChangeText={setQuantidade}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>O que você está doando?</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Dinheiro, Alimento, Roupas..."
                        value={tipo}
                        onChangeText={setTipo}
                    />
                </View>

                <Pressable
                    onPress={handleDonation}
                    style={[styles.button, loading && styles.buttonDisabled]}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Processando...' : 'Confirmar Doação'}
                    </Text>
                </Pressable>

                <Pressable onPress={() => router.back()} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Voltar</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#125f0c',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#125f0c',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
    },
});
