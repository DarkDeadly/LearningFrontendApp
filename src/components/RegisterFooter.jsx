import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'

const RegisterFooter = ({onNavigateToLogin}) => {
  return (
     <>
      <Animated.View entering={FadeInUp.delay(300)} style={styles.footer}>
        <Text style={styles.footerText}>لديك حساب بالفعل؟ </Text>
        <TouchableOpacity onPress={onNavigateToLogin}>
          <Text style={styles.loginLink}>سجل الدخول</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  )
}

export default RegisterFooter

const styles = StyleSheet.create({
     footer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap:2
  },
  footerText: {
    fontSize: 14,
    color: '#E5E7EB',
  },
  loginLink: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
})