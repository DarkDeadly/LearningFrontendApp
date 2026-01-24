import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";

import InputField from "../../src/components/Input";
import { useCreateClassroom } from '../../src/hooks/useClassroom';
import { validateCreateClassroom } from "../../src/util/classValidation";

const ClassAddModal = () => {
  const [formData, setFormData] = useState({ name: '', pin: '' });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const mutation = useCreateClassroom();

  const handleFieldChange = useCallback((field, value) => {
    let processedValue = value;
    if (field === 'pin') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 4);
    }
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleAddition = useCallback(() => {
    const validationErrors = validateCreateClassroom(formData.name.trim(), formData.pin);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    mutation.mutate(
      { name: formData.name.trim(), pin: formData.pin },
      {
        onSuccess: () => router.back(),
        onError: (error) => {
          const message = error.response?.data?.message || 'حدث خطأ أثناء إنشاء الفصل';
          Alert.alert('خطأ', message);
        },
      }
    );
  }, [formData, mutation, router]);

  const isFormValid = formData.name.trim().length > 0 && formData.pin.length === 4;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.headerBackground}>
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="close-outline" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>إنشاء فصل جديد</Text>
            <View style={styles.spacer} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexOne}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.duration(600)} style={styles.formContainer}>
            <Text style={styles.sectionLabel}>المعلومات الأساسية</Text>
            <InputField
              placeholder="مثال: رياضيات الصف الخامس"
              value={formData.name}
              onChangeText={(val) => handleFieldChange('name', val)}
              error={errors.name}
              icon="book-outline"
              variant="light"
            />

            <View style={styles.pinSection}>
              <Text style={styles.sectionLabel}>رمز الدخول (PIN)</Text>
              <Text style={styles.sectionDescription}>
                سيستخدم الطلاب هذا الرمز المكون من 4 أرقام للدخول إلى هذا الفصل.
              </Text>
              <InputField
                placeholder="1 2 3 4"
                value={formData.pin}
                onChangeText={(val) => handleFieldChange('pin', val)}
                error={errors.pin}
                icon="lock-closed-outline"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
                variant="light"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.mainButton, (!isFormValid || mutation.isPending) && styles.disabledButton]}
              onPress={handleAddition}
              disabled={!isFormValid || mutation.isPending}
            >
              <LinearGradient
                colors={isFormValid ? ['#8B5CF6', '#6D28D9'] : ['#CBD5E1', '#94A3B8']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {mutation.isPending ? 'جاري الإنشاء...' : 'تأكيد إنشاء الفصل'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  flexOne: { flex: 1 },
  headerBackground: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: { width: 40 },
  scrollContent: { padding: 24 },
  formContainer: { marginTop: 10 },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'right',
    marginBottom: 8,
    marginTop: 20,
  },
  sectionDescription: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'right',
    marginBottom: 12,
    lineHeight: 18,
  },
  pinSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  mainButton: {
    marginTop: 40,
    height: 60,
    borderRadius: 18,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default ClassAddModal;