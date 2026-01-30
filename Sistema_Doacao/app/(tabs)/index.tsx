import { Pressable, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { CustomTopTabs } from '@/components/customTab/customTopTab';

export default function App() {

  const { isAuthenticated, userType, token,login ,logout} = useAuth();
  const urlApi = process.env.EXPO_PUBLIC_URL_API
  const [UserData,setUserData] = useState()
  const [urlProfile,setUrlProfile] = useState("../../assets/image/UserAnonimo.png")

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
        const apiData = await response.json()
        setUserData(apiData)
        if(apiData.foto){
          setUrlProfile(urlApi+'/uploads/ong/'+apiData.foto)
        }
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
    <>
        <View style={{flex: 1 , backgroundColor: "white" }}>
        <CustomTopTabs userData={UserData} logout={logout} profileIconUrl={UserData && UserData.foto? {uri: urlProfile}: require("../../assets/images/UserAnonimo.png")} homeIconUrl={require("../../assets/images/home.png")} >            
        </CustomTopTabs>
        </View>
  
    </>
  );
}
