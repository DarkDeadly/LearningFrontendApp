import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCreateCourse } from "../../../../../src/hooks/useCourse";

// Animated components
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function AddCourseScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id: classroomId } = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, isPending, isSuccess } = useCreateCourse();

  const isDisabled = !title.trim() || !description.trim() || isPending;

  const handleCreateCourse = () => {
    if (isDisabled) return;
    mutate({ title, description, classroomId });
  };

  useEffect(() => {
    if (isSuccess) {
      router.back();
    }
  }, [isSuccess, router]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
          <AnimatedText
            entering={FadeInUp.delay(200).duration(500)}
            style={styles.title}
          >
            إضافة دورة
          </AnimatedText>
          <AnimatedText
            entering={FadeInUp.delay(300).duration(500)}
            style={styles.subtitle}
          >
            أنشئ دورة جديدة لقسمك الدراسي
          </AnimatedText>

          <AnimatedView
            entering={FadeInUp.delay(400).duration(500)}
            style={styles.card}
          >
            <Text style={styles.label}>عنوان الدورة</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="مثال: أساسيات الجبر"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              textAlign="right"
            />

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
                  {isPending ? "جارٍ الإنشاء..." : "إنشاء الدورة"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </AnimatedView>
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