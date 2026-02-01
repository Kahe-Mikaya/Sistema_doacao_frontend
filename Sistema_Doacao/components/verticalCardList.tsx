import { View, Text, Image, FlatList, Pressable, StyleSheet, Dimensions, ImageSourcePropType } from 'react-native';
import { styles } from './HorizontalCardList.styles';
import { useRef } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

type Item = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  descricao?: string;
  cnpj?: string;
  idCampanha?: string;
};

type Props = {
  title: string;
  data: Item[];
};

const ITEM_WIDTH = 120;
const SCREEN_WIDTH = Dimensions.get('window').width;

export function VerticalCardList({ title, data }: Props) {
  const { userType } = useAuth();
  const listRef = useRef<FlatList>(null);

  function scrollRight() {
    listRef.current?.scrollToOffset({
      offset: ITEM_WIDTH * 2,
      animated: true,
    });
  }

  function handleDonate(item: Item) {
    router.push({
      pathname: '/auth/donation',
      params: {
        cnpj: item.cnpj || '',
        campaignId: item.idCampanha || '',
        targetName: item.name
      }
    });
  }

  return (
    <View style={{ height: 460 }}>
      {/* Título */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Lista */}
      <View style={{ display: "flex", flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <FlatList
          ref={listRef}
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <View style={{
              width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 10,
              backgroundColor: '#c4ecc1', marginTop: 20,
              padding: 20, borderRadius: 20
            }}>
              <Image source={item.image} style={{ width: 300, height: 200, borderRadius: 20 }} />

              <Text style={{ width: 250, fontSize: 18, fontWeight: '800', textAlign: "center", color: "#036134" }}>{item.name}</Text>
              <Text style={{ width: "100%" }} numberOfLines={3}>{item.descricao}</Text>

              {userType === 'PF' && (
                <Pressable
                  onPress={() => handleDonate(item)}
                  style={{
                    backgroundColor: "#125f0c",
                    paddingVertical: 10,
                    paddingHorizontal: 30,
                    borderRadius: 25,
                    marginTop: 10
                  }}
                >
                  <Text style={{ color: "white", fontWeight: 'bold' }}>Doar para esta campanha</Text>
                </Pressable>
              )}
            </View>
          )}
        />

      </View>
    </View>
  );
}
