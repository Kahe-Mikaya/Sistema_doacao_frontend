import { View, Text, TextInput, Pressable,Image, StyleSheet } from 'react-native';
import { useState, useEffect} from 'react';
import { styles } from './login.styles';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Forms } from '@/components/forms';
import { useRegister } from '@/contexts/RegisterContext';
import { registerSchema } from '@/schemas/registerSchema';
export default function Register() {
  const API_URL = process.env.EXPO_PUBLIC_URL_API;
  const { data, setData } = useRegister();
  const [message,setMessage] = useState('')
  const [isError,setError] = useState(false)
  const register = useRegister();
  
  const params = useLocalSearchParams();
    
   
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
            setData({foto: result.assets[0].uri});
        }
    }

    useEffect(() => {
        if (params.latitude && params.longitude) {
        setData({location:{
            latitude: Number(params.latitude),
            longitude: Number(params.longitude),
        }});
        }
    }, []);



  async function handleRegister() {
    const validation = registerSchema.safeParse(data);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;

      setError(true);
      setMessage(
        Object.values(errors)
          .flat()
          .join('\n')
      );

      return;
    }

    const formData = new FormData();
    let endpoint = "/usuario/registrar"
    formData.append('nome', data.nome);
    formData.append('email', data.email);
    formData.append('senha', data.senha);
    formData.append('telefone', data.telefone);
    

    if (data.tipo === 'PF') {
      formData.append('tipo', "false");
      formData.append('cpf', data.cpf);
    } else {
      endpoint = "/ongs/registrar";
      formData.append('cnpj', data.cnpj);
      formData.append('tipo', "true");
    }

    if (location) {
      const geolocalizacao = {
        type: 'Point',
        coordinates: [
          Number(params.longitude), 
          Number(params.latitude),
        ],
      };

      formData.append('geolocalizacao', JSON.stringify(geolocalizacao));
    }

    if (data.foto) {
      formData.append('foto', {
        uri: data.foto,
        name: 'foto.jpg',
        type: 'image/jpeg',
      } as any);
    }
    try{
      const response = await fetch(API_URL+endpoint, {
        method: 'POST',
        body: formData,
      });

      const dataApi = await response.json();
      console.log(dataApi.status);
      if(!response.ok){
        setError(true)
        setMessage("campos invalidos: "+ Object.keys(dataApi).map((value) =>{ 
          return value!="_errors"? value : ""}))
        return
      }
      setMessage("Cadastro realizado com sucesso!")
      setError(false)
      router.push('/auth/login')

  }catch(error){
      setError(true)
      setMessage("Erro na rede!")
  }
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
      
    <Forms
      list={[
        {
          type: 'image',
          value: data.foto,
          setFunction: pickImage,
          label: 'Selecionar foto',
        },

        {
          type: 'tipo',
          value: data.tipo,
          setFunction: (v) => setData({ tipo: v }),
          label: 'Tipo',
        },
        data.tipo === 'PF'
          ? {
              type: 'text',
              value: data.cpf,
              setFunction: (v) => setData({ cpf: v }),
              label: 'CPF',
            }
          : {
              type: 'text',
              value: data.cnpj,
              setFunction: (v) => setData({ cnpj: v }),
              label: 'CNPJ',
            },
        {
          type: 'text',
          value: data.nome,
          setFunction: (v) => setData({ nome: v }),
          label: data.tipo == "PF"? "Nome":'Nome da ONG',
        },
        {
          type: 'text',
          value: data.email,
          setFunction: (v) => setData({ email: v }),
          label: 'Email',
        },
        {
          type: 'password',
          value: data.senha,
          setFunction: (v) => setData({ senha: v }),
          label: 'Senha',
        },
        {
          type: 'text',
          value: data.telefone,
          setFunction: (v) => setData({ telefone: v }),
          label: 'Telefone',
        },
        {
          type: 'geoLocalization',
          setFunction: () => router.push('/auth/mappicker'),
        },
        
        
      ]}
    />
      
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/auth/login')}>
              <Text style={styles.textCadatro}>
                Ja possui uma conta? login
              </Text>
        </Pressable>
      {message && <Text style={{color: isError ? "red": "green"}}>{message}</Text>}
    </View>
  );
}
