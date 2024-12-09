import { StyleSheet, TextInput } from 'react-native';
import Colors from '@/constants/Colors';
import { Text, View } from '@/components/Themed';
import React, { useState, useEffect } from 'react';

export default function TabTwoScreen() {
  const [numberOne, SetNumberOne] = useState(1);
  const [numberTwo, SetNumberTwo] = useState(1);
  const [operation, SetOperation] = useState('+');
  const [result, SetResult] = useState('');
  const [intentos, SetIntentos] = useState(0);

  const calculator = () => {
    SetNumberOne(Math.floor(Math.random() * 10) + 1)
    SetNumberTwo(Math.floor(Math.random() * 10) + 1)
  }

  useEffect(() => {
    calculator();
  },[]);

  const checkResult = (value:string) => {
    let result = parseInt(value);
    if (result > 0){
      if (numberOne + numberTwo === result){
        SetResult('Correcto');
      } else {
        SetResult('Prueba de nuevo');
        if (intentos > 5){
          SetIntentos(0);
          calculator();
        }else{
          SetIntentos((prev) => prev + 1);
        }
      }
    }
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.calculator}>
        <View style={styles.box}>
          <Text style={styles.textBox}>{numberOne}</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.textBox}>{operation}</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.textBox}>{numberTwo}</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.textBox}>=</Text>
        </View>
        <View style={styles.box}>
        <TextInput
          style={styles.input}
          placeholder=""
          onChangeText={checkResult}
          key='mathLength'
        />
        </View>
      </View>
      <View>
        <Text>{result}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center'
  },
  calculator: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row'
  },
  box: {
    flex:5,
    alignContent: 'center',
    textAlign: 'center',
    padding: 30,
    borderWidth: 5,
    borderColor: Colors.PinkTheme.Purple,
    margin: 3
  },
  textBox:{
    textAlign: 'center',
    verticalAlign: 'middle',
    fontWeight: 'bold',
    fontSize: 50,
    color: Colors.PinkTheme.Purple
  },
  input: {
    fontSize: 50,
    borderWidth: 3
  }
});