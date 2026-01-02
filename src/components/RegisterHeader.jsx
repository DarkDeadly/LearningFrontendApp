import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const RegisterHeader = () => {
  return (
    <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
      <Text style={styles.title}>إنشاء حساب جديد</Text>
      <Text style={styles.subtitle}>انضم إلينا وابدأ رحلتك التعليمية</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
     header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    lineHeight: 24,
    textAlign: 'right',
  },
})

export default RegisterHeader

