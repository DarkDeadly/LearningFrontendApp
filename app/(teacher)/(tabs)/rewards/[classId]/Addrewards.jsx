import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useCreateReward } from '../../../../../src/hooks/useRewards';

const AddRewards = () => {
  const { classId: classroomId } = useLocalSearchParams();
  const router = useRouter();
  const { mutate: createReward, isPending } = useCreateReward();

  const [form, setForm] = useState({
    name: '',
    cost: '',
    // Logic: Current date + 7 days
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
  });

  const handleCreate = () => {
    if (!form.name || !form.cost) return;

    createReward({
      classroomId,
      payload: {
        name: form.name,
        cost: Number(form.cost),
        expiresAt: form.expiresAt.toISOString(),
      }
    }, {
      onSuccess: () => {
        // Smooth navigation back to the list
        router.back();
      },
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Animated.View 
        entering={FadeInUp.duration(400).springify()} 
        style={styles.formContainer}
      >
        {/* Header Section */}
        <View style={styles.textGroup}>
          <Text style={styles.title}>إضافة مكافأة جديدة</Text>
          <Text style={styles.subtitle}>حدد تفاصيل الجائزة التي سيحصل عليها طلابك</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>اسم المكافأة</Text>
          <TextInput
            style={styles.input}
            placeholder="مثلاً: حصة إضافية، شكولاتة..."
            placeholderTextColor="#666"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>التكلفة (نقاط)</Text>
          <TextInput
            style={styles.input}
            placeholder="100"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={form.cost}
            onChangeText={(text) => setForm({ ...form, cost: text })}
          />
        </View>

        {/* The Expiration Note - Highly important for UX */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#00d1b2" />
          <Text style={styles.infoText}>
            ملاحظة: هذه المكافأة ستنتهي صلاحيتها تلقائياً بعد أسبوع واحد من تاريخ اليوم.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.button, 
            (!form.name || !form.cost) && styles.buttonDisabled
          ]} 
          onPress={handleCreate}
          disabled={isPending || !form.name || !form.cost}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>حفظ ونشر المكافأة</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', 
    padding: 24,
  },
  formContainer: {
    flex: 1,
  },
  textGroup: {
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 6,
    textAlign: 'right',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#00d1b2',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'right',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#2d3436',
    borderRadius: 16,
    padding: 18,
    color: '#fff',
    fontSize: 16,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: '#3d4446',
  },
  infoBox: {
    backgroundColor: 'rgba(0, 209, 178, 0.08)',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 209, 178, 0.2)',
  },
  infoText: {
    color: '#00d1b2',
    fontSize: 13,
    textAlign: 'right',
    flex: 1,
    marginRight: 12,
    lineHeight: 20,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#00d1b2',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: Platform.OS === 'ios' ? 10 : 20,
    shadowColor: '#00d1b2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#3d4446',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddRewards;