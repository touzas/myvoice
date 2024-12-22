import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from 'react-native';

const generateQuestion = (difficulty: number) => {
  const num1 = Math.floor(Math.random() * difficulty) + 1;
  const num2 = Math.floor(Math.random() * difficulty) + 1;
  const operations = ["+", "-", "*"];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  const question = `${num1} ${operation} ${num2}`;
  const answer = eval(question); // Calculate the answer
  return { question, answer };
};

export default function agendaScreenTab() {
  const [difficulty, setDifficulty] = useState(10); // Difficulty level
  const [question, setQuestion] = useState(generateQuestion(difficulty));
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!userAnswer){
        setMessage("Por favor, introduce una respuesta.");
        return;
    };
    if (parseInt(userAnswer) === question.answer) {
      setScore(score + 1);
      setMessage("Correcto! 🎉");
    } else {
      setMessage(`Casi! La respuesta correcta sería ${question.answer}.`);
    }
    setQuestion(generateQuestion(difficulty));
    setUserAnswer("");
  };

  const handleDifficultyChange = (level: string) => {
    const newDifficulty = level === "Easy" ? 10 : level === "Medium" ? 20 : 50;
    setDifficulty(newDifficulty);
    setQuestion(generateQuestion(newDifficulty));
    setScore(0);
    setMessage("");
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Juguemos con las Mates</Text>
        <Text style={styles.score}>Partidas ganadas: {score}</Text>
        <View style={styles.board}>
            <View style={styles.Difficulty}>
                <button style={styles.buttonDifficulty} onClick={() => handleDifficultyChange("Easy")}>Easy</button>
                <button style={styles.buttonDifficulty} onClick={() => handleDifficultyChange("Medium")}>Medium</button>
                <button style={styles.buttonDifficulty} onClick={() => handleDifficultyChange("Hard")}>Hard</button>
            </View>
            <View className="question">
                <Text style={styles.questionTitle}>¿Cuánto es?</Text>
                <View style={styles.question}>
                    <Text style={styles.questionOp}>{question.question}</Text>
                    <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Tú respuesta"
                        style={styles.input}
                    />
                </View>
                <View style={{flexDirection: "column", alignItems: 'center'}}>
                  <button style={styles.check} onClick={handleSubmit}>Comprobar</button>
                </View>
            </View>
            <View style={styles.result} className="message">{message}</View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        flexDirection: "column",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    score: {
        fontSize: 24,
        marginBottom: 20,
        color: "purple",
        fontWeight: "900",
    },
    board: {
        width: '80%',
        height: '80%',
        flexDirection: "column",
        flexWrap: "wrap",
        borderWidth: 2,
        borderColor: "purple",
        backgroundColor: "pink",
    },
    Difficulty: {
        flexDirection: "row",
        flexShrink: 1,
        flex: 0.2,
    },
    buttonDifficulty: {
        backgroundColor: "purple",
        color: "white",
        padding: 20,
        fontSize: 35,
        fontWeight: "bold",
        flex: 1
    },
    questionTitle:{
        fontSize: 42,
        fontWeight: "bold",
        marginBottom: 20,
        color: "black",
        alignItems: "center",
        textAlign: "center",
    },
    question: {
        fontSize: 42,
        fontWeight: "bold",
        color: "purple",
        alignItems: "center",
        alignContent : "center",
    },
    questionOp:{
        fontSize: 42,
        fontWeight: "bold",
        color: "purple",
        marginBottom: 20,
    },
    input: {
        fontSize: 42,
        padding: 10,
        marginBottom: 20,
        width: "50%",
    },
    check: {
        backgroundColor: "purple",
        color: "white",
        padding: 10,
        fontSize: 24,
        fontWeight: "bold",
        width: "50%",
    },  
    result: {
        fontSize: 24,
        marginTop: 20,
        marginBottom: 10,
        color: "purple",
        fontWeight: "bold",
        textAlign: "center",
    },  
});