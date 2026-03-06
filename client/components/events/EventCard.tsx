import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type EventCardProps = {
  id: string;
  name: string;
  startDate: string;
  location: string;
  image: string;
  onPress: (eventId: string) => void;
};

const EventCard = ({ id, name, startDate, location, image, onPress }: EventCardProps) => {
  return (
    <TouchableOpacity onPress={() => onPress(id)} className="mb-4">
      <View className="relative h-60 overflow-hidden rounded-2xl border">
        <Image source={{ uri: image }} className="absolute h-full w-full" resizeMode="cover" />

        <Text className="absolute right-2 top-2 rounded-xl bg-black/50 px-3 py-2 backdrop-blur">
          <Text className="text-sm font-semibold text-solana-teal">{location}</Text>
        </Text>

        <LinearGradient
          colors={['transparent', 'rgba(11, 15, 25, 0.6)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ position: 'absolute', height: '100%', width: '100%' }}
        />

        <LinearGradient
          colors={['rgba(153, 69, 255, 0.05)', 'rgba(20, 241, 149, 0.20)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        <View className="absolute bottom-0 left-0 right-0 p-4">
          <Text numberOfLines={2} className="mb-0 text-2xl font-bold text-white">
            {name}
          </Text>
          <Text className="text-sm font-medium text-solana-teal">{startDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
