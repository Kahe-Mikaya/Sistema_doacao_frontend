import { View, Text, FlatList, Pressable, Dimensions, Image, ImageSourcePropType } from 'react-native';
import { SafeImage } from './SafeImage';
import { styles } from './HorizontalCardList.styles';
import { useRef } from 'react';

type Item = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  descricao?: string;
  latitude?: number;
  longitude?: number;
};

type Props = {
  title: string;
  data: Item[];
  onPressItem?: (item: Item) => void;
};

const ITEM_WIDTH = 120;
const SCREEN_WIDTH = Dimensions.get('window').width;

export function HorizontalCardList({ title, data, onPressItem }: Props) {
  const listRef = useRef<FlatList>(null);

  function scrollRight() {
    listRef.current?.scrollToOffset({
      offset: ITEM_WIDTH * 2,
      animated: true,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        <Pressable onPress={scrollRight}>
          <Image style={{ height: 20, width: 20 }} source={require('../assets/images/arrowRight.png')} />
        </Pressable>
      </View>

      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <FlatList
          ref={listRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => onPressItem?.(item)} style={styles.card}>
              <SafeImage source={item.image} fallback={require('../assets/images/ong.png')} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}
