// src/components/LoginFooter.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const LoginFooter = React.memo(({ onNavigateToRegister }) => {
  return (
    <>
      <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.footer}>
        <Text style={styles.footerText}>ليس لديك حساب؟ </Text>
        <TouchableOpacity 
          onPress={onNavigateToRegister}
          activeOpacity={0.7}
        >
          <Text style={styles.registerLink}>إنشاء حساب</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
});

LoginFooter.displayName = 'LoginFooter';

export default LoginFooter;

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row-reverse",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    gap:2
  },
  footerText: {
    fontSize: 16,
    color: '#D1D5DB', // gray-300
  },
  registerLink: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

});