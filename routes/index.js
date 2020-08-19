import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../components/HomeScreen";
import PhoneAuthScreen from "../components/PhoneAuthScreen";
import SplashScreen from "../components/SplashScreen";
import NotaryItemScreen from "../components/NotaryItemScreen";
import NotaryViewScreen from "../components/NotaryViewScreen";
import AboutScreen from "../components/AboutScreen";
import HelpScreen from "../components/HelpScreen";

const Stack = createStackNavigator();

function Routes({ state }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        {state.isLoading ? (
          // We haven't finished checking for the token yet
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : state.userMobileNumber == null ? (
          <Stack.Screen
            name="Login"
            component={PhoneAuthScreen}
            options={{
              animationTypeForReplace: state.isSignout ? "pop" : "push",
            }}
          />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AboutApp" component={AboutScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
            <Stack.Screen name="NotaryDetail" component={NotaryItemScreen} />
            <Stack.Screen name="NotaryView" component={NotaryViewScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
