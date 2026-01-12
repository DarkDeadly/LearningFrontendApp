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
  const {selectClass} = useClassStore()
  const router = useRouter()
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
      if (status.playing) {
        player.pause();
      } else {
        player.play();
      }
    } else {
      setPlayingId(_id);
      player.replace({ uri: fileUrl });
      player.seekTo(0);
      player.play();
    }
  };

  const handleAddMaterial = () => {

    console.log('Add new material clicked!' , selectedCourse);
    router.push(`(teacher)/(tabs)/classes/${selectClass?._id}/${selectedCourse?._id}/MaterialAdd`)
  };

  if (!selectedCourse) {
    return (
      <LinearGradient colors={['#1e3a8a', '#3b82f6']} style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  const MaterialItem = memo(({ material }) => {
    const isCurrentlyPlaying = playingId === material._id;
    const progress =
      status.isLoaded && status.duration && isCurrentlyPlaying
        ? (status.currentTime / status.duration) * 100
        : 0;

    return (
      <Animated.View entering={FadeInDown.delay(200).duration(500)}>
        <TouchableOpacity
          style={styles.materialItem}
          onPress={() => playPauseSound(material)}
        >
          <View style={styles.playIconContainer}>
            {isCurrentlyPlaying && status.playing ? (
              <Ionicons name="pause-circle" size={40} color="#fff" />
            ) : (
              <Ionicons name="play-circle" size={40} color="#fff" />
            )}
          </View>
          <View style={styles.materialInfo}>
            <Text style={styles.materialTitle}>{material.title}</Text>
            <Text style={styles.materialDuration}>
              {formatDuration(material.duration || status.duration || 0)}
            </Text>
          </View>
        </TouchableOpacity>

        {isCurrentlyPlaying && status.isLoaded && (
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        )}
      </Animated.View>
    );
  });

  return (
    <LinearGradient colors={['#1e3a8a', '#3b82f6', '#ffffff']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Lovely Header */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.courseTitle}>{selectedCourse.title}</Text>
            <Text style={styles.courseDescription}>
              {selectedCourse.description || 'Discover amazing lessons and materials'}
            </Text>

            {/* Add Material Button */}
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={handleAddMaterial}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.addButtonText}>محتوى الدرس</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Materials List */}
        <View style={styles.materialsSection}>
          <Text style={styles.materialsHeader}>
            محتوى الدرس ({selectedCourse.materialCount || selectedCourse.materials?.length || 0})
          </Text>

          {selectedCourse.materials?.map((material) => (
            <MaterialItem key={material._id} material={material} />
          ))}

          {(!selectedCourse.materials || selectedCourse.materials.length === 0) && (
            <Text style={styles.emptyText}>No materials yet. Add your first one!</Text>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },

  // ── Lovely Header ──
  headerContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    
  },
  headerContent: {
    padding: 24,
    paddingBottom: 28,
  },
  courseTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  courseDescription: {
    fontSize: 16,
    color: '#e0e7ff',
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.95,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },

  // ── Materials Section ──
  materialsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    padding: 16,
    marginTop: 8,
  },
  materialsHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  playIconContainer: { marginRight: 16 },
  materialInfo: { flex: 1 },
  materialTitle: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '600',
  },
  materialDuration: {
    fontSize: 13,
    color: '#c7d2fe',
    marginTop: 4,
  },
  progressBarContainer: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    marginTop: 8,
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#a5b4fc',
    borderRadius: 3,
  },
  emptyText: {
    color: '#c7d2fe',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 40,
    opacity: 0.8,
  },
});

export default CourseScreen;