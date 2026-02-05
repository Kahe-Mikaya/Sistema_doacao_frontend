import { View, Pressable, Image, ImageSourcePropType } from 'react-native';
import { router } from 'expo-router';

type Props = {
  homeIconUrl: ImageSourcePropType;
  profileIconUrl: ImageSourcePropType;
  onLogout: () => void;
  onPressProfile?: () => void;
};

export function TopMenuBar({ homeIconUrl, profileIconUrl, onLogout, onPressProfile }: Props) {
  return (
    <View
      style={{
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 100,
        width: '100%',
        backgroundColor: '#c4ecc1',
        paddingTop: 30,
      }}
    >
      <Pressable onPress={() => router.push('/(tabs)')}>
        <Image style={{ height: 40, width: 40 }} source={homeIconUrl} />
      </Pressable>

      <Image
        source={require('../assets/images/logo.png')}
        style={{ marginLeft: 35, height: 200, width: 200 }}
        resizeMode="contain"
      />

      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Pressable onPress={onPressProfile ?? (() => router.push('/(tabs)'))}>
          <Image
            style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 2, borderColor: '#036134' }}
            source={profileIconUrl}
          />
        </Pressable>

        <Pressable onPress={onLogout}>
          <Image style={{ height: 40, width: 40, borderRadius: 100 }} source={require('../assets/images/logout.png')} />
        </Pressable>
      </View>
    </View>
  );
}
