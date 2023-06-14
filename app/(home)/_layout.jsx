import { Tabs } from "expo-router";

const HomeLayout = () => {
  return (
    <Tabs>
        <Tabs.Screen name="summary" options={{ title: "Summary" }} />
        <Tabs.Screen name="booking" options={{ title: "Booking" }} />
        <Tabs.Screen name="tracker" options={{ title: "Tracker" }} />
    </Tabs>
  );
};

export default HomeLayout;


