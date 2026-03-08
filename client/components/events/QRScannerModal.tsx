import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type QRScannerModalProps = {
  visible: boolean;
  eventId: string | null;
  onClose: () => void;
  onScanned: (eventId: string, qrData: string) => void;
};

const QRScannerModal = ({ visible, eventId, onClose, onScanned }: QRScannerModalProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scannedRef = useRef(false);

  useEffect(() => {
    if (visible) {
      setScanned(false);
      scannedRef.current = false;
    }
  }, [visible]);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scannedRef.current || !eventId) return;
    scannedRef.current = true;
    setScanned(true);
    onScanned(eventId, data);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#0B0F19' }}>
        <BlurView tint="dark" intensity={80} style={styles.header}>
          <LinearGradient
            colors={['rgba(19,17,28,0.95)', 'rgba(11,15,25,0.9)']}
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity
            onPress={onClose}
            className="h-9 w-9 items-center justify-center rounded-full bg-solana-text/10">
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-bold text-solana-text">
            Scan QR Code
          </Text>
          <View className="w-9" />
        </BlurView>

        {!permission?.granted ? (
          <View className="flex-1 items-center justify-center gap-4 px-8">
            <Ionicons name="camera-outline" size={48} color="#6B7280" />
            <Text className="text-center text-base text-solana-muted">
              Camera access is needed to scan QR codes
            </Text>
            <TouchableOpacity onPress={requestPermission} className="overflow-hidden rounded-xl">
              <LinearGradient
                colors={['#9945FF', '#14F195']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="px-6 py-3">
                <Text className="font-bold text-solana-text">Grant Permission</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <CameraView
              style={{ flex: 1 }}
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            />

            <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
              <View className="flex-1 bg-solana-dark/60" />
              <View className="flex-row">
                <View className="flex-1 bg-solana-dark/60" />
                <View style={styles.cutout}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
                <View className="flex-1 bg-solana-dark/60" />
              </View>
              <View className="flex-1 bg-solana-dark/60" />
            </View>

            <View className="absolute bottom-16 w-full items-center">
              <BlurView
                tint="dark"
                intensity={60}
                className="overflow-hidden rounded-2xl px-5 py-3">
                <Text className="text-sm text-solana-text">
                  {scanned ? '✓ QR Scanned!' : 'Point camera at the event QR code'}
                </Text>
              </BlurView>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const CUTOUT = 240;
const CORNER = 20;
const BORDER = 3;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  cutout: {
    width: CUTOUT,
    height: CUTOUT,
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: '#14F195',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: BORDER,
    borderLeftWidth: BORDER,
    borderTopLeftRadius: 6,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: BORDER,
    borderRightWidth: BORDER,
    borderTopRightRadius: 6,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: BORDER,
    borderLeftWidth: BORDER,
    borderBottomLeftRadius: 6,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: BORDER,
    borderRightWidth: BORDER,
    borderBottomRightRadius: 6,
  },
});

export default QRScannerModal;
