import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const Agenda: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState<string>("");

  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert("Invalid Input", "Task title cannot be empty.");
      return;
    }
    const newTask: Task = {
      id: Math.random().toString(),
      title: taskTitle.trim(),
      completed: false,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setTaskTitle("");
  };

  const handleToggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const checkEnter = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.key === "Enter") {
      handleAddTask();
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.task}>
      <TouchableOpacity
        style={styles.taskTextContainer}
        onPress={() => handleToggleTask(item.id)}
      >
        <Text style={[styles.taskText, item.completed && styles.completedTask]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTask(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
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
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>Todavía no hay tareas. Añade una!</Text>
        }
      />
    </View>
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
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: "#333",
  },
  completedTask: {
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
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
