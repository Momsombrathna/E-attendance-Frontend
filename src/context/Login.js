import AsyncStorage from "@react-native-async-storage/async-storage";

const login = async ({ email, password, setLoading, setError, navigation }) => {
  setLoading(true);
  setError("");

  if (!email || !password) {
    setError("Username and password are required");
    setLoading(false);
    return;
  }

  if (password.length < 8) {
    setError("Password must be at least 8 characters");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    const Data = await response.json();

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Set the expiration date to 30 days from now

    const userData = {
      token: Data.user.tokens[Data.user.tokens.length - 1],
      username: Data.user.username,
      userId: Data.user._id,
      email: Data.user.email,
      profile: Data.user.profile,
      expirationDate: expirationDate.toISOString(), // Convert the expiration date to a string
    };

    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

export default login;
