import { View, Pressable, Text, Image } from 'react-native';
export function ProfileContent({UserData, userProfile}){
    console.log("userdata:", UserData )
    return(
        <View style={{flex: 1, display: "flex",width: "100%", alignItems: "center", padding: 20, paddingTop: 30, gap: 10}}>
            <View style={{ display: "flex", alignItems: "center"}}> 
                <Image  style={{borderColor: "#036134", borderWidth: 3}} source={userProfile} height={150} width={150} borderRadius={100} ></Image>
                <Text style={{fontSize: 24, fontWeight: "300"}}>{UserData.nome}</Text>
            </View>
            <Text style={{width: "100%", fontSize: 22, fontWeight:300, color: "#036134"}}>
                Dados Pessoais: 
            </Text>
            {Object.keys(UserData).map(key =>
                <View key={key} style={{ display: "flex", flexDirection: "column", width: "100%", gap: 10}}>
                    { 
                     (UserData[key] && key != "senha" && key != "foto" && key != "tipo")?  
                     <>
                        <Text 
                        
                            style={{fontWeight: "bold", fontSize: 17, color: "#036134", paddingBottom: 0, margin: 0}}>
                                {key} :
                            </Text>

                        <Text 
                        style=
                            {{ padding: 10,fontWeight: 500, fontSize: 15 ,borderWidth: 1, borderBottomWidth: 1, 
                            borderColor : "rgb(19, 114, 43,0.3)", borderRadius: 10, backgroundColor: "rgb(44, 255, 96,0.2)"}}>
                                {(UserData[key])}
                        </Text>
                    </> : null
                    }
                </View>
            )}
        </View>
    )
}