import { View, Pressable, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#fff',
        elevation: 5,
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;

        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: focused ? '#6200ee' : '#999' }}>
              {route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
