import { ScrollView, View } from "react-native";
import ScreenBackground from "../../components/ScreenBackground";
import AttendanceCard from "../../components/AttendanceCard";

const Attendance = () => {
  return (
    <ScreenBackground>
      <ScrollView
        className="flex-1 px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >

        <AttendanceCard
          name="Hackathon 2025"
          date="12 March 2025"
          image="https://picsum.photos/300"
          NFTEnabled={true}
          onVerify={() => console.log("Verify pressed")}
        />

        <AttendanceCard
          name="Web3 Bootcamp"
          date="28 February 2025"
          image="https://picsum.photos/301"
          NFTEnabled={false}
        />

        <AttendanceCard
          name="AI Workshop"
          date="5 January 2025"
          image="https://picsum.photos/302"
          NFTEnabled={true}
          onVerify={() => console.log("Verify pressed")}
        />

      </ScrollView>
    </ScreenBackground>
  );
};

export default Attendance;