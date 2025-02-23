import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";

type Task = {
  id: string;
  title: string;
  deleted: boolean;
  completed: boolean;
};
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Agenda: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState<string>("");

  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert("Error!", "La tarea no puede estar vacía.");
      return;
    }
    const newTask: Task = {
      id: (tasks.length + 1).toString(),
      title: taskTitle.trim(),
      completed: false,
      deleted: false,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setTaskTitle("");
  };

  const handleClearTask = () => {
    Alert.alert('Estás segur@?', '¿Quieres borrar todo?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'OK', onPress: () => setTasks([]) },
    ]);
  }

  const handleToggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, deleted: !task.deleted } : task
      )
    );
  };

  const checkEnter = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.key === "Enter") {
      handleAddTask();
    }
  };

  const renderTask = ({ item, index, drag }: { item: Task; index: number; drag: () => void }) => (
    <View style={[styles.task, 
          item.completed && styles.taskCompleted, 
          item.deleted && styles.taskDeleted
      ]}
    >
      <Text style={styles.taskNumber}>{index}</Text>
      <TouchableOpacity
        style={styles.taskTextContainer}
        onPress={() => handleToggleTask(item.id)}
		onLongPress={drag}
      >
        <Text style={[styles.taskText, 
            item.completed && styles.completedTask, 
            item.deleted && styles.deletedTask
        ]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      {!item.deleted && ( 
        <TouchableOpacity
          style={[styles.completeButton, item.completed && styles.uncompleteButton]}
          onPress={() => handleToggleTask(item.id)}
        >
          <Text style={styles.completeButtonText}>
            {item.completed ?'Retomar' : 'Completar'}
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.deleteButton, item.deleted && styles.undeleteButton]}
        onPress={() => handleDeleteTask(item.id)}
      >
        <Text style={styles.deleteButtonText}>
          {item.deleted ? 'Recuperar' : 'Eliminar'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.title}>Agenda</Text>
        <View style={styles.inputContainer}>
			<TextInput
				style={styles.input}
				placeholder="Inserta la tarea que desees"
				value={taskTitle}
				onChangeText={setTaskTitle}
				onKeyPress={checkEnter}
			/>
			<TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
			<Text style={styles.addButtonText}>Añadir</Text>
		</TouchableOpacity>
        </View>
        <DraggableFlatList
			data={tasks.slice().reverse()}
			keyExtractor={(item: Task) => item.id}
			renderItem={({ item, drag }) => (
            	renderTask({ item, index: tasks.length - tasks.findIndex(t => t.id === item.id) - 1, drag })
          	)}
			inverted={false}
			ListEmptyComponent={
            	<Text style={styles.emptyMessage}>Todavía no hay tareas. Añade una!</Text>
          }
          extraData={tasks.length}
          onDragEnd={({ data }) => setTasks(data.reverse())}
        />
        <View style={{ alignItems: 'center' }} >
          <TouchableOpacity style={styles.cleanButton} onPress={handleClearTask}>
            <Text style={styles.addButtonText}>Eliminar todas</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default Agenda;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cleanButton: {
    marginLeft: 10,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: "center",
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  taskCompleted: {
    borderColor: "green",
    backgroundColor: "#f0fff0",
  },
  taskDeleted: {
    borderColor: "#888",
    backgroundColor: "#f9f9f9",
  },
  taskTextContainer: {
    flex: 1,
  },
  taskNumber: {
    fontSize: 16,
    color: "#000",
    fontWeight: 'bold',
    marginRight: 10,
  },
  taskText: {
    fontSize: 16,
    color: "#333",
  },
  completedTask: {
    textDecorationLine: "none",
    color: "green",
  },
  deletedTask: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: "#FF6347",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  uncompleteButton: {
    backgroundColor: "lightblue",
  },
  undeleteButton: {
    backgroundColor: "lightcoral",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  completeButton: {
    marginLeft: 10,
    backgroundColor: "lightgreen",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  completeButtonText: {
    color: "#333",
    fontSize: 14,
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
