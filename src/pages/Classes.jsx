// Create a new component called Home
// This component will be the main page of the application
// It will contain a header, a list of posts, and a form to create a new post

import React, { useState } from "react";

import { View, Text, Button, TextInput, StyleSheet } from "react-native";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const handleAddPost = () => {
    setPosts([...posts, newPost]);
    setNewPost("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home screen</Text>

      <TextInput
        style={styles.input}
        value={newPost}
        onChangeText={setNewPost}
        placeholder="Type a new post"
      />

      <Button title="Add post" onPress={handleAddPost} />

      {posts.map((post, index) => (
        <Text key={index}>{post}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
  },
});
