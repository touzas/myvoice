import { 
  Alert, 
  Animated, 
  Pressable, 
  StyleSheet, 
  TextInput 
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import KeyboardTextToVoice from '@/components/KeyboardTextToVoice';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import * as Speech from 'expo-speech';
import SpainFlag from '@/assets/images/SpainFlag';
import UkFlag from '@/assets/images/UkFlag';
import { HelloWave } from '@/components/HelloWave';
import { IsMobileDevice, WindowHeight } from '@/constants/utils';

export default function TabOneScreen() {
  const defaultIconSize: number = IsMobileDevice() ? 18 : 42;
  const [isUppercase, SetUppercase] = useState(true);
  const [inputValue, setInputValue] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation | null>(null); 

  useEffect(() => { 
    const subscribeToOrientationChanges = async () => { 
      const currentOrientation = await ScreenOrientation.getOrientationAsync(); 
      setOrientation(currentOrientation); 
      const subscription = ScreenOrientation.addOrientationChangeListener((event) => { 
        setOrientation(event.orientationInfo.orientation); 
      }); 
      return () => { 
        ScreenOrientation.removeOrientationChangeListener(subscription); 
      }; 
    }; 

    subscribeToOrientationChanges(); 
  }, []);
  
  const IsPortrait = (orientation: ScreenOrientation.Orientation | null) => {
    switch (orientation) {
      case ScreenOrientation.Orientation.PORTRAIT_UP:
      case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        return true;
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
      default:
        return false;
    }
  }

  //#region Keyboard Events
  const handleDelete = () => {
      setInputValue((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
      setInputValue('');
  };

  const handleUppercase = () => {
      SetUppercase(!isUppercase);
  }

  const handleKeyEnter = () => {
      setInputValue((prev) => prev + '\n');
  }

  const confirmDeleteAll = () => {
      Alert.alert('Estás segur@?', '¿Quieres borrar todo el texto?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => handleClear() },
      ]);
  }

  const handleKeyPress = (key: string) => {
    if (key === '⌫') return handleDelete();
    else if (key === 'Borrar') return confirmDeleteAll();
    else if (key === 'Espacio') return handleKeyPress(' ');
    else if (key === '⇑') return handleUppercase();
    else if (key === '↲') return handleKeyEnter();

    setInputValue((prev) => prev + (isUppercase ? key.toLocaleUpperCase() : key.toLocaleLowerCase() ) );
    console.log('=> ' + key)
  };
  //#endregion

  const playAudio = async (language: string) => {
    let options = {
      voice: "es-es-x-eed-local",// "en-us-x-tpc-local",
      language: language,
      pitch: 1.5,
      rate: 1
    };
    if (isSpeaking) 
      return;

    setIsSpeaking(true);
    await Speech.speak(inputValue, options);
    setIsSpeaking(false);
  };
  if (IsMobileDevice()) {
  }
  else {
    return (
      <View style={{display: 'flex', flexDirection: 'column', backgroundColor: Colors.PinkTheme.Purple, width: '100%', height:'100%', padding: 5}}>
        <View style={{flex: 0.50}}>
          <TextInput
            style={styles.inputText}
            placeholder="Escribe lo que quieras decir..."
            editable={true} // Disable focus
            showSoftInputOnFocus={false} // Disable native keyboard
            multiline={true}
            value={inputValue} 
          />
        </View>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View style={{flex:1, paddingTop: 10}}>
            <KeyboardTextToVoice onKeyPress={ handleKeyPress } isUpperCase={isUppercase}/>
          </View>
          <View style={{flex:0.50, flexDirection: 'row'}}>
            <Pressable
              key={'playES'}
              style={{flex: 1, marginLeft: 10, marginRight: 10}}
              onPressOut={() => playAudio('es-ES')} >
              <Animated.View style={{
                flexDirection: 'row',
                backgroundColor: Colors.PinkTheme.Purple,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                marginTop: 20,
                borderRadius: 5,
                borderColor: Colors.PinkTheme.Purple,
                borderWidth: 2
              }}>
                <SpainFlag width={defaultIconSize} height={defaultIconSize} style={{marginRight: 5}} />
                <Text style={IsMobileDevice() ? styles.buttonPlayTextMobile : styles.buttonPlayText}>Castellano</Text>
              </Animated.View>
            </Pressable>
            <Pressable
              key={'playEN'}
              style={{flex: 1, marginLeft: 10, marginRight: 10}}
              onPressOut={() => playAudio('en-US')} >
              <Animated.View style={{
                flexDirection: 'row',
                backgroundColor: Colors.PinkTheme.Purple,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                marginTop: 20,
                borderRadius: 5,
                borderColor: Colors.PinkTheme.Purple,
                borderWidth: 2
              }}>
                <UkFlag width={defaultIconSize} height={defaultIconSize} style={{marginRight: 5}} />
                <Text style={IsMobileDevice() ? styles.buttonPlayTextMobile : styles.buttonPlayText}>English</Text>
              </Animated.View>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex', 
    flex: 1, 
    flexDirection: 'column', 
    backgroundColor: 'white', 
    padding: 10
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.PinkTheme.Purple
  },
  inputTextContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10
  },
  inputText : {
    borderRadius:5, 
    borderColor: Colors.PinkTheme.Purple, 
    borderWidth:1, 
    flex:1,
    fontSize: 40,
    color: '#333',
    fontWeight: '900',
    verticalAlign: 'top',
    backgroundColor: 'white'
  },
  keyboardContainer: {
    display: 'flex',  
    flexDirection: 'row'
  },
  keyboardContainerMobile: {
    flexDirection: 'column'
  },
  keyboard: {
    display: 'flex', 
    flex: 6, 
    paddingTop: 20
  },
  buttonPlayText: {
    color: 'white',
    fontSize: 20,
    minWidth: 140,
    textAlign: 'center'
  },
  buttonPlayTextMobile: {
    color: 'white',
    fontSize: 10,
    minWidth: 100,
    textAlign: 'center'
  }
});
