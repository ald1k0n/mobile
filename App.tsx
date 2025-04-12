import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import CreateRecipientScreen from "./screens/Home";
import TrackingScreen from "./screens/Tracking";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import FindParcelsScreen from "./screens/FindParcel";

const Tab = createBottomTabNavigator();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, retryOnMount: false } },
});
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#007aff",
            tabBarInactiveTintColor: "#8e8e93",
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabBarLabel,
            headerTitleStyle: styles.headerTitle,
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="CreateRecipient"
            component={CreateRecipientScreen}
            options={{
              title: "Новый получатель",
              tabBarLabel: "Добавить получателя",
              tabBarIcon: ({ color, size }) => (
                <Feather name="user-plus" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="TrackParcel"
            component={TrackingScreen}
            options={{
              title: "Отследить посылку",
              tabBarLabel: "Отследить",
              tabBarIcon: ({ color, size }) => (
                <Feather name="package" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="FindParcels"
            component={FindParcelsScreen}
            options={{
              title: "Найти посылку",
              tabBarLabel: "Поиск",
              tabBarIcon: ({ color, size }) => (
                <Feather name="search" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  header: {
    backgroundColor: "#fff",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
