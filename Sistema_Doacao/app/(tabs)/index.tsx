import { Pressable, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function App() {

  const { isAuthenticated, userType, token,login ,logout} = useAuth();
  const urlApi = process.env.EXPO_PUBLIC_URL_API

  async function getUserData(){
     if(isAuthenticated && userType){
      const endpoint = userType == "PF"? "/usuario/"+login : "/ongs/"+login
      try{
      const response = await fetch(urlApi + endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+token
          
        },     
        })
      const Userdata = await response.json()
      console.log("dados do usuario: ", Userdata)
      }catch(error){
        console.log("erro")
      }
    }
  }
  
  useEffect(()=>{
    getUserData();
  },[])

  console.log("autenticate: ",isAuthenticated)
  if (!isAuthenticated) {
    
    return <Redirect href="/auth/login" />;
  }
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{color: "white"}}>Olá, React Native 🚀</Text>
      <Pressable onPress={logout}>
        <Text style={{color: "red"}}>deslogue aqui</Text>
      </Pressable>
    </View>
  );
}
