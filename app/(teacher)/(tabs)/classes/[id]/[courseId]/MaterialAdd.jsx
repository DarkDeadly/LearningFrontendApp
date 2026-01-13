import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  View,
} from 'react-native';
import { useMaterial } from '../../../../../../src/hooks/useMaterial';

const MaterialAdd = () => {
  const { id : classroomId, courseId } = useLocalSearchParams();
  const { createMaterial, isCreating } = useMaterial(courseId, classroomId);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const router = useRouter();
  console.log(classroomId)
  const pickDocument = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*', // Restrict to audio to match backend filter
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document.');
    }
  }, []);

  const handleCreateMaterial = () => {
   if (!title.trim() || !file) return;

  const formData = new FormData();
  formData.append('title', title);

  // CRITICAL: Construct the file object manually
  const fileToUpload = {
    // Android needs the raw URI, iOS usually needs 'file://' removed
    uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
    name: file.name || 'audio.mp3',
    type: file.mimeType || 'audio/mpeg',
  };

  // We append it as 'file' to match your backend: uploadAudio.single('file')
  formData.append('file', fileToUpload );

  createMaterial({ title, file: fileToUpload },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Material created successfully!');
          router.push(`(teacher)/(tabs)/classes/${classroomId}`)
        },
        onError: (error) => {
          const serverMsg = error?.response?.data?.message;
          Alert.alert('Error', serverMsg || 'Failed to create material.');
        },
      }
    );
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>Add New Material</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Material Title"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={title}
              onChangeText={setTitle}
              editable={!isCreating}
            />
          </View>

          <TouchableOpacity 
            style={[styles.filePickerButton, isCreating && styles.disabledButton]} 
            onPress={pickDocument}
            disabled={isCreating}
          >
            <Ionicons name="mic" size={24} color="#fff" />
            <Text style={styles.filePickerButtonText}>{file ? 'Change Audio' : 'Select Audio'}</Text>
          </TouchableOpacity>

          {file && (
            <View style={styles.filePreview}>
              <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
              <TouchableOpacity onPress={() => setFile(null)} disabled={isCreating}>
                <Ionicons name="close-circle" size={24} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.createButton, (isCreating || !file || !title.trim()) && styles.disabledButton]}
            onPress={handleCreateMaterial}
            disabled={isCreating || !file || !title.trim()}
          >
            {isCreating ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Upload Material</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default MaterialAdd;

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 24 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 32 },
  inputContainer: { backgroundColor: 'rgba(255, 255, 255, 0.18)', borderRadius: 12, marginBottom: 20, paddingHorizontal: 16, height: 54, justifyContent: 'center' },
  input: { color: '#fff', fontSize: 16 },
  filePickerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d6efd', paddingVertical: 16, borderRadius: 12, marginBottom: 16 },
  filePickerButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 10 },
  filePreview: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.12)', padding: 12, borderRadius: 10, marginBottom: 24 },
  fileName: { flex: 1, color: '#fff', fontSize: 15, marginLeft: 10 },
  createButton: { backgroundColor: '#198754', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  createButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#6c757d', opacity: 0.7 },
});