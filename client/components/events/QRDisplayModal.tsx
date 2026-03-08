import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Modal, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

type QRDisplayModalProps = {
  visible: boolean;
  event: { id: string; name: string } | null;
  onClose: () => void;
};

const QRDisplayModal = ({ visible, event, onClose }: QRDisplayModalProps) => {
  if (!event) return null;

  const qrValue = `ephemeris:attend:${event.id}`;

  const handleShare = () => {
    Share.share({ message: `Attend "${event.name}" — QR: ${qrValue}` });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end">
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
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}>
            <View className="flex-row items-center justify-between py-5">
              <View>
                <Text className="text-xl font-bold text-solana-text">Event QR Code</Text>
                <Text className="mt-0.5 text-sm text-solana-muted">{event.name}</Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="h-9 w-9 items-center justify-center rounded-full bg-solana-text/10">
                <Ionicons name="close" size={20} color="#E2E8F0" />
              </TouchableOpacity>
            </View>

            <View className="mb-1 h-px bg-solana-text/10" />

            <View className="my-8 items-center">
              <View
                className="overflow-hidden rounded-3xl bg-solana-text p-5"
                style={{
                  shadowColor: '#14F195',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.4,
                  shadowRadius: 20,
                  elevation: 12,
                }}>
                <QRCode value={qrValue} size={200} color="#0B0F19" backgroundColor="white" />
              </View>
            </View>

            <View className="mb-6 rounded-xl border border-solana-text/10 bg-solana-text/5 px-4 py-3">
              <Text className="mb-1 text-xs text-solana-muted">QR Value</Text>
              <Text
                className="text-sm text-solana-teal"
                style={{ fontFamily: 'monospace' }}
                numberOfLines={2}>
                {qrValue}
              </Text>
            </View>

            <View className="mb-4 rounded-xl border border-solana-purple/20 bg-solana-purple/10 px-4 py-3">
              <View className="flex-row items-start gap-2">
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#9945FF"
                  style={{ marginTop: 1 }}
                />
                <Text className="flex-1 text-sm text-solana-muted">
                  Show this QR code to attendees. They scan it with Ephemeris to record attendance.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleShare}
              activeOpacity={0.85}
              className="overflow-hidden rounded-xl">
              <LinearGradient
                colors={['#9945FF', '#14F195']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row items-center justify-center gap-2 py-3.5">
                <Ionicons name="share-outline" size={18} color="white" />
                <Text className="text-base font-bold text-white">Share QR</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </View>
    </Modal>
  );
};

export default QRDisplayModal;
