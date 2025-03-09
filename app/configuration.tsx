import React, { useState, useEffect } from 'react';
import { Platform, TextInput, Button, StyleSheet, Modal, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from '@/components/Themed';
import Checkbox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';
import * as Speech from 'expo-speech';
import { IsDebug, GetSavedData } from '@/constants/utils';

interface IstorageValues{
  name: string,
  isAdvancedMode: boolean,
  mathLength: number,
  selectedVoiceES: string,
  selectedVoiceEN: string
}

const MyComponent: React.FC = () => {
  const [inputName, setInputName] = useState('');
  const [inputNumbers, setInputNumbers] = useState('1');
  const [inputAdvanced, setAdvanced] = useState(false);
  const [fontSize, setFontSize] = useState('24');
  const [voiceList, setVoices] = useState(Array<{ name: string; identifier: string, language: string }>);
  const [voiceES, setVoiceES] = useState('');
  const [voiceEN, setVoiceEN] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [log, setLogsByDate] = useState<{ [date: string]: string[] }>({});

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    const loadStoredValue = async () => {
      IsDebug && console.log('Cargando datos guardados');
      let storedData = await GetSavedData();
      if (storedData !== null){
        setInputName(storedData.name);
        setInputNumbers(storedData.mathLength.toString());
        setAdvanced(storedData.isAdvancedMode);
        setVoiceES(storedData.selectedVoiceES);
        setVoiceEN(storedData.selectedVoiceEN);
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
    };

	const loadLogs = async () => {
		try {
			const storedLogs = await AsyncStorage.getItem('eireVoiceLog');
			if (storedLogs) {
				setLogsByDate(JSON.parse(storedLogs));
			}
		} catch (error) {
			console.log('Error', 'No se pudieron cargar los registros.');
		}
	};
	loadLogs();
    loadStoredValue();
    loadVoices();
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

	const showLog = async () => {
		openModal();
	}

	const clearLog = async () => {
		try {
			await AsyncStorage.removeItem('eireVoiceLog');
			setLogsByDate({});
		} catch (error) {
			Alert.alert('Error', 'No se pudieron eliminar los registros.');
		}
	};

	const clearLogsByDate = async (date: string) => {
        const updatedLogs = { ...log };
        delete updatedLogs[date];
        setLogsByDate(updatedLogs);

        try {
            await AsyncStorage.setItem('dailyLogs', JSON.stringify(updatedLogs));
        } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el registro de ese día.');
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
      	<View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
				style={styles.input}
				value={inputName}
				onChangeText={setInputName}
				placeholder="Dime tu nombre"
				key='name'
			/>
        </View>

		<View style={styles.inputContainer}>
            <Text style={styles.label}>Tamaño de la fuente:</Text>
            <TextInput
				style={styles.input}
				value={fontSize}
				onChangeText={setFontSize}
				placeholder="Tamaño de la fuente"
				key='fontSize'
			/>
        </View>
		
		<View style={styles.inputContainer}>
            <Text style={styles.label}>Modo avanzado:</Text>
            <Checkbox
				style={{margin: 8}}
				value={inputAdvanced}
				onValueChange={setAdvanced}
				color={inputAdvanced ? '#4630EB' : 'default'}
			/>
        </View>
      
      
      {!!voiceList && (
      <View style={styles.inputContainer}>
        <Text>Selecciona la voz en Español</Text>
        <Picker
          selectedValue={voiceES}
          onValueChange={voice => setVoiceES( voice )}
		  style={styles.picker}
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
      <View style={styles.inputContainer}>
        <Text>Select the English voice</Text>
        <Picker
          selectedValue={voiceEN}
          onValueChange={voice => setVoiceEN( voice )}
		  style={styles.picker}
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
		<View style={styles.buttonContainer}>
			<Button title="Guardar" onPress={storeData} />
			<Button title="Probar voz Español" onPress={testVoiceES}  color={'red'}/>
			<Button title="Text English voice" onPress={testVoiceEN}  color={'green'}/>
		</View>
		<View style={styles.buttonContainer}>
			<Button title="Leer log" onPress={showLog} />
			<Button title="Limpiar log" onPress={clearLog} />
		</View>
		<StatusBar style={Platform.OS === 'ios' ? 'light' : 'dark'} />
		<View style={styles.container}>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={closeModal}
			>
				<View style={stylesModal.modalBackground}>
					<View style={stylesModal.modalContent}>
						<ScrollView style={{maxHeight: 400}}>
							{Object.keys(log).length > 0 ? (
								Object.entries(log).map(([date, entries]) => (
									<View key={date} style={stylesLog.logSection}>
										<View style={stylesLog.dateHeader}>
											<Text style={stylesLog.dateText}>{date}</Text>
											<Button title="Eliminar" onPress={() => clearLogsByDate(date)} color="#ff4444" />
										</View>
										{entries.map((entry, index) => (
											<Text key={`${date}-${index}`} style={stylesLog.logItem}>
												{index + 1}. {entry}
											</Text>
										))}
									</View>
								))
							) : (
								<Text style={stylesLog.noLogsText}>No hay registros disponibles.</Text>
							)}
						</ScrollView>
						<TouchableOpacity style={stylesModal.closeButton} onPress={closeModal}>
							<Text style={stylesModal.closeButtonText}>Cerrar</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
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
		borderColor: '#eaeaea',
		backgroundColor: 'white',
		borderWidth: 1,
		paddingHorizontal: 8,
		width: '100%',
	},
	picker: {
		width: '100%', 
		backgroundColor: 'white'
	},
	storedValue: {
		marginTop: 16,
		fontSize: 18,
	},
	inputContainer: {
		shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 4,
        elevation: 3,
		width: '100%',
		padding: 5,
		marginBottom: 15,
	},
	buttonContainer: {
		flexDirection: 'row',
		shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 4,
        elevation: 3,
		width: '100%',
		padding: 5,
		marginBottom: 15,
		justifyContent: 'space-around', 
    	paddingVertical: 5 
	},
	label: {
		fontSize: 16,
		marginBottom: 5,
	}
});

const stylesModal = StyleSheet.create({
	modalBackground: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	  },
	  modalContent: {
		width: '90%',
		padding: 20,
		backgroundColor: 'white',
		borderRadius: 10,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	  },
	  modalText: {
		fontSize: 18,
		marginBottom: 15,
		textAlign: 'center',
	  },
	  closeButton: {
		marginTop: 10,
		padding: 10,
		backgroundColor: '#007AFF',
		borderRadius: 5,
	  },
	  closeButtonText: {
		color: 'white',
		fontSize: 16,
	  }
});

const stylesLog = StyleSheet.create({
	logContainer: {
        marginTop: 20,
    },
    logSection: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        elevation: 2,
		width: '100%',
    },
    dateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#007bff',
    },
    logItem: {
        paddingVertical: 2,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    noLogsText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 10,
    },
});

export default MyComponent;
