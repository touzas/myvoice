import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button, Alert } from "react-native";

type Player = "X" | "O" | null;

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player>(null);

  const handlePress = (index: number) => {
    if (board[index] || winner) return; // Prevent overwriting or playing after game ends

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      Alert.alert("Game Over", `${gameWinner} wins!`);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const calculateWinner = (board: Player[]): Player | null => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
  };

  const renderSquare = (index: number) => (
    <TouchableOpacity
      style={styles.square}
      onPress={() => handlePress(index)}
      key={index}
    >
      <Text style={styles.squareText}>{board[index]}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Juguemos al tres en raya (Tic Tac Toe)</Text>
      <View style={styles.board}>
        {board.map((_, index) => renderSquare(index))}
      </View>
      <Text style={styles.status}>
        {winner ? `Ganador: ${winner}` : `Le toca a: ${currentPlayer}`}
      </Text>
      <Button title="Otra vez" onPress={resetGame}  />
    </View>
  );
};

export default TicTacToe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  board: {
    width: '80%',
    height: '70%',
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 3,
    borderColor: "purple",
    backgroundColor: "#f9f9f9",
  },
  square: {
    width: "33.33%",
    height: "33.33%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "purple",
  },
  squareText: {
    fontSize: 80,
    fontWeight: "bold",
    color: "purple",
  },
  status: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 10,
    color: "purple",
    fontWeight: "bold",
  },
});
