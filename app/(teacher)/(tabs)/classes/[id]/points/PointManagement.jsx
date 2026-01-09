// app/(teacher)/PointManagementScreen.jsx
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGivePoints, useReducePoints } from '../../../../../../src/hooks/usePoints';
import { usePupilStore } from '../../../../../../src/stores/PupilStore';

const PointManagementScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { selectedStudent } = usePupilStore();
  const addMutation = useGivePoints();
  const reduceMutation = useReducePoints();
  const [pointsInput, setPointsInput] = useState('');
  const [reason, setReason] = useState('');

  const handleAddPoints = useCallback(() => {
  const points = parseInt(pointsInput, 10);
 
  addMutation.mutate({
    amount: points,
    reason: reason.trim(),
    pupilId: selectedStudent._id,
    classroomId: selectedStudent.classroomId,
  },
{
        onSuccess: () => {
          Alert.alert('نجاح', `تم إضافة ${points} نقاط بنجاح`);
          setPointsInput('');
          setReason('');
          router.back();
        },
        onError: (error) => {
          const message = error?.response?.data?.message || 'حدث خطأ أثناء الإضافة';
          Alert.alert('خطأ', message);
        },
      });
}, [pointsInput, reason, selectedStudent, addMutation]);

const handleRemovePoints = useCallback(() => {
  const points = parseInt(pointsInput, 10);


  reduceMutation.mutate({
    amount: points,
    reason: reason.trim(),
    pupilId: selectedStudent._id,
    classroomId: selectedStudent.classroomId,
  },
  {
        onSuccess: () => {
          Alert.alert('نجاح', `تم خصم ${points} نقاط بنجاح`);
          setPointsInput('');
          setReason('');
          router.back();
        },
        onError: (error) => {
          const message = error?.response?.data?.message || 'حدث خطأ أثناء الخصم';
          Alert.alert('خطأ', message);
        },
      }
);
}, [pointsInput, reason, selectedStudent, reduceMutation]);
  const handleHistory = () => {
    router.push('/(teacher)/PointsHistory'); // Adjust if needed
  };

  if (!selectedStudent) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>جاري تحميل بيانات الطالب...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header Card */}
          <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.headerCard}>
            <Text style={styles.fullname}>{selectedStudent.fullname}</Text>
            <Text style={styles.email}>{selectedStudent.email}</Text>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>رصيد النقاط الحالي</Text>
              <Text style={styles.balance}>{selectedStudent.pointBalance ?? 0}</Text>
            </View>
          </LinearGradient>

          {/* Inputs Card */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>* عدد النقاط</Text>
            <TextInput
              style={styles.textInput}
              placeholder="أدخل عدد النقاط"
              keyboardType="numeric"
              value={pointsInput}
              onChangeText={setPointsInput}
              textAlign="right"
            />

            <Text style={[styles.inputLabel, styles.reasonLabel]}>* السبب</Text>
            <TextInput
              style={[styles.textInput, styles.reasonInput]}
              placeholder="اكتب سبب الإضافة أو الخصم"
              value={reason}
              onChangeText={setReason}
              textAlign="right"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.addButton, addMutation.isPending && styles.disabledButton]}
              onPress={handleAddPoints}
              disabled={addMutation.isPending}
            >
              {addMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>إضافة نقاط</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.removeButton, reduceMutation.isPending && styles.disabledButton]}
              onPress={handleRemovePoints}
              disabled={reduceMutation.isPending}
            >
              {reduceMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>خصم نقاط</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.historyButton} onPress={handleHistory}>
              <Text style={styles.buttonText}>سجل النقاط</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
  },
  headerCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  fullname: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#E0D4FF',
    marginBottom: 20,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 18,
    color: '#E0D4FF',
  },
  balance: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  inputLabel: {
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
    textAlign: 'right',
  },
  reasonLabel: {
    marginTop: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: 'right',
    backgroundColor: '#f9f9f9',
  },
  reasonInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  buttonsContainer: {
    gap: 16,
  },
  addButton: {
    backgroundColor: '#10B981',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#EF4444',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  historyButton: {
    backgroundColor: '#6366F1',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
  },
});

export default PointManagementScreen;