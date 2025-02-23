import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Animated, Pressable, StyleSheet, TextInput } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

import KeyboardTextToVoice from '@/components/KeyboardTextToVoice';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import SpainFlag from '@/assets/images/SpainFlag';
import UkFlag from '@/assets/images/UkFlag';
import { IsTablet, IsLandscape, IsDebug, GetSavedData } from '@/constants/utils';

export default function TabOneScreen() {
  const defaultIconSize = IsTablet() ? 42 : 18;
  const [isUppercase, setIsUppercase] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation | null>(null);
  const [log, setLogsByDate] = useState<{ [date: string]: string[] }>({});
  const [isAdvancedMode, setAdvancedMode] = useState(false);
 
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
	const loadStoredValue = async () => {
		IsDebug && console.log('Cargando datos guardados');
		let storedData = await GetSavedData();
		if (storedData !== null){
			setAdvancedMode(storedData.isAdvancedMode);
		}
	};

	loadStoredValue();
    subscribeToOrientationChanges();
  }, []);

	const getCurrentDate = (): string => {
		const date = new Date();
		return date.toISOString().split('T')[0];
	};

	const addLogEntry = async (logData: string) => {
        if (logData.trim() === '') return;

        const today = getCurrentDate();
        const updatedLogs: { [key: string]: string[] } = { ...log };

        if (!updatedLogs[today]) {
            updatedLogs[today] = [];
        }

        updatedLogs[today].push(logData);
        setLogsByDate(updatedLogs);

        try {
            await AsyncStorage.setItem('eireVoiceLog', JSON.stringify(updatedLogs));
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar la entrada.');
        }
    };

  const handleKeyPress = (key: string) => {
    const actions: Record<string, () => void> = {
      '⌫': () => setInputValue((prev) => prev.slice(0, -1)),
      Borrar: () => Alert.alert('Estás segur@?', '¿Quieres borrar todo el texto?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => setInputValue('') },
      ]),
      Espacio: () => handleKeyPress(' '),
      '⇑': () => setIsUppercase(!isUppercase),
      '↲': () => setInputValue((prev) => prev + '\n'),
    };

    if (!actions[key]) {
      setInputValue((prev) => prev + (isUppercase ? key.toUpperCase() : key.toLowerCase()));
    } else {
      actions[key]();
    }
  };

  const playAudio = async (language: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    addLogEntry(language + '=>' + inputValue);
    await Speech.speak(
      inputValue, 
      { 
        voice: language === 'es' ? 'es-es-x-eed-local' : "en-us-x-tpc-local", 
        language, pitch: 1.5, rate: 1 
      }
    );
    setIsSpeaking(false);
  };

  const renderFlagButton = (language: string, Flag: React.FC<{ width: number, height: number }>, label: string) => (
    <Pressable style={stylesLandScapeTablet.flagButton} onPress={() => playAudio(language)}>
      <Animated.View style={IsTablet() && IsLandscape(orientation) ? stylesLandScapeTablet.flagContainerLandScape: defaultStyles.flagContainer}>
        <Flag width={defaultIconSize} height={defaultIconSize} />
        <Text style={stylesLandScapeTablet.buttonPlayText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );

  const renderContent = () => (
    <View style={stylesLandScapeTablet.container}>
      <TextInput
        style={IsTablet() && IsLandscape(orientation) ? stylesLandScapeTablet.inputTextTabletLandScape : defaultStyles.inputText}
        placeholder = "Escribe lo que quieras decir..." //{ `Landscape` + IsLandscape(orientation).toString() + `| Tablet: `+ IsTablet()} 
        editable={isAdvancedMode}
        showSoftInputOnFocus={isAdvancedMode}
        multiline
        value={inputValue}
		onChangeText={setInputValue}
      />
      <View style={IsTablet() && IsLandscape(orientation) ? stylesLandScapeTablet.keyboardSectionLandScape : defaultStyles.keyboardSection}>
		{!isAdvancedMode && (
			<View style={stylesLandScapeTablet.keyboard}>
				<KeyboardTextToVoice onKeyPress={handleKeyPress} isUpperCase={isUppercase} />
			</View>
		)}
        <View style={IsTablet() && IsLandscape(orientation) ? stylesLandScapeTablet.flagSectionLandScape : defaultStyles.flagSection}>
          {renderFlagButton('es-ES', SpainFlag, 'Castellano')}
          {renderFlagButton('en-US', UkFlag, 'English')}
        </View>
      </View>
    </View>
  );

  return renderContent();
}

const defaultStyles = StyleSheet.create({
  inputText: {
    borderRadius: 5,
    borderColor: Colors.PinkTheme.Purple,
    borderWidth: 1,
    color: '#333',
    fontWeight: '900',
    backgroundColor: 'white',
    padding: 10,
    flex: 1.8,
    fontSize: 40,
  },
  keyboardSection: { 
    flex: 1,
    flexDirection: 'column',
  },
  flagContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.PinkTheme.Purple,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.PinkTheme.Purple,
  },
  flagSection: { 
    flexDirection: 'row',
    justifyContent: 'space-around', 
    paddingVertical: 10 
  },
});


const stylesLandScapeTablet = StyleSheet.create({
  container: { 
    flex: 3, 
    backgroundColor: Colors.PinkTheme.Purple, 
    padding: 5 
  },
  inputTextTabletLandScape: {
    ...defaultStyles.inputText,
    flex: 3,
    fontSize: 40,
  },
  keyboardSectionLandScape: { 
    flexDirection: 'row',
    flex: 3,
    backgroundColor: 'red',
  },
  keyboard: {
    flex:1,
    flexDirection: 'column',
  },
  flagSectionLandScape: { 
    flexDirection: 'column',
    justifyContent: 'space-around', 
    paddingVertical: 50 
  },
  flagButton: { flex: 1, marginHorizontal: 10 },
  flagContainerLandScape: {
    ...defaultStyles.flagContainer,
    padding: 20,
  },
  buttonPlayText: { 
    color: 'white', 
    fontSize: 25,
    fontWeight: 'bold',
    minWidth: 140, 
    textAlign: 'center',
    paddingLeft: 25
  },
});
