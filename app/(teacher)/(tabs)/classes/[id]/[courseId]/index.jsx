import { Ionicons } from '@expo/vector-icons';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { memo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useGetCourse } from '../../../../../../src/hooks/useCourse';
import { useClassStore } from '../../../../../../src/stores/classStore';
import { useCourseStore } from '../../../../../../src/stores/courseStore';

const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const CourseScreen = () => {
  const { selectedCourse } = useCourseStore();
  const { selectClass } = useClassStore();
  const router = useRouter();

  const { data, isLoading } = useGetCourse(selectClass?._id, selectedCourse?._id);

  // Safely extract info
  const courseInfo = data?.course || selectedCourse;
  const materialsList = data?.materials || [];

  const player = useAudioPlayer(null, { updateInterval: 1200000 }); // 1s is smooth enough
  const status = useAudioPlayerStatus(player);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldPlayInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      interruptionModeIOS: 'doNotMix',
      interruptionModeAndroid: 'doNotMix',
    }).catch(console.warn);
  }, []);

  const playPauseSound = (material) => {
    const { fileUrl, _id } = material;
    if (playingId === _id) {
      status.playing ? player.pause() : player.play();
    } else {
      setPlayingId(_id);
      player.replace({ uri: fileUrl });
      player.play();
    }
  };

  const handleAddMaterial = () => {
    router.push(`(teacher)/(tabs)/classes/${selectClass?._id}/${selectedCourse?._id}/MaterialAdd`);
  };

  const MaterialItem = memo(({ material }) => {
    const isCurrentlyPlaying = playingId === material._id;
    const progress = status.isLoaded && status.duration && isCurrentlyPlaying
        ? (status.currentTime / status.duration) * 100
        : 0;

    return (
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <TouchableOpacity style={styles.materialItem} onPress={() => playPauseSound(material)}>
          <View style={styles.playIconContainer}>
            <Ionicons 
              name={isCurrentlyPlaying && status.playing ? "pause-circle" : "play-circle"} 
              size={40} 
              color="#fff" 
            />
          </View>
          <View style={styles.materialInfo}>
            <Text style={styles.materialTitle}>{material.title}</Text>
            <Text style={styles.materialDuration}>
              {isCurrentlyPlaying && status.playing 
                ? `${formatDuration(status.currentTime / 1000)} / ${formatDuration(material.duration)}` 
                : formatDuration(material.duration)}
            </Text>
          </View>
        </TouchableOpacity>
        {isCurrentlyPlaying && (
          <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        )}
      </Animated.View>
    );
  });

  if (isLoading && !courseInfo) {
    return (
      <LinearGradient colors={['#1e3a8a', '#3b82f6']} style={styles.container}>
        <View style={styles.centered}>
            <ActivityIndicator size="large" color="#fff" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1e3a8a', '#3b82f6', '#1e3a8a']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.headerContainer}>
          <View style={styles.headerContent}>
            {/* Added Fallback text to ensure something always renders */}
            <Text style={styles.courseTitle}>
                {courseInfo?.title || "Loading Course..."}
            </Text>
            <Text style={styles.courseDescription}>
              {courseInfo?.description || 'Learn the basics of this course.'}
            </Text>

            <TouchableOpacity style={styles.addButton} onPress={handleAddMaterial}>
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.addButtonText}>إضافة محتوى</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Materials Section */}
        {isLoading ? <ActivityIndicator size={"large"} /> : <View style={styles.materialsSection}>
          <Text style={styles.materialsHeader}>
            محتوى الدرس ({materialsList.length})
          </Text>

          {materialsList.map((item) => (
            <MaterialItem key={item._id} material={item} />
          ))}

          {materialsList.length === 0 && !isLoading && (
            <Text style={styles.emptyText}>No materials found.</Text>
          )}
        </View>}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 100 }, // Added paddingTop for status bar spacing

  headerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Darker translucent background for better visibility
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: { padding: 24 },
  courseTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  courseDescription: {
    fontSize: 16,
    color: '#e0e7ff',
    lineHeight: 24,
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 5,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 10 },

  materialsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
  },
  materialsHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  playIconContainer: { marginRight: 16 },
  materialInfo: { flex: 1 },
  materialTitle: { fontSize: 17, color: '#fff', fontWeight: '600' },
  materialDuration: { fontSize: 13, color: '#c7d2fe', marginTop: 4 },
  progressBarContainer: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginTop: -8,
    marginBottom: 12,
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: '#a5b4fc' },
  emptyText: { color: '#c7d2fe', fontSize: 16, textAlign: 'center', paddingVertical: 40 },
});

export default CourseScreen;