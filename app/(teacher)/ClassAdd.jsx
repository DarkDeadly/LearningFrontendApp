import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../../src/components/Input";
import { useCreateClassroom } from '../../src/hooks/useClassroom';
import { validateCreateClassroom } from "../../src/util/classValidation";

const ClassAddModal = () => {
  const [formData, setFormData] = useState({ name: '', pin: '' });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const mutation = useCreateClassroom();

  const formFields = [
    {
      name: 'name',
      placeholder: "مثال: رياضيات الصف الخامس",
      icon: 'book-outline',
    },
    {
      name: 'pin',
      placeholder: '1234',
      icon: 'lock-closed-outline',
      keyboardType: 'numeric',
      maxLength: 4,
      secureTextEntry: true,
    },
  ];

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.header}>
            <Text style={styles.title}>إنشاء فصل جديد</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Form */}
          <View style={styles.form}>
            {formFields.map((field) => (
              <InputField
                key={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChangeText={(value) => handleFieldChange(field.name, value)}
                error={errors[field.name]}
                icon={field.icon}
                keyboardType={field.keyboardType}
                maxLength={field.maxLength}
                secureTextEntry={field.secureTextEntry}
                variant='light'
              />
            ))}

            <TouchableOpacity
              style={[styles.button, (!isFormValid || mutation.isPending) && styles.disabled]}
              onPress={handleAddition}
              disabled={!isFormValid || mutation.isPending}
            >
              <Text style={styles.buttonText}>
                {mutation.isPending ? 'جاري الإنشاء...' : 'إنشاء الفصل'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flexGrow: 1 },
  header: {
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  closeBtn: { padding: 10 },
  closeText: { color: '#fff', fontSize: 28 },
  form: { padding: 24, paddingTop: 30 },
  button: {
    backgroundColor: '#8B5CF6',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  disabled: { backgroundColor: '#aaa', opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default ClassAddModal;