import { View, Text, TextInput, Pressable, Image } from 'react-native';
import { styles } from '@/app/auth/login.styles';

type FormItem =
  | {
      type: 'text' | 'password';
      label?: string;
      value?: string;
      setFunction: (value: string) => void;
    }
  | {
      type: 'tipo';
      value: 'PF' | 'PJ';
      setFunction: (value: 'PF' | 'PJ') => void;
    }
  | {
      type: 'image';
      value?: string;
      setFunction: () => void;
    }
  | {
      type: 'geoLocalization';
      setFunction: () => void;
    };

type FormProps = {
  list: FormItem[];
};

export function Forms({ list }: FormProps) {
  return (
    <>
      {list.map((item, index) => {
        switch (item.type) {
          case "password":
            <TextInput
                key={index}
                style={styles.input}
                secureTextEntry
                placeholder={item.label}
                value={item.value}
                onChangeText={item.setFunction}
              />

          case 'text':
            return (
              <TextInput
                key={index}
                style={styles.input}
                placeholder={item.label}
                value={item.value}
                onChangeText={item.setFunction}
              />
            );

          case 'tipo':
            return (
              <View key={index}>
                <Text style={styles.label}>Tipo</Text>
                <View style={styles.row}>
                  <Pressable onPress={() => item.setFunction('PF')}>
                    <Text style={item.value === 'PF' ? styles.selected : styles.option}>
                      Pessoa Física
                    </Text>
                  </Pressable>

                  <Pressable onPress={() => item.setFunction('PJ')}>
                    <Text style={item.value === 'PJ' ? styles.selected : styles.option}>
                      Pessoa Jurídica
                    </Text>
                  </Pressable>
                </View>
              </View>
            );

          case 'image':
            return (
              <View key={index} style={{ alignItems: 'center' }}>
                <Image
                  source={
                    item.value
                      ? { uri: item.value }
                      : require('../assets/images/UserAnonimo.png')
                  }
                  style={styles.photo}
                />
                <Pressable style={styles.photoButton} onPress={item.setFunction}>
                  <Text style={{color: "#1e90ff", fontWeight: "bold"}}>Selecionar foto</Text>
                </Pressable>
              </View>
            );

          case 'geoLocalization':
            return (
             
                
                <Pressable key={index} onPress={item.setFunction} style={styles.buttonLocation}>
                    <Image style={{height: 24, width: 24}} source={require('../assets/images/location.png')}></Image>
                    
                    <Text style={{color: "#1e90ff", fontWeight: "bold"}} >Selecionar localização</Text>
                </Pressable>

            );

          default:
            return null;
        }
      })}
    </>
  );
}
