import { View, Text, FlatList, Pressable, Dimensions, ImageSourcePropType } from 'react-native';
import { SafeImage } from './SafeImage';
import { styles } from './HorizontalCardList.styles';
import { useRef } from 'react';

type Item = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  descricao?: string;
};

type Props = {
  title: string;
  data: Item[];
  onPressItem?: (item: Item) => void;
};

const ITEM_WIDTH = 120;
const SCREEN_WIDTH = Dimensions.get('window').width;

export function VerticalCardList({ title, data, onPressItem }: Props) {
  const listRef = useRef<FlatList>(null);

  function scrollRight() {
    listRef.current?.scrollToOffset({
      offset: ITEM_WIDTH * 2,
      animated: true,
    });
  }

  return (
    <View style={{ height: 460 }}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <FlatList
          ref={listRef}
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onPressItem?.(item)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                backgroundColor: '#c4ecc1',
                marginTop: 20,
                padding: 20,
                borderRadius: 20,
              }}
            >
              <SafeImage source={item.image} fallback={require('../assets/images/ong.png')} style={{ width: 300, height: 200, borderRadius: 20 }} />
              <Text style={{ width: 250, fontSize: 18, fontWeight: '800', textAlign: 'center', color: '#036134' }}>
                {item.name}
              </Text>
              <Text style={{ width: '100%' }}>{item.descricao ?? 'Sem descrição'}</Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}
