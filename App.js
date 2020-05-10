import * as React from "react";
import { View, AsyncStorage } from "react-native";
import Routes from "./routes";
import { AuthContext } from "./hooks";

function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userMobileNumber: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userMobileNumber: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userMobileNumber: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userMobileNumber: null,
    }
  );
  React.useEffect(() => {
    setTimeout(() => {
      _retrieveData();
    }, 2000);
  }, []);

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("mobileNumber");
      dispatch({ type: "RESTORE_TOKEN", token: value });
    } catch (error) {
      // Error retrieving data
    }
  };

  const authContext = React.useMemo(
    () => ({
      signIn: (data) => {
        dispatch({ type: "SIGN_IN", token: data });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
    }),
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <AuthContext.Provider value={{ authContext, state }}>
        <Routes state={state} />
      </AuthContext.Provider>
    </View>
  );
}

export default App;
