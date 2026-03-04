import { View, Text, Image, TouchableOpacity } from 'react-native';
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
      <View className="relative h-64 overflow-hidden rounded-2xl">
        <Image source={{ uri: image }} className="absolute h-full w-full" resizeMode="cover" />

        <Text className="absolute right-2 top-2 rounded-xl bg-black/50 px-3 py-2 backdrop-blur">
          <Text className="text-sm font-semibold text-solana-teal">{location}</Text>
        </Text>

        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          className="absolute h-full w-full"
        />

        <View className="absolute bottom-0 left-0 right-0 p-4">
          <Text numberOfLines={2} className="mb-1 text-xl font-bold text-white">
            {name}
          </Text>
          <Text className="text-sm font-medium text-solana-teal">{startDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
