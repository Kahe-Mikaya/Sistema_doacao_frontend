import { View, Text, Pressable, Image, Alert, ScrollView, StyleSheet, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { styles } from './login.styles';
import { router, Redirect, usePathname } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Forms } from '@/components/forms';
import { useAuth } from '@/contexts/AuthContext';
import { useRegister } from '@/contexts/RegisterContext';
import MapView, { Marker } from 'react-native-maps';

// O backend agora gera o ID automaticamente e aceita latitude/longitude separadas.

const INITIAL_LOCATION = {
    latitude: -6.891931027755727,
    longitude: -38.56002467222115,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
};

export default function RegisterCampanha() {
    const API_URL = process.env.EXPO_PUBLIC_URL_API;
    const { userType, isAuthenticated, token, login } = useAuth();
    const { data, setData } = useRegister();
    const [message, setMessage] = useState('');
    const [isError, setError] = useState(false);

    // Controles do Mapa Interno
    const [showMap, setShowMap] = useState(false);
    const [tempMarker, setTempMarker] = useState<{ latitude: number, longitude: number } | null>(null);

    // Setup Inicial
    useEffect(() => {
        // Limpa dados ao entrar
        setData({
            descricao: '',
            foto: null,
            location: null,
            nome: '', email: '', senha: '', telefone: '', cpf: '', cnpj: ''
        });
    }, []);

    const pathname = usePathname();

    // Bloqueio de Acesso
    useEffect(() => {
        if (isAuthenticated && userType !== 'PJ' && pathname.includes('registerCampanha')) {
            Alert.alert(
                'Acesso Negado',
                'Apenas ONGs (Pessoa Jurídica) podem cadastrar campanhas.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        }
    }, [isAuthenticated, userType, pathname]);

    async function pickImage() {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            alert('Permissão para acessar a galeria é necessária');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setData({ foto: result.assets[0].uri });
        }
    }

    function confirmLocation() {
        if (tempMarker) {
            setData({
                location: {
                    latitude: tempMarker.latitude,
                    longitude: tempMarker.longitude
                }
            });
            setShowMap(false);
        } else {
            Alert.alert("Atenção", "Selecione um ponto no mapa.");
        }
    }

    async function handleRegister() {
        const formData = new FormData();
        const endpoint = "/campanha/registar";

        if (!data.descricao) {
            setError(true);
            setMessage("A descrição é obrigatória!");
            return;
        }

        formData.append('descricao', data.descricao);
        // O ID agora é gerado automaticamente pelo backend ✅

        if (login) {
            formData.append('cnpjOng', login); // CNPJ da ONG logada
        }

        if (data.location) {
            formData.append('latitude', data.location.latitude.toString());
            formData.append('longitude', data.location.longitude.toString());
        }

        if (data.foto) {
            formData.append('foto', {
                uri: data.foto,
                name: 'campanha.jpg',
                type: 'image/jpeg',
            } as any);
        }
        if(data.nome){
            formData.append('nome', data.nome)
        }
        // Debug: Ver o que está sendo enviado
        console.log("=== Dados enviados para o backend ===");
        console.log("Descrição:", data.descricao);
        console.log("CNPJ ONG:", login);
        console.log("Latitude:", data.location?.latitude);
        console.log("Longitude:", data.location?.longitude);
        console.log("=====================================");

        try {
            const response = await fetch(API_URL + endpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const dataApi = await response.json();
            console.log("Resposta do Backend:", dataApi); // <-- Debug

            if (!response.ok) {
                setError(true);
                const invalidFields = Object.keys(dataApi)
                    .filter(key => key !== "_errors")
                    .join(', ');
                setMessage("Campos inválidos: " + invalidFields);
                return;
            }

            setMessage("Campanha cadastrada com sucesso!");
            setError(false);

            // Limpeza final
            setData({ descricao: '', foto: null, location: null });

            setTimeout(() => {
                router.push('/(tabs)');
            }, 2000);

        } catch (error) {
            setError(true);
            setMessage("Erro na rede!");
        }
    }

    if (!isAuthenticated) return <Redirect href="/auth/login" />;

    if (userType !== 'PJ') {
        return (
            <View style={[styles.containerRegister, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 18, color: 'red', textAlign: 'center' }}>Acesso Negado</Text>
                <Pressable onPress={() => router.back()}><Text>Voltar</Text></Pressable>
            </View>
        );
    }

    if (showMap) {
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    initialRegion={INITIAL_LOCATION}
                    style={{ flex: 1 }}
                    onPress={(event) => setTempMarker(event.nativeEvent.coordinate)}
                >
                    {tempMarker && <Marker coordinate={tempMarker} />}
                </MapView>

                <View style={mapStyles.buttonContainer}>
                    <Pressable style={[mapStyles.button, { backgroundColor: '#d9534f', marginRight: 10 }]} onPress={() => setShowMap(false)}>
                        <Text style={mapStyles.buttonText}>Cancelar</Text>
                    </Pressable>
                    <Pressable style={mapStyles.button} onPress={confirmLocation}>
                        <Text style={mapStyles.buttonText}>Confirmar</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (

           

            <View style={styles.containerRegister}>
                 <Image
                    source={require('../../assets/images/partial_bottomCircle.png')}
                    style={styles.partialBottomCircle}
                    resizeMode="contain"
                />
                  <Image
                    source={require('../../assets/images/partial_TopCircle.png')}
                    style={styles.partialTopCircle}
                    resizeMode="contain"
                />
                
              
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#125f0c', marginBottom: 20, textAlign: 'center' }}>
                    Cadastrar Nova Campanha
                </Text>
                <View style={{marginTop: 30,display: "flex", gap: 10, width: "100%", alignItems: "center"}}>
                <Forms
                    list={[
                        {
                            type: 'image',
                            value: data.foto || undefined,
                            setFunction: pickImage,
                        },
                        {
                            type: 'text',
                            value: data.nome,
                            setFunction: (v) => setData({ nome: v }),
                            label: 'Nome',
                        },
                        {
                            type: 'desc',
                            value: data.descricao,
                            setFunction: (v) => setData({ descricao: v }),
                            label: 'Descrição da Campanha',
                        },
                        {
                            type: 'geoLocalization',
                            setFunction: () => setShowMap(true), // Abre o mapa interno
                        },
                    ]}
                />
                </View>

                {data.location && (
                    <Text style={{ textAlign: 'center', color: '#1e90ff', marginBottom: 10 }}>
                        📍 Localização selecionada!
                    </Text>
                )}

                <Pressable style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Cadastrar Campanha</Text>
                </Pressable>

                <Pressable onPress={() => router.back()}>
                    <Text style={styles.textCadatro}>Voltar</Text>
                </Pressable>

                {message && (
                    <Text style={{
                        color: isError ? "red" : "green",
                        textAlign: 'center',
                        marginTop: 10,
                        fontWeight: 'bold'
                    }}>
                        {message}
                    </Text>
                )}
            </View>

    );
}

const mapStyles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        bottom: 30,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    button: {
        backgroundColor: '#2FC224',
        padding: 14,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
