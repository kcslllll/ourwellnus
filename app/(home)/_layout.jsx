import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

// Import your screens
import summary from './summary';
import booking from './booking';
import tracker from './tracker';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const isFocused = useIsFocused();
          let iconName;

          if (route.name === 'summary') {
            iconName = 'heart';
          } else if (route.name === 'booking') {
            iconName = 'calendar';
          } else if (route.name === 'tracker') {
            iconName = 'list';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={isFocused ? 'blue' : 'black'}
            />
          );
        },
      })}
    >
      <Tab.Screen name="summary" component={summary} />
      <Tab.Screen name="booking" component={booking} />
      <Tab.Screen name="tracker" component={tracker} />
    </Tab.Navigator>
  );
}

export default App;
