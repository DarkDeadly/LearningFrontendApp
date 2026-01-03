// app/(auth)/Register.js
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

import RegisterFooter from '../../src/components/RegisterFooter';
import RegisterForm from '../../src/components/RegisterForm';
import RegisterHeader from '../../src/components/RegisterHeader';
import { useRegister } from '../../src/hooks/useAuth';
import { getRegisterErrors } from '../../src/util/dataValidation';

export default function Register() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const registerMutation = useRegister();
  
  // ========================================
  // STATE
  // ========================================
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  // ========================================
  // HANDLERS
  // ========================================
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

  const handleRegister = useCallback(async () => {
    // Client-side validation
    const validationErrors = getRegisterErrors(
      formData.fullname, 
      formData.email, 
      formData.password, 
      formData.confirmPassword
    );
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const result = await registerMutation.mutateAsync({ 
        fullname: formData.fullname, 
        email: formData.email, 
        password: formData.password 
      });
      
      console.log('✅ Registration successful:', result);
      
     
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      const errorMessage = error.response?.data?.message 
        || 'حدث خطأ في إنشاء الحساب';
      
      Alert.alert('خطأ', errorMessage);
    }
  }, [formData, registerMutation, router]);

  const navigateToLogin = useCallback(() => {
    router.push('/(auth)/Login');
  }, [router]);

  const navigateBack = useCallback(() => {
    router.back();
  }, [router]);

  // ========================================
  // RENDER
  // ========================================
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
            "rgba(0,0,0,0.4)", 
            "rgba(0,0,0,0.8)", 
            "#000000"
          ]}
          locations={[0, 0.3, 0.7, 1]}
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
                <RegisterHeader />

                {/* Form */}
                <RegisterForm 
                  formData={formData}
                  errors={errors}
                  onFieldChange={handleFieldChange}
                  onSubmit={handleRegister}
                  isLoading={registerMutation.isPending}
                />

                {/* Footer */}
                <RegisterFooter 
                  onNavigateToLogin={navigateToLogin}
                  onNavigateBack={navigateBack}
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
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent:"center"
  },
});