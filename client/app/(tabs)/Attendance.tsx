import { FlatList } from 'react-native';
import ScreenBackground from '../../components/screen/ScreenBackground';
import AttendanceCard from '../../components/attendance/AttendanceCard';
import { Heading } from '../../components/common/Heading';

const attendanceData = [
  {
    id: '1',
    name: 'Hackathon 2026',
    date: '12 March 2026',
    image: 'https://picsum.photos/300',
    NFTEnabled: true,
  },
  {
    id: '2',
    name: 'Web3 Bootcamp',
    date: '28 February 2026',
    image: 'https://picsum.photos/301',
    NFTEnabled: false,
  },
  {
    id: '3',
    name: 'AI Workshop',
    date: '5 January 2026',
    image: 'https://picsum.photos/302',
    NFTEnabled: true,
  },
];

const Attendance = () => {
  return (
    <ScreenBackground>
      <Heading title={'Attendance'} />
      <FlatList
        data={attendanceData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AttendanceCard
            name={item.name}
            date={item.date}
            image={item.image}
            NFTEnabled={item.NFTEnabled}
            onVerify={() => console.log('Verify:', item.name)}
          />
        )}
      />
    </ScreenBackground>
  );
};

export default Attendance;
