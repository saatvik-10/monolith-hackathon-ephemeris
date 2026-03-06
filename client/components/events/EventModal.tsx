import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../common/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

type EventModalProps = {
  visible: boolean;
  onClose: () => void;
  event: {
    id: string;
    name: string;
    image: string;
    description: string;
    startDate: string;
    location: string;
    locationURL: string
    creatorName: string;
    nftEnabled: boolean;
  } | null;
  onEdit?: (eventId: string) => void;
  canEdit?: boolean;
};

const EventModal = ({ visible, onClose, event, onEdit, canEdit = false }: EventModalProps) => {
  if (!event) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 rounded-t-3xl justify-end">
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 rounded-t-3xl overflow-hidden"
          contentContainerStyle={{ paddingBottom: 20 }}>
          <TouchableOpacity
            onPress={onClose}
            className="absolute right-4 top-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-gray-600"
          >
            <Ionicons name="close" size={22} color="white" />
          </TouchableOpacity>

          <View className="relative h-80 w-full">
            <Image source={{ uri: event.image }} className="h-full w-full" resizeMode="cover" />
            <LinearGradient
              colors={['transparent', 'rgba(11, 15, 25, 0.75)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              className="absolute h-full w-full"
            />
          </View>

          <BlurView className="inset-0 h-full px-4 " tint="dark" intensity={100}>
            <LinearGradient
              colors={['rgba(19, 17, 28, 1)', 'rgba(11, 15, 25, 0.75)', 'rgba(255, 255, 255, 0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View className="flex-row items-center justify-between">
              <Text className="my-4 text-2xl font-bold text-white">{event.name}</Text>
              {canEdit && onEdit && (
                <TouchableOpacity
                  onPress={() => {
                    onEdit(event.id);
                    onClose();
                  }}
                  className="mb-4 flex items-end rounded-xl">
                  <GlassCard>
                    <Text className="text-center text-sm font-bold text-white">Edit</Text>
                  </GlassCard>
                </TouchableOpacity>
              )}
            </View>

            <GlassCard className="mb-2">
              <View className="space-y-3">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="mb-1 text-xs text-white/60">Start Date</Text>
                    <Text className="text-base font-semibold text-solana-teal">
                      {event.startDate}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="mb-1 text-xs text-white/60">Location</Text>

                    <TouchableOpacity
                      onPress={() => Linking.openURL(event.locationURL)}
                      className="flex-row items-center"
                    >
                      <Text className="text-base font-semibold text-solana-teal underline">
                        {event.location}
                      </Text>

                      <Ionicons 
                        name="open-outline"
                        size={14}
                        color="#14F195"
                        style={{ marginLeft: 4 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex-row items-center border-t border-white/10 pt-2 mt-2">
                  <View className="flex-1">
                    <Text className="mb-1 text-xs text-white/60">Organizer</Text>
                    <Text className="text-base font-semibold text-white">{event.creatorName}</Text>
                  </View>
                  <View className="flex-1 items-end">
                    <Text className="mb-1 text-xs text-white/60">NFT Certificate</Text>
                    <Text
                      className={`text-base font-semibold ${
                        event.nftEnabled ? 'text-solana-teal' : 'text-solana-muted'
                      }`}>
                      {event.nftEnabled ? '✓ Enabled' : 'Disabled'}
                    </Text>
                  </View>
                </View>
              </View>
            </GlassCard>

            <GlassCard className="mb-6">
              <View>
                <Text className="mb-2 text-xs font-medium text-white/60">Description</Text>
                <Text className="text-base leading-5 text-white opacity-90">
                  {event.description}
                </Text>
              </View>
            </GlassCard>
          </BlurView>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default EventModal;
