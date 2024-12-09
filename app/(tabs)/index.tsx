import { 
  Alert, 
  Animated, 
  Dimensions,
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

export default function TabOneScreen() {
  const defaultIconSize: number = 64;
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

  const getOrientationName = (orientation: ScreenOrientation.Orientation | null) => { 
    switch (orientation) { 
      case ScreenOrientation.Orientation.PORTRAIT_UP: return 'Portrait Up'; 
      case ScreenOrientation.Orientation.PORTRAIT_DOWN: return 'Portrait Down'; 
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT: return 'Landscape Left'; 
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT: return 'Landscape Right'; 
      default: return 'Unknown'; 
    } 
  };

  const isPortrait = (orientation: ScreenOrientation.Orientation | null) => {
    return (orientation === ScreenOrientation.Orientation.PORTRAIT_UP || 
      orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
    )
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
      language: language,
      pitch: 1.5,
      rate: 1
    };
    if (isSpeaking) 
      return;

    setIsSpeaking(true);
    console.log(inputValue);
    await Speech.speak(inputValue, options);
    setIsSpeaking(false);
  };

  return (
    <View style={styles.container}>
      <HelloWave/>
      <Text style={styles.title}>Escribe y habla {getOrientationName(orientation)}</Text>
      <View style={styles.inputTextContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="Escribe lo que quieras decir..."
          editable={false} // Disable focus
          showSoftInputOnFocus={false} // Disable native keyboard
          multiline={true}
          value={inputValue}
          numberOfLines={isPortrait(orientation) ? 10: 6}
        />
      </View>
      <View style={styles.keyboardContainer}>
        <View style={styles.keyboard}>
          <KeyboardTextToVoice onKeyPress={ handleKeyPress } isUpperCase={isUppercase}/>
        </View>
        <View style={styles.playContainer}>
          <View style={styles.playButtons}>
            <Pressable
              key={'playES'}
              onPressOut={() => playAudio('es-ES')} >
              <Animated.View style={ styles.buttonPlay}>
                <SpainFlag width={defaultIconSize} height={defaultIconSize} style={{marginRight: 5}} />
                <Text style={styles.buttonPlayText}>Castellano</Text>
              </Animated.View>
            </Pressable>
            <Pressable
                key={'playEN'}
                onPressOut={() => playAudio('en-US')} >
              <Animated.View style={styles.buttonPlay}>
                <UkFlag width={defaultIconSize} height={defaultIconSize} style={{marginRight: 5}} />
                <Text style={styles.buttonPlayText}>English</Text>
              </Animated.View>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
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
    borderWidth:3, 
    flex:1,
    fontSize: 40,
    color: '#333',
    fontWeight: '900',
    verticalAlign: 'top'
  },
  keyboardContainer: {
    display: 'flex',  
    flexDirection: 'row'
  },
  keyboard: {
    display: 'flex', 
    flex: 6, 
    paddingTop: 20
  },
  playContainer: {
    display: 'flex', 
    flexDirection: 'column',
    padding: 20
  },
  playButtons:{
    display: 'flex',
    flex: 1,
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonPlay: {
    backgroundColor: Colors.PinkTheme.Purple,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
    marginBottom: 20,
    borderColor: Colors.PinkTheme.Purple,
    borderWidth: 2
  },
  buttonPlayText: {
    color: 'white',
    fontSize: 20,
    minWidth: 140,
    textAlign: 'center'
  }
});
