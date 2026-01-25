import { StyleSheet } from 'react-native';

export const  styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: "100%",
    height: "100%",
    backgroundColor: '#fff',
    alignItems: "center",
    position: "relative",
    

  },
  containerRegister: {
    flex: 1,
    paddingTop: 100,
    width: "100%",
    height: "100%",
    backgroundColor: '#fff',
    alignItems: "center",
    position: "relative",

  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    width: 250,
    textAlign: 'left',
    color: "#2FC224"
  },
  logo: {
    width: 400,
    height: 400,
    marginTop: -50,
    position: "absolute",
    top: "10%",
  },
  partialBottomCircle:{
    width: "100%",
    height: "100%",
    marginTop: -400,
    position: "absolute",
    top: 10,
  }
  ,
  partialTopCircle: {
    width: "100%",
    height: "100%",
    
    position: "absolute",
    bottom: -370,
  }
  ,
  textCadatro: {
    width: 250,
    textAlign: "left",
    marginTop: -10,
   
    color: '#2FC224'
    
    
  }
  ,
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: 250,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  button: {
    backgroundColor: '#2FC224',
    padding: 14,
    borderRadius: 8,
    width: 250,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }, 
  
  label: {
    fontWeight: 'bold',
    marginTop: 2,
    width: 250,
    textAlign: "left"
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 8,
  },
  option: {
    padding: 8,
    color: '#555',
    
  },
  selected: {
    padding: 8,
    color: '#1e90ff',
    fontWeight: 'bold',
    overflow: "visible"
  },
  photo: {
  width: 120,
  height: 120,
  borderRadius: 60,
  borderColor: "black",
  borderWidth: 2,
  alignSelf: 'center',
  marginBottom: 2,
},
photoButton: {

  width: 150,
  color: "#f7f7f7",


  borderRadius: 8,
  alignItems: 'center',
  marginBottom: 12,
},
buttonLocation :{
    width: 250,
    textAlign: "left",
    display : "flex",
    flexDirection: "row",
    gap: 5
},

});
