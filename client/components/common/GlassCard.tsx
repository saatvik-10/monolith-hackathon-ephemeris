import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, innerClassName }) => {
  return (
    <View className={`overflow-hidden rounded-2xl p-px ${className ?? ''}`}>
      <LinearGradient
        colors={['rgba(153, 69, 255, 0.5)', 'rgba(20, 241, 149, 0.3)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View className={`rounded-[15px] bg-[rgba(19,17,28,0.75)] ${innerClassName ?? 'p-4'}`}>
        {children}
      </View>
    </View>
  );
};

export default GlassCard;
