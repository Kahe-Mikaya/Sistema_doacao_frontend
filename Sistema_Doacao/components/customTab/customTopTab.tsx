import { useState } from 'react';
import { View, Pressable, Text, Image, ImageSourcePropType } from 'react-native';
import { HomeContent } from '../content/home';
import { ProfileContent } from '../content/profile';

export function CustomTopTabs({homeIconUrl, profileIconUrl, logout, userData, getUserData}:{homeIconUrl: ImageSourcePropType, profileIconUrl: ImageSourcePropType, logout: ()=> void,userData: any, getUserData: ()=> void }) {
  const [activeTab, setActiveTab] = useState<'home' | 'explore'>('home');
  return (
    <>
      <View style={{ padding: 10, flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', height: 100, width: "100%", backgroundColor: '#c4ecc1',paddingTop: 30}}>
        <Pressable onPress={() => setActiveTab('home')}>
          <Image style={{height: 40, width: 40}} source={homeIconUrl}></Image>
        </Pressable>
         <Image
                source={require('../../assets/images/logo.png')}
                style={{marginLeft: 35,height: 200, width: 200}}
                resizeMode="contain"
              />
        
        <View style={{display: "flex", flexDirection: "row"}}>
            <Pressable onPress={() => setActiveTab('explore')}>
                <Image style={{height: 40, width: 40, borderRadius: 100, borderWidth: 2,borderColor: "#036134"}} source={profileIconUrl}></Image>
            </Pressable>
            <Pressable onPress={() => logout()}>
                <Image  style={{height: 40, width: 40, borderRadius: 100}} source={require("../../assets/images/logout.png")}></Image>
            </Pressable>
        </View>
        
      </View>

      {activeTab === 'home' && <HomeContent />}
      {activeTab === 'explore' && <ProfileContent getUserdate={getUserData} UserData={userData} userProfile={profileIconUrl}/>}
    </>
  );
}
