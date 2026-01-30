import { View, Pressable, Text, ImageSourcePropType } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { HorizontalCardList } from '../horizontalCardList';
import { useEffect, useState } from 'react';
import { VerticalCardList } from '../verticalCardList';
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

export function HomeContent(){
    const [ongsData, setOngsData]= useState([])
    const { token } = useAuth();
    const urlApi = process.env.EXPO_PUBLIC_URL_API
    async function getOngs(){
    
      try{
        const response = await fetch(urlApi + "/ongs/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+token
            
          },     
          })
        const apiData = await response.json()
        if(apiData){
            const newDate = []
            apiData.forEach((element: OngApi) => {
                newDate.push({
                    avaliacoes : element.avaliacoes,
                    campanhas : element.campanhas,
                    id: element.cnpj,
                    descricao: element.descricao,
                    latitude : element.latitude,
                    longitude : element.longitude,
                    name: element.nome,
                    telefone: element.telefone,
                    doacoes: element.doacoes,
                    image: {uri: urlApi+"/uploads/ong/"+element.foto}

                })
            });
            setOngsData(newDate)
        }


        
      }catch(error){
        console.log("erro")
      }
    
  }
    useEffect(()=>{
        getOngs()
    },[])
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
    
    return(
        <View style={{ flex: 1,padding: 20, paddingTop: 30,}}>
            <Text style={{fontSize: 20, fontWeight: 700, color: "#125f0c"}}>
                Seja bem vindo !
            </Text>
            <HorizontalCardList
             title="ONGs Próximas a você"
             data={ongsData}
             >
                
            </HorizontalCardList>
            <VerticalCardList title="Campanhas em andamento"
                data={data}
            >

            </VerticalCardList>
        </View>
    )
}