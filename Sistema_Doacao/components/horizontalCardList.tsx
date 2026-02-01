import { View, Text, Image, FlatList, Pressable, StyleSheet, Dimensions, ImageSourcePropType } from 'react-native';
import { styles } from './HorizontalCardList.styles';
import { useRef } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

type Item = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  cnpj?: string;
};

type Props = {
  title: string;
  data: Item[];
};

const ITEM_WIDTH = 120;
const SCREEN_WIDTH = Dimensions.get('window').width;

export function HorizontalCardList({ title, data }: Props) {
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
        targetName: item.name
      }
    });
  }

  return (
    <View style={styles.container}>
      {/* Título */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        {/* Seta */}
        <Pressable onPress={scrollRight}>
          <Image style={{ height: 20, width: 20 }} source={require("../assets/images/arrowRight.png")}></Image>
        </Pressable>
      </View>

      {/* Lista */}
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <FlatList
          ref={listRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => userType === 'PF' && handleDonate(item)}
              style={styles.card}
            >
              <Image source={item.image} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
              {userType === 'PF' && (
                <Text style={{ fontSize: 10, color: '#125f0c', fontWeight: 'bold', marginTop: 5 }}>Clique p/ Doar</Text>
              )}
            </Pressable>
          )}
        />

      </View>
    </View>
  );
}
