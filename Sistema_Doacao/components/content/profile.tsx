import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
  ScrollView,
} from 'react-native';

type ProfileContentProps = {
  UserData: Record<string, any>;
  userProfile: any;
  getUserdate: ()=> void,
};

export function ProfileContent({ UserData, userProfile, getUserdate }: ProfileContentProps) {
    const [editableData, setEditableData] = useState({
    ...UserData,
    foto: null,
    senha: null
    });
    const [loading, setLoading] = useState(false);

    const {token,userType, login} = useAuth();
    const TOKEN = token;
    const urlApi = process.env.EXPO_PUBLIC_URL_API
    
    async function handleSelectPhoto() {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permissão necessária', 'Permita acesso à galeria');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled) return;
        const uri = result.assets[0].uri;
        setEditableData(prev => ({
            ...prev,
            foto: uri,
        }));

        const formData = new FormData();

        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('foto', {
            uri,
            name: filename,
            type,
        } as any);

        const baseRoute = userType == "PF"? "/usuario/"+login : "/ongs/"+login
        try {
            const response = await fetch(
            `${urlApi}${baseRoute}/foto`,
            {
                method: 'PATCH',
                headers: {
                Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
            );

            if (!response.ok) {
            throw new Error('Erro ao atualizar foto');
            }

            Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
            getUserdate()
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível atualizar a foto');
        }
     }

  

  function updateField(key: string, value: string) {
    setEditableData(prev => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleUpdate() {
    try {
        const endpoint  = userType == "PF"? "/usuario/"+login : "/ongs/"+login
        const formData = new FormData();

        const jsonData: any = {};
        let body: any;
        let headers: any = {
        Authorization: `Bearer ${token}`,
        };

        Object.keys(editableData).forEach((key) => {
            if (key !== 'foto' && key !== 'senha' && editableData[key] !== null) {
            jsonData[key] = editableData[key];
            }
        });

        body = JSON.stringify(jsonData);
        headers['Content-Type'] = 'application/json';

        const response = await fetch(urlApi + endpoint, {
            method: 'PUT',
            headers,
            body,
            });

        if (!response.ok) {
            throw new Error('Erro ao atualizar');
        }

        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        getUserdate();
        } catch (error) {
            console.error(error);
        Alert.alert('Erro', 'Não foi possível atualizar o perfil');
        }
    }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        paddingTop: 30,
        gap: 16,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Pressable onPress={handleSelectPhoto} style={{ alignItems: 'center', gap: 8 }}>
            <Image
                source={
                editableData.foto
                    ? { uri: editableData.foto }
                    : userProfile
                }
                style={{
                height: 150,
                width: 150,
                borderRadius: 100,
                borderWidth: 3,
                borderColor: '#036134',
                }}
            />

            <Text style={{ color: '#1e90ff', fontWeight: 'bold' }}>
                Alterar foto
            </Text>
        </Pressable>
      </View>

    <View style={{width: "100%",display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems : "center"}}>
        <Text
            style={{
            
            fontSize: 22,
            fontWeight: '300',
            color: '#036134',
            marginTop: 10,
            }}
        >
            Dados Pessoais
        </Text>
        <Pressable
            onPress={handleUpdate}
            disabled={loading}
            style={{
            marginTop: 20,
            backgroundColor: '#036134',
            paddingVertical: 10,
            padding: 10,
            borderRadius: 60,
            alignItems: 'center',
            opacity: loading ? 0.7 : 1,
            }}
        >
    
        <Text
          style={{
            color: '#fff',
            fontSize: 10,
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </Text>
      </Pressable>
      </View>

      {Object.keys(editableData).map((key) => {
        if (
          !editableData[key] ||
          key === 'senha' ||
          key === 'foto' ||
          key === 'tipo' ||
          key === 'latitude' ||
          key === 'longitude'
        ) {
          return null;
        }

        return (
          <View
            key={key}
            style={{
              flexDirection: 'column',
              width: '100%',
              gap: 6,
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: '#036134',
              }}
            >
              {key}
            </Text>

            <TextInput
              value={String(editableData[key])}
              onChangeText={(text) => updateField(key, text)}
              style={{
                padding: 10,
                fontSize: 15,
                borderWidth: 1,
                borderColor: 'rgba(19,114,43,0.3)',
                borderRadius: 10,
                backgroundColor: 'rgba(44,255,96,0.15)',
              }}
            />
          </View>
        );
      })}

      
    </ScrollView>
  );
}
