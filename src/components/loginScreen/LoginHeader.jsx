// src/components/LoginHeader.js
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const LoginHeader = React.memo(() => {
  return (
    <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
      <Text style={styles.title}>حان وقت التعلّم</Text>
      <Text style={styles.subtitle}>
        قم بتسجيل الدخول لتواصل مغامرتك المعرفية.
      </Text>
    </Animated.View>
  );
});

LoginHeader.displayName = 'LoginHeader';

export default LoginHeader;

const styles = StyleSheet.create({
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 42,
    textAlign: 'right',
    letterSpacing: 1.5,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
  },
  subtitle: {
    fontSize: 20,
    color: '#D1D5DB', // gray-300
    lineHeight: 28,
    textAlign: 'right',
  },
});