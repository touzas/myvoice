import React, { useState, useEffect } from 'react';
import { Platform, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from '@/components/Themed';
import Checkbox from 'expo-checkbox';

interface IstorageValues{
  name: string,
  isAdvancedMode: boolean,
  mathLength: number
}

const MyComponent: React.FC = () => {
  const [storedObject, setStoredObject] = useState<IstorageValues | null>(null);
  const [inputName, setInputName] = useState('');
  const [inputNumbers, setInputNumbers] = useState('1');
  const [inputAdvanced, setAdvanced] = useState(false);
  const storageKey = 'myConfiguration';

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(storageKey); 
        if (jsonValue !== null) { 
          setStoredObject(JSON.parse(jsonValue));
          
          if (storedObject !== null){
            setInputName(storedObject.name);
            setInputNumbers(storedObject.mathLength.toString());
            setAdvanced(storedObject.isAdvancedMode);
          } else{
            console.log('Configuration is empty: ' + storedObject)
          }
        }
      } catch (error) {
        console.error('Error loading stored value:', error);
      }
    };

    loadStoredValue();
  }, []);

  const saveValue = async () => {
    try {
      const myConfiguration: IstorageValues = { 
        name: inputName, 
        mathLength: parseInt(inputNumbers, 10), 
        isAdvancedMode: inputAdvanced
      };
      const jsonValue = JSON.stringify(myConfiguration);
      await AsyncStorage.setItem(storageKey, jsonValue);
      console.log('Data was saved!');

    } catch (error) {
      console.error('Error saving value:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración de la aplicación</Text>
      <TextInput
        style={styles.input}
        value={inputName}
        onChangeText={setInputName}
        placeholder="Dime tu nombre"
        key='name'
      />
      <TextInput
        style={styles.input}
        value={inputNumbers}
        onChangeText={setInputNumbers}
        placeholder="¿Cuántos números quieres?"
        key='mathLength'
      />
      <Checkbox
          style={{margin: 8}}
          value={inputAdvanced}
          onValueChange={setAdvanced}
          color={inputAdvanced ? '#4630EB' : undefined}
        />
      <Button title="Guardar" onPress={saveValue} />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'dark'} />
    </View>
  );
};
//<Text style={styles.storedValue}>Valor guardado: {storedValue}</Text>*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '100%',
  },
  storedValue: {
    marginTop: 16,
    fontSize: 18,
  },
});

export default MyComponent;
