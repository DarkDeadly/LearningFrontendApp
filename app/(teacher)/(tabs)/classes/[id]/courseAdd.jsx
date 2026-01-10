import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddCourseScreen() {
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const isDisabled = !title.trim() || !description.trim() || loading;

  const handleCreateCourse = async () => {
    if (isDisabled) return;

    try {
      setLoading(true);

      // API CALL HERE
      // await createCourse(teacherId, classroomId, title, description);

    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* 🌈 Gradient Background */}
      <LinearGradient
        colors={["#EEF2FF", "#F6F7FB", "#FFFFFF"]}
        style={{ flex: 1 }}
      >
        <View
          style={[
            styles.container,
            {
              paddingTop: insets.top + 16,
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          <Text style={styles.title}>إضافة دورة</Text>
          <Text style={styles.subtitle}>
            أنشئ دورة جديدة لقسمك الدراسي
          </Text>

          <View style={styles.card}>
            {/* عنوان الدورة */}
            <Text style={styles.label}>عنوان الدورة</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="مثال: أساسيات الجبر"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              textAlign="right"
            />

            {/* وصف الدورة */}
            <Text style={styles.label}>الوصف</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="اكتب وصفًا مختصرًا عن محتوى الدورة"
              placeholderTextColor="#9CA3AF"
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
              textAlign="right"
            />

            {/* زر الإضافة مع Gradient */}
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isDisabled}
              onPress={handleCreateCourse}
              style={{ marginTop: 24 }}
            >
              <LinearGradient
                colors={
                  isDisabled
                    ? ["#9CA3AF", "#9CA3AF"]
                    : ["#2563EB", "#4F46E5"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>
                  {loading ? "جارٍ الإنشاء..." : "إنشاء الدورة"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    textAlign: "right",
  },

  subtitle: {
    marginTop: 4,
    marginBottom: 24,
    fontSize: 15,
    color: "#6B7280",
    textAlign: "right",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
    textAlign: "right",
  },

  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  textArea: {
    height: 120,
    textAlignVertical: "top",
  },

  gradientButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});