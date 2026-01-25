import { Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function App() {

  const { isAuthenticated } = useAuth();
  console.log("autenticate: ",isAuthenticated)
  if (!isAuthenticated) {
    
    return <Redirect href="/auth/login" />;
  }
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{color: "white"}}>Olá, React Native 🚀</Text>
    </View>
  );
}
