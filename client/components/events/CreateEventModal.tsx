import { CreateEventFormData } from '@/types';
import { formatDate } from '@/utils/lib';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useWalletStore } from '../store/walletStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type CreateEventModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEventFormData) => Promise<void>;
};

const INITIAL_FORM: CreateEventFormData = {
  name: '',
  startDate: '',
  startTime: '',
  description: '',
  endTime: '',
  location: '',
  locationURL: '',
  image: '',
  organizerName: '',
  organizerWallet: '',
  nftEnabled: false,
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <View className="mb-4">
    <Text className="mb-1.5 text-xs font-medium text-solana-muted">{label}</Text>
    {children}
  </View>
);

const inputStyle = {
  backgroundColor: 'rgba(255,255,255,0.06)',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.1)',
  color: '#E2E8F0',
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontSize: 14,
};

const CreateEventModal = ({ visible, onClose, onSubmit }: CreateEventModalProps) => {
  const [form, setForm] = useState<CreateEventFormData>(INITIAL_FORM);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState<Date>(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState<Date>(new Date());
  const [submitting, setSubmitting] = useState(false);
  const imageBase64Ref = React.useRef<string>('');
  const { pubkey } = useWalletStore();

  const set = (key: keyof CreateEventFormData) => (val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const formatPickedTime = (time: Date): string => {
    const h = time.getHours();
    const min = String(time.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${min} ${ampm}`;
  };

  const handleDateChange = (_: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      setForm((prev) => ({
        ...prev,
        startDate: formatDate(date),
      }));
    }
  };

  const handleStartTimeChange = (_: DateTimePickerEvent, time?: Date) => {
    setShowStartTimePicker(Platform.OS === 'ios');
    if (time) {
      setSelectedStartTime(time);
      setForm((prev) => ({ ...prev, startTime: formatPickedTime(time) }));
    }
  };

  const handleEndTimeChange = (_: DateTimePickerEvent, time?: Date) => {
    setShowEndTimePicker(Platform.OS === 'ios');
    if (time) {
      setSelectedEndTime(time);
      setForm((prev) => ({ ...prev, endTime: formatPickedTime(time) }));
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 2],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setForm((prev) => ({ ...prev, image: asset.uri }));
      imageBase64Ref.current = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
    }
  };

  const handleSubmit = async () => {
    if (
      !form.name.trim() ||
      !form.startDate.trim() ||
      !form.startTime.trim() ||
      !form.endTime.trim() ||
      !form.location.trim()
    )
      return;
    setSubmitting(true);
    try {
      await onSubmit({ ...form, image: imageBase64Ref.current || form.image });
      setForm(INITIAL_FORM);
      imageBase64Ref.current = '';
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    imageBase64Ref.current = '';
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <BlurView
            tint="dark"
            intensity={100}
            style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' }}>
            <LinearGradient
              colors={['rgba(19,17,28,0.98)', 'rgba(11,15,25,0.96)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />

            <ScrollView
              style={{ maxHeight: SCREEN_HEIGHT * 0.92 }}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View className="flex-row items-center justify-between py-5">
                <Text className="text-xl font-bold text-solana-text">Create Event</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  className="h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Ionicons name="close" size={20} color="#E2E8F0" />
                </TouchableOpacity>
              </View>

              <View className="mb-5 h-px bg-solana-muted/20" />

              <Field label="Event Name *">
                <TextInput
                  style={inputStyle}
                  placeholder="e.g. Solana Hackathon 2026"
                  placeholderTextColor="#6B7280"
                  value={form.name}
                  onChangeText={set('name')}
                />
              </Field>

              <Field label="Date *">
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={[
                    inputStyle,
                    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
                  ]}>
                  <Text style={{ color: form.startDate ? '#E2E8F0' : '#6B7280', fontSize: 14 }}>
                    {form.startDate || 'Select a date'}
                  </Text>
                  <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    themeVariant="dark"
                  />
                )}
              </Field>

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Field label="Start Time *">
                    <TouchableOpacity
                      onPress={() => setShowStartTimePicker(true)}
                      style={[
                        inputStyle,
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        },
                      ]}>
                      <Text style={{ color: form.startTime ? '#E2E8F0' : '#6B7280', fontSize: 14 }}>
                        {form.startTime || 'Select time'}
                      </Text>
                      <Ionicons name="time-outline" size={18} color="#6B7280" />
                    </TouchableOpacity>
                    {showStartTimePicker && (
                      <DateTimePicker
                        value={selectedStartTime}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleStartTimeChange}
                        themeVariant="dark"
                      />
                    )}
                  </Field>
                </View>
                <View className="flex-1">
                  <Field label="End Time *">
                    <TouchableOpacity
                      onPress={() => setShowEndTimePicker(true)}
                      style={[
                        inputStyle,
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        },
                      ]}>
                      <Text style={{ color: form.endTime ? '#E2E8F0' : '#6B7280', fontSize: 14 }}>
                        {form.endTime || 'Select time'}
                      </Text>
                      <Ionicons name="time-outline" size={18} color="#6B7280" />
                    </TouchableOpacity>
                    {showEndTimePicker && (
                      <DateTimePicker
                        value={selectedEndTime}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleEndTimeChange}
                        themeVariant="dark"
                      />
                    )}
                  </Field>
                </View>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Field label="Location *">
                    <TextInput
                      style={inputStyle}
                      placeholder="e.g. Delhi"
                      placeholderTextColor="#6B7280"
                      value={form.location}
                      onChangeText={set('location')}
                    />
                  </Field>
                </View>
                <View className="flex-1">
                  <Field label="Location URL">
                    <TextInput
                      style={inputStyle}
                      placeholder="https://maps..."
                      placeholderTextColor="#6B7280"
                      value={form.locationURL}
                      onChangeText={set('locationURL')}
                      autoCapitalize="none"
                      keyboardType="url"
                    />
                  </Field>
                </View>
              </View>

              <Field label="Organizer Name">
                <TextInput
                  style={inputStyle}
                  placeholder="e.g. Superteam India"
                  placeholderTextColor="#6B7280"
                  value={form.organizerName}
                  onChangeText={set('organizerName')}
                />
              </Field>

              <Field label="Cover Image">
                <TouchableOpacity
                  onPress={pickImage}
                  style={[
                    inputStyle,
                    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
                  ]}>
                  <Text
                    style={{ color: form.image ? '#E2E8F0' : '#6B7280', fontSize: 14, flex: 1 }}
                    numberOfLines={1}>
                    {form.image ? 'Image selected' : 'Tap to upload from device'}
                  </Text>
                  <Ionicons name="image-outline" size={18} color="#6B7280" />
                </TouchableOpacity>
                {form.image && (
                  <View className="mt-2 overflow-hidden rounded-xl">
                    <Image
                      source={{ uri: form.image }}
                      style={{ width: '100%', height: 120 }}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => setForm((prev) => ({ ...prev, image: '' }))}
                      className="absolute right-2 top-2 h-7 w-7 items-center justify-center rounded-full bg-black/60">
                      <Ionicons name="close" size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
              </Field>

              <Field label="Description">
                <TextInput
                  style={[inputStyle, { height: 90, textAlignVertical: 'top' }]}
                  placeholder="Tell people about your event..."
                  placeholderTextColor="#6B7280"
                  value={form.description}
                  onChangeText={set('description')}
                  multiline
                  numberOfLines={4}
                />
              </Field>

              <View className="mb-5 flex-row items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <View>
                  <Text className="text-sm font-semibold text-solana-text">NFT Certificate</Text>
                  <Text className="text-xs text-solana-muted">
                    Mint attendance NFT for attendees
                  </Text>
                </View>
                <Switch
                  value={form.nftEnabled}
                  onValueChange={set('nftEnabled')}
                  trackColor={{ false: 'rgba(107,114,128,0.3)', true: 'rgba(20,241,149,0.4)' }}
                  thumbColor={form.nftEnabled ? '#14F195' : '#E2E8F0'}
                />
              </View>

              <View className="mb-6 rounded-xl border border-solana-purple/30 bg-solana-purple/10 px-4 py-3">
                <Text className="mb-2 text-xs font-medium text-solana-muted">Organizer Wallet</Text>
                {pubkey ? (
                  <View className="flex-row items-center gap-2">
                    <View className="h-2 w-2 rounded-full bg-solana-teal" />
                    <Text
                      className="flex-1 text-sm text-solana-teal"
                      style={{ fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}
                      numberOfLines={1}
                      ellipsizeMode="middle">
                      {pubkey}
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-2">
                    <View className="h-2 w-2 rounded-full bg-solana-muted" />
                    <Text className="text-sm text-solana-muted">No wallet connected</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={submitting ? 1 : 0.85}
                disabled={submitting}
                className="overflow-hidden rounded-xl">
                <LinearGradient
                  colors={['#9945FF', '#14F195']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ opacity: submitting ? 0.7 : 1 }}
                  className="flex-row items-center justify-center gap-2 py-3.5">
                  {submitting ? (
                    <>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text className="text-base font-bold text-white">Creating...</Text>
                    </>
                  ) : (
                    <Text className="text-base font-bold text-white">Create Event</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </BlurView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CreateEventModal;
