import GlassCard from '@/components/common/GlassCard';
import { Heading } from '@/components/common/Heading';
import CreateEventModal, { CreateEventFormData } from '@/components/events/CreateEventModal';
import EventCard from '@/components/events/EventCard';
import EventModal from '@/components/events/EventModal';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, FlatList, TouchableOpacity } from 'react-native';
import ScreenBackground from '../../components/screen/ScreenBackground';

type Event = {
  id: string;
  name: string;
  startDate: string;
  location: string;
  locationURL: string;
  image: string;
  description: string;
  creatorName: string;
  nftEnabled: boolean;
  creatorPublicKey?: string;
};

const eventsData: Event[] = [
  {
    id: '1',
    name: 'Hackathon 2026',
    startDate: '12 March 2026',
    location: 'Delhi',
    locationURL: 'https://maps.google.com/?q=India+Gate+New+Delhi',
    image: 'https://picsum.photos/600/400?random=1',
    description:
      'Join us for an exciting 24-hour hackathon where developers, designers, and innovators come together to build the next big thing. Network with industry experts and showcase your skills!',
    creatorName: 'Superteam',
    nftEnabled: true,
  },
  {
    id: '2',
    name: 'Web3 Bootcamp',
    startDate: '28 February 2026',
    location: 'Mumbai',
    locationURL: 'https://maps.google.com/?q=Gateway+of+India+Mumbai',
    image: 'https://picsum.photos/600/400?random=2',
    description:
      'A comprehensive 4-week bootcamp covering blockchain basics, smart contracts, DeFi protocols, and hands-on development. Perfect for beginners to advanced developers.',
    creatorName: 'Blockchain Academy',
    nftEnabled: true,
  },
  {
    id: '3',
    name: 'AI Workshop',
    startDate: '5 January 2026',
    location: 'Pune',
    locationURL: 'https://maps.google.com/?q=Shaniwar+Wada+Pune',
    image: 'https://picsum.photos/600/400?random=3',
    description:
      'Explore the cutting edge of artificial intelligence with practical workshops on machine learning, neural networks, and real-world applications. Limited seats available!',
    creatorName: 'AI Labs',
    nftEnabled: false,
  },
  {
    id: '4',
    name: 'Solana Developer Summit',
    startDate: '15 April 2026',
    location: 'Ahemdabad',
    locationURL: 'https://maps.google.com/?q=Sabarmati+Riverfront+Ahmedabad',
    image: 'https://picsum.photos/600/400?random=4',
    description:
      'Meet Solana developers worldwide and learn about the latest tools, frameworks, and best practices. Includes technical talks and networking sessions.',
    creatorName: 'Solana Foundation',
    nftEnabled: true,
  },
  {
    id: '5',
    name: 'Design Thinking Masterclass',
    startDate: '22 March 2026',
    location: 'Noida',
    locationURL: 'https://maps.google.com/?q=Okhla+Bird+Sanctuary+Noida',
    image: 'https://picsum.photos/600/400?random=5',
    description:
      'Master the art of design thinking and user-centric development. Learn frameworks, methodologies, and tools used by leading companies.',
    creatorName: 'Design League',
    nftEnabled: false,
  },
];

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const handleCreateEvent = (data: CreateEventFormData) => {
    // TODO: API integration
    setCreateModalVisible(false);
    Alert.alert('Event Created', `"${data.name}" has been created!`);
  };

  const handleEventPress = (eventId: string) => {
    const event = eventsData.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setModalVisible(true);
    }
  };

  const handleEditEvent = (eventId: string) => {
    Alert.alert('Edit Event', `Edit event ${eventId} - API to be implemented`);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  return (
    <ScreenBackground>
      <Heading title="Events" />
      <FlatList
        data={eventsData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <EventCard
            id={item.id}
            name={item.name}
            startDate={item.startDate}
            location={item.location}
            image={item.image}
            onPress={handleEventPress}
          />
        )}
      />

      <TouchableOpacity
        onPress={() => setCreateModalVisible(true)}
        activeOpacity={0.85}
        className="absolute bottom-32 right-5 h-16 w-16 rounded-2xl"
        style={{
          shadowColor: '#9945FF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
          elevation: 8,
        }}>
        <GlassCard
          className="h-16 w-16 rounded-2xl"
          innerClassName="h-full items-center justify-center rounded-2xl">
          <Ionicons name="add" size={28} color="#fff" />
        </GlassCard>
      </TouchableOpacity>

      <EventModal
        visible={modalVisible}
        onClose={handleCloseModal}
        event={selectedEvent}
        onEdit={handleEditEvent}
        canEdit={false}
      />

      <CreateEventModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleCreateEvent}
      />
    </ScreenBackground>
  );
};

export default Events;
