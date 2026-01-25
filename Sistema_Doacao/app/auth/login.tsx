import { View, Text, TextInput, Pressable,Image, StyleSheet } from 'react-native';
import { useState } from 'react';
import { styles } from './login.styles';
import { router } from 'expo-router';
import { Forms } from '@/components/forms';
import { saveToken } from '@/service/authStorage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cnpj,setCnpj]= useState("");
  const [tipo,setTipo] = useState('PF')
  const [message,setMessage] = useState('')
  const [isError,setError] = useState(false)
  const API_URL = process.env.EXPO_PUBLIC_URL_API

  async function handleLogin() {
   try {
    const endpoint = tipo == "PF"?  "/usuario/login": "/ongs/login";

    const formData = new FormData();
    formData.append("email", email);
    formData.append("senha", senha);

    console.log("api", API_URL + endpoint);

    const response = await fetch(API_URL + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tipo == "PF"?{
        email,
        senha
      }:{
        cnpj,
        senha
      } ),
    });

    const dataApi = await response.json();
    
    if (!response.ok) {
      setError(true)
      setMessage(dataApi)
      console.log("Erro:", dataApi);
      return;
    }
    setError(false)
    setMessage("Login realizado com sucesso!")
    await saveToken(dataApi)
    router.push('/(tabs)');

    console.log("Login OK:", dataApi);
  } catch (error) {
    setError(true)
    setMessage("Erro de rede")
    console.log("Erro de rede:", error);
  }
}

  return (
    <View style={styles.container}>
      
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
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={{marginTop: 80}}>
        <Forms list={[
          {type : "tipo", value: tipo, setFunction: setTipo, label: "Tipo" },
          tipo =="PJ"? 
            {type : "text", value: cnpj, setFunction: setCnpj, label: "CNPJ" }
            : 
            {type : "text", value: email, setFunction: setEmail, label: "Email" },
          {type : "text", value: senha, setFunction: setSenha, label: "Senha" },]}>

        </Forms>
      </View>
      
      <Pressable onPress={() => router.push('/auth/register')}>
        <Text style={styles.textCadatro}>
          Criar conta
        </Text>
      </Pressable>
      
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>
      {message && <Text style={{color: isError ? "red": "green"}}>{message}</Text>}
    </View>
  );
}
