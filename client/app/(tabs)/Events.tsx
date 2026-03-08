import GlassCard from '@/components/common/GlassCard';
import { Heading } from '@/components/common/Heading';
import CreateEventModal from '@/components/events/CreateEventModal';
import EventCard from '@/components/events/EventCard';
import EventModal from '@/components/events/EventModal';
import QRDisplayModal from '@/components/events/QRDisplayModal';
import QRScannerModal from '@/components/events/QRScannerModal';
import { useWalletStore } from '@/components/store/walletStore';
import { createEvent, getAllEvents, issueIdentity, markAttendance } from '@/lib/api';
import { CreateEventFormData, Event } from '@/types';
import { attendedEventsStorage } from '@/utils/attendance';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, FlatList, TouchableOpacity } from 'react-native';
import ScreenBackground from '../../components/screen/ScreenBackground';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [qrDisplayEvent, setQrDisplayEvent] = useState<Event | null>(null);
  const [qrScanEventId, setQrScanEventId] = useState<string | null>(null);
  const { pubkey } = useWalletStore();

  useEffect(() => {
    getAllEvents()
      .then(setEvents)
      .catch((err) => console.error('Failed to load events', err));
  }, []);

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
          image: newEvent.image,
          description: newEvent.description,
          startDate: newEvent.startDate,
          startTime: newEvent.startTime,
          endTime: newEvent.endTime,
          location: newEvent.location,
          locationURL: newEvent.locationURL,
          organizerName: newEvent.organizerName,
          organizerWallet: newEvent.organizerWallet,
          nftEnabled: newEvent.nftEnabled,
        },
      ]);
      setCreateModalVisible(false);
      Alert.alert('Event Created', `"${data.name}" has been created!`);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to create event');
    }
  };

  const handleEventPress = (eventId: string) => {
    const event = events?.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setModalVisible(true);
    }
  };

  const handleViewQR = (eventId: string) => {
    const event = events?.find((e) => e.id === eventId);
    if (event) setQrDisplayEvent(event);
  };

  const handleScanQR = (eventId: string) => {
    setQrScanEventId(eventId);
  };

  const handleQRScanned = async (eventId: string, qrData: string) => {
    setQrScanEventId(null);

    let scannedEventId = eventId;

    const attendMatch = qrData.match(/\/attend\/([a-zA-Z0-9_-]+)/);
    if (attendMatch) {
      scannedEventId = attendMatch[1];
    } else if (qrData.startsWith('ephemeris:attend:')) {
      scannedEventId = qrData.replace('ephemeris:attend:', '');
    }

    try {
      const identityRes = await issueIdentity(scannedEventId);
      await markAttendance();

      const event = events.find((e) => e.id === scannedEventId);
      if (event) {
        await attendedEventsStorage.add({
          eventId: event.id,
          name: event.name,
          image: event.image,
          startDate: event.startDate,
          nftEnabled: event.nftEnabled,
          attendedAt: new Date().toISOString(),
          token: identityRes.token,
        });
      }

      Alert.alert('Attendance Recorded', 'Your attendance has been marked!');
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to mark attendance');
    }
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
