import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const USERTYPE = 'user_type'
const LOGIN = 'auth_login'

export async function saveToken(token: string, type: string, login: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USERTYPE, type);
  await SecureStore.setItemAsync(LOGIN, login);
}

export async function getToken() {
  const login = await SecureStore.getItemAsync(LOGIN);
  const userType = await SecureStore.getItemAsync(USERTYPE);
  const  token = await SecureStore.getItemAsync(TOKEN_KEY);
  return {login,token,userType}
}

export async function removeToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USERTYPE);
  await SecureStore.deleteItemAsync(LOGIN);
}


