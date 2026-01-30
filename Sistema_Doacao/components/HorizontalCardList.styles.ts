import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7DBE7A', 
  },
  arrow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "orange",
    marginTop: -20,
    paddingTop: 0,
    fontSize: 40,
    color: '#999',
  },
  card: {
    
    alignItems: 'center',
    marginHorizontal: 8,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 6,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
  },
});
