import React, { useState, useEffect } from 'react';
import { Platform, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from '@/components/Themed';
import Checkbox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';
import * as Speech from 'expo-speech';
import { IsDebug } from '@/constants/utils';

interface IstorageValues{
  name: string,
  isAdvancedMode: boolean,
  mathLength: number,
  selectedVoiceES: string,
  selectedVoiceEN: string
}

const MyComponent: React.FC = () => {
  const [storedObject, setStoredObject] = useState<IstorageValues | null>(null);
  const [inputName, setInputName] = useState('');
  const [inputNumbers, setInputNumbers] = useState('1');
  const [inputAdvanced, setAdvanced] = useState(false);
  const [fontSize, setFontSize] = useState('24');
  const [voiceList, setVoices] = useState(Array<{ name: string; identifier: string, language: string }>);
  const [voiceES, setVoiceES] = useState('');
  const [voiceEN, setVoiceEN] = useState('');
  const storageKey = 'myConfiguration';

  useEffect(() => {
    const loadStoredValue = async () => {
      IsDebug && console.log('Cargando datos guardados');
      try {
        const jsonValue = await AsyncStorage.getItem(storageKey); 
        if (jsonValue !== null) { 
          IsDebug && console.log('Datos cargados');
          setStoredObject(JSON.parse(jsonValue));
          
          if (storedObject !== null){
            setInputName(storedObject.name);
            setInputNumbers(storedObject.mathLength.toString());
            setAdvanced(storedObject.isAdvancedMode);
            setVoiceES(voiceES);
            setVoiceEN(voiceEN);
          } else{
            console.log('Configuration is empty: ' + storedObject)
          }
        }else{
          IsDebug && console.log('No hay datos!');
        }
      } catch (error) {
        console.error('Error loading stored value:', error);
      }
    };

    const loadVoices = async () =>{
      IsDebug && console.log('Cargando voces');
      const voices = await Speech.getAvailableVoicesAsync();
      setVoices(voices
          .filter(voice => voice.language == "es-ES" || voice.language == "en-US" || voice.language == "en-GB")
          .map(voice => ({
            name: voice.name,
            identifier: voice.identifier,
            //quality: voice.quality,
            language: voice.language
          })));
    }

    const getData = async () => {
      try {
        console.log('entra');
        const jsonValue = await AsyncStorage.getItem('my-key');
        if (jsonValue != null){
          let savedData = JSON.parse(jsonValue);
          setInputName(savedData.name);
          setInputNumbers(savedData.mathLength.toString());
          setAdvanced(savedData.isAdvancedMode);
          setVoiceES(voiceES);
          setVoiceEN(voiceEN);
          setStoredObject(savedData);
          console.log(savedData);
        }
        console.log('sale');
      } catch (e) {
        // error reading value
      }
    };

    //loadStoredValue();
    loadVoices();
    getData();
  }, []);

  const storeData = async () => {
    try {
      console.log('entra');
      const myConfiguration: IstorageValues = { 
        name: inputName, 
        mathLength: parseInt(inputNumbers, 10), 
        isAdvancedMode: inputAdvanced,
        selectedVoiceES: voiceES,
        selectedVoiceEN: voiceEN
      };
      const jsonValue = JSON.stringify(myConfiguration);
      await AsyncStorage.setItem('my-key', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const testVoiceES = async () => {
    let options = {
      voice: voiceES,
      language: 'es-ES',
      pitch: 1.5,
      rate: 1
    };
    await Speech.speak('¿Te gusta mi voz?', options);
  } 

  const testVoiceEN = async () => {
    let options = {
      voice: voiceEN,
      language: 'es-US',
      pitch: 1.5,
      rate: 1
    };
    await Speech.speak('Do you like my voice?', options);
  } 

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
      <TextInput
        style={styles.input}
        value={fontSize}
        onChangeText={setFontSize}
        placeholder="Tamaño de la fuente"
        key='fontSize'
      />
      <Checkbox
        style={{margin: 8}}
        value={inputAdvanced}
        onValueChange={setAdvanced}
        color={inputAdvanced ? '#4630EB' : 'default'}
      />
      {!!voiceList && (
      <View>
        <Text>Selecciona la voz en Español</Text>
        <Picker
          selectedValue={voiceES}
          onValueChange={voice => setVoiceES( voice )}
        >
          {voiceList
            .filter(voice => voice.language == 'es-ES')
            .map(voice => (
            <Picker.Item
              key={voice.identifier}
              label={voice.name}
              value={voice.identifier}
            />
          ))}
        </Picker>
      </View>
      )}
      <View>
        <Text>Select the English voice</Text>
        <Picker
          selectedValue={voiceEN}
          onValueChange={voice => setVoiceEN( voice )}
        >
          {voiceList
            .filter(voice => voice.language == 'en-US')
            .map(voice => (
              <Picker.Item
                key={voice.identifier}
                label={voice.name}
                value={voice.identifier}
              />
          ))}
        </Picker>
      </View>
      <View style={{flexDirection: 'column'}}>
        <Button title="Guardar" onPress={storeData} />
        <Button title="Probar voz Español" onPress={testVoiceES} />
        <Button title="Text English voice" onPress={testVoiceEN} />
      </View>
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
