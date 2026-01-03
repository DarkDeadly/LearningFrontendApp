// app/(auth)/Login.js
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import LoginFooter from '../../src/components/loginScreen/LoginFooter';
import LoginForm from '../../src/components/loginScreen/LoginForm';
import LoginHeader from '../../src/components/loginScreen/LoginHeader';
import { useLogin } from '../../src/hooks/useAuth';
import { getLoginErrors } from '../../src/util/dataValidation';

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const loginMutation = useLogin();
  

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});



  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleLogin = useCallback(async () => {
    // Client-side validation
    const validationErrors = getLoginErrors(
      formData.email, 
      formData.password
    );
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const result = await loginMutation.mutateAsync({ 
        email: formData.email, 
        password: formData.password 
      });
      
      console.log('✅ Login successful:', result);
      
      
    } catch (error) {
      console.error('❌ Login error:', error);
      
      const errorMessage = error.response?.data?.message 
        || 'حدث خطأ في تسجيل الدخول';
      
      Alert.alert('خطأ', errorMessage);
    }
  }, [formData, loginMutation, router]);

  const navigateToRegister = useCallback(() => {
    router.push('/(auth)/Register');
  }, [router]);




  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/anime-train-station-with-vending-machine-sunlight.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            "transparent", 
            "rgba(0,0,0,0.3)", 
            "rgba(0,0,0,0.7)", 
            "#000000"
          ]}
          locations={[0, 0.2, 0.6, 1]}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar style="light" translucent backgroundColor="transparent" />
            
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={insets.top}
              style={styles.keyboardView}
              enabled
            >
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                bounces={false}
              >
                
                {/* Header */}
                <LoginHeader />

                {/* Form */}
                <LoginForm 
                  formData={formData}
                  errors={errors}
                  onFieldChange={handleFieldChange}
                  onSubmit={handleLogin}
                  isLoading={loginMutation.isPending}
                />

                {/* Footer */}
                <LoginFooter 
                  onNavigateToRegister={navigateToRegister}
                />

              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

// ========================================
// STYLES
// ========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 112, // mt-28 equivalent
    paddingBottom: 48, // py-12 equivalent
  },
});