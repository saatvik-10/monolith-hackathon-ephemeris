import GlassCard from '@/components/common/GlassCard';
import { Heading } from '@/components/common/Heading';
import CreateEventModal from '@/components/events/CreateEventModal';
import EventCard from '@/components/events/EventCard';
import EventModal from '@/components/events/EventModal';
import QRDisplayModal from '@/components/events/QRDisplayModal';
import QRScannerModal from '@/components/events/QRScannerModal';
import { useWalletStore } from '@/components/store/walletStore';
import { createEvent } from '@/lib/api';
import { CreateEventFormData } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, FlatList, TouchableOpacity } from 'react-native';
import ScreenBackground from '../../components/screen/ScreenBackground';

type Event = {
  id: string;
  name: string;
  startDate: string;
  startTime: string;
  endTime: string;
  location: string;
  locationURL: string;
  image: string;
  description: string;
  creatorName: string;
  nftEnabled: boolean;
  organizerWallet?: string;
};

const eventsData: Event[] = [
  {
    id: '1',
    name: 'Hackathon 2026',
    startDate: '12 March 2026',
    startTime: '2026-03-12T09:00:00.000Z',
    endTime: '2026-03-12T21:00:00.000Z',
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
    startTime: '2026-02-28T10:00:00.000Z',
    endTime: '2026-02-28T18:00:00.000Z',
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
    startTime: '2026-01-05T10:00:00.000Z',
    endTime: '2026-01-05T16:00:00.000Z',
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
    startTime: '2026-04-15T09:00:00.000Z',
    endTime: '2026-04-15T18:00:00.000Z',
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
    startTime: '2026-03-22T10:00:00.000Z',
    endTime: '2026-03-22T17:00:00.000Z',
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
  const [events, setEvents] = useState<Event[]>(eventsData);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [qrDisplayEvent, setQrDisplayEvent] = useState<Event | null>(null);
  const [qrScanEventId, setQrScanEventId] = useState<string | null>(null);
  const { pubkey } = useWalletStore();

  const isCreator = !!(
    pubkey &&
    selectedEvent?.organizerWallet &&
    pubkey === selectedEvent.organizerWallet
  );

  const handleCreateEvent = async (data: CreateEventFormData) => {
    try {
      if (!pubkey) {
        Alert.alert('Error', 'Please connect your wallet first');
        return;
      }
      const payload: CreateEventFormData = {
        name: data.name,
        image: data.image,
        startTime: data.startTime,
        endTime: data.endTime,
        nftEnabled: data.nftEnabled,
        startDate: data.startDate,
        location: data.location,
        locationURL: data.locationURL,
        description: data.description,
        organizerName: data.organizerName,
        organizerWallet: pubkey,
      };
      const newEvent = await createEvent(payload);
      setEvents((prev) => [
        ...prev,
        {
          id: newEvent.id,
          name: newEvent.name,
          startDate: newEvent.startDate,
          startTime: newEvent.startTime,
          endTime: newEvent.endTime,
          location: newEvent.location,
          locationURL: newEvent.locationURL,
          image: newEvent.image,
          description: newEvent.description,
          creatorName: newEvent.organizerName,
          nftEnabled: newEvent.nftEnabled,
          organizerWallet: newEvent.organizerWallet,
        },
      ]);
      setCreateModalVisible(false);
      Alert.alert('Event Created', `"${data.name}" has been created!`);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to create event');
    }
  };

  const handleEventPress = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setModalVisible(true);
    }
  };

  const handleViewQR = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) setQrDisplayEvent(event);
  };

  const handleScanQR = (eventId: string) => {
    setQrScanEventId(eventId);
  };

  const handleQRScanned = (eventId: string, qrData: string) => {
    setQrScanEventId(null);
    // TODO: API integration — submit attendance with qrData + pubkey
    Alert.alert('Attendance Recorded', `Scanned: ${qrData}`);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  return (
    <ScreenBackground>
      <Heading title="Events" />
      <FlatList
        data={events}
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
        onViewQR={handleViewQR}
        onScanQR={handleScanQR}
        canEdit={isCreator}
      />

      <CreateEventModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleCreateEvent}
      />
      <QRDisplayModal
        visible={!!qrDisplayEvent}
        event={qrDisplayEvent}
        onClose={() => setQrDisplayEvent(null)}
      />

      <QRScannerModal
        visible={!!qrScanEventId}
        eventId={qrScanEventId}
        onClose={() => setQrScanEventId(null)}
        onScanned={handleQRScanned}
      />
    </ScreenBackground>
  );
};

export default Events;
