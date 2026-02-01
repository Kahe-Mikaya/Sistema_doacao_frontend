import { View, Pressable, Text, ImageSourcePropType } from 'react-native';
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
    foto: ImageSourcePropType;
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
                    name: item.descricao || "Nova Campanha", // Pega o nome real se existir
                    descricao: item.nome || "Sem descrição disponível",
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

    useEffect(() => {
        getOngs()
        getCampanhas()
    }, [])
    const data = [
        {
            id: '1',
            name: 'ONG Você no Jogo',
            image: require("../../assets/images/ong.png"),
            descricao: "Criança Esperança é uma campanha nacional de mobilização social que busca a conscientização em prol dos direitos da criança e do adolescente, promovida pela TV Globo, em parceria com a UNICEF entre 1986 e 2003, e desde 2004 com a UNESCO. O projeto é uma das mais bem-sucedidas marcas relacionadas a programas sociais dirigidos às crianças carentes em todo o mundo. Anualmente, são realizados os shows que incentivam as doações feitas pelos telespectadores e por várias instituições."
        },
        {
            id: '2',
            name: 'ONG Mais Saber',
            image: require("../../assets/images/ong.png"),
            descricao: "Criança Esperança é uma campanha nacional de mobilização social que busca a conscientização em prol dos direitos da criança e do adolescente, promovida pela TV Globo, em parceria com a UNICEF entre 1986 e 2003, e desde 2004 com a UNESCO. O projeto é uma das mais bem-sucedidas marcas relacionadas a programas sociais dirigidos às crianças carentes em todo o mundo. Anualmente, são realizados os shows que incentivam as doações feitas pelos telespectadores e por várias instituições."
        },
        {
            id: '3',
            name: 'ONG Mais Saber',
            image: require("../../assets/images/ong.png"),
            descricao: "Criança Esperança é uma campanha nacional de mobilização social que busca a conscientização em prol dos direitos da criança e do adolescente, promovida pela TV Globo, em parceria com a UNICEF entre 1986 e 2003, e desde 2004 com a UNESCO. O projeto é uma das mais bem-sucedidas marcas relacionadas a programas sociais dirigidos às crianças carentes em todo o mundo. Anualmente, são realizados os shows que incentivam as doações feitas pelos telespectadores e por várias instituições."
        },
        {
            id: '4',
            name: 'ONG Mais Saber',
            image: require("../../assets/images/ong.png"),
            descricao: "Criança Esperança é uma campanha nacional de mobilização social que busca a conscientização em prol dos direitos da criança e do adolescente, promovida pela TV Globo, em parceria com a UNICEF entre 1986 e 2003, e desde 2004 com a UNESCO. O projeto é uma das mais bem-sucedidas marcas relacionadas a programas sociais dirigidos às crianças carentes em todo o mundo. Anualmente, são realizados os shows que incentivam as doações feitas pelos telespectadores e por várias instituições."
        },
        {
            id: '5',
            name: 'ONG Mais Saber',
            image: require("../../assets/images/ong.png"),
            descricao: "Criança Esperança é uma campanha nacional de mobilização social que busca a conscientização em prol dos direitos da criança e do adolescente, promovida pela TV Globo, em parceria com a UNICEF entre 1986 e 2003, e desde 2004 com a UNESCO. O projeto é uma das mais bem-sucedidas marcas relacionadas a programas sociais dirigidos às crianças carentes em todo o mundo. Anualmente, são realizados os shows que incentivam as doações feitas pelos telespectadores e por várias instituições."
        },
    ]

    return (
        <View style={{ flex: 1, padding: 20, paddingTop: 30, }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: "#125f0c" }}>
                    Seja bem vindo !
                </Text>

                {userType === 'PJ' && (
                    <Pressable
                        onPress={() => router.push('/auth/registerCampanha')}
                        style={{
                            backgroundColor: "#125f0c",
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
                        <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>
                            + Campanha
                        </Text>
                    </Pressable>
                )}
            </View>

            <HorizontalCardList
                title="ONGs Próximas a você"
                data={ongsData}
            >

            </HorizontalCardList>
            <VerticalCardList
                title="Campanhas em andamento"
                data={[...data, ...campanhasData]}
            />
        </View>
    )
}