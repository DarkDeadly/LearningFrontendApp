import { Ionicons } from '@expo/vector-icons';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { memo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetCourse } from '../../../../../../src/hooks/useCourse';

const formatDuration = (ms) => {
    if (isNaN(ms) || ms < 0) return '00:00';
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const CourseScreen = () => {
    const { classid, courseid } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { data, isLoading } = useGetCourse(classid, courseid);

    const courseInfo = data?.course;
    const materialsList = data?.materials || [];

    const player = useAudioPlayer(null , { updateInterval: 1200000 });
    const status = useAudioPlayerStatus(player);
    const [playingId, setPlayingId] = useState(null);

    useEffect(() => {
        setAudioModeAsync({
            playsInSilentModeIOS: true,
            shouldPlayInBackground: true,
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

    const MaterialItem = memo(({ material }) => {
        const isCurrentlyPlaying = playingId === material._id;
        const progress = status.duration > 0 && isCurrentlyPlaying
            ? (status.currentTime / status.duration) * 100
            : 0;

        return (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.materialWrapper}>
                <TouchableOpacity 
                    activeOpacity={0.8}
                    style={[styles.materialItem, isCurrentlyPlaying && styles.activeMaterialItem]} 
                    onPress={() => playPauseSound(material)}
                >
                    <View style={styles.materialInfo}>
                        <Text style={[styles.materialTitle, isCurrentlyPlaying && styles.activeText]}>
                            {material.title}
                        </Text>
                        <Text style={styles.materialDuration}>
                            {isCurrentlyPlaying 
                                ? `${formatDuration(status.currentTime)} / ${formatDuration(status.duration || material.duration * 1000)}` 
                                : `مدة الدرس: ${formatDuration(material.duration * 1000)}`}
                        </Text>
                    </View>
                    
                    <View style={[styles.playIconContainer, isCurrentlyPlaying && styles.activeIconContainer]}>
                        <Ionicons 
                            name={isCurrentlyPlaying && status.playing ? "pause" : "play"} 
                            size={24} 
                            color={isCurrentlyPlaying ? "#fff" : "#8B5CF6"} 
                        />
                    </View>
                </TouchableOpacity>

                {isCurrentlyPlaying && (
                    <View style={styles.progressTrack}>
                        <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
                    </View>
                )}
            </Animated.View>
        );
    });

    if (isLoading && !courseInfo) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                </TouchableOpacity>
                <Animated.Text entering={FadeInUp.delay(200)} style={styles.courseTitle}>
                    {courseInfo?.title}
                </Animated.Text>
                <Text style={styles.courseDescription}>
                    {courseInfo?.description || 'استمع إلى محتوى الدرس وتابع تقدمك'}
                </Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.materialsHeaderRow}>
                    <Text style={styles.materialsHeader}>الدروس الصوتية</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{materialsList.length}</Text>
                    </View>
                </View>

                {materialsList.map((item) => (
                    <MaterialItem key={item._id} material={item} />
                ))}

                {materialsList.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="headset-outline" size={50} color="#CBD5E1" />
                        <Text style={styles.emptyText}>لا توجد ملفات صوتية متاحة حالياً</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingHorizontal: 25, paddingBottom: 40, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
    backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 15, alignSelf: 'flex-start' },
    courseTitle: { fontSize: 26, fontWeight: '900', color: '#fff', textAlign: 'right' },
    courseDescription: { fontSize: 14, color: '#E0D4FF', textAlign: 'right', marginTop: 10, lineHeight: 22 },
    scrollContent: { padding: 20 },
    materialsHeaderRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 20, gap: 10 },
    materialsHeader: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
    badge: { backgroundColor: '#8B5CF6', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10 },
    badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    materialWrapper: { marginBottom: 15 },
    materialItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    activeMaterialItem: { borderColor: '#8B5CF6', backgroundColor: '#F5F3FF' },
    materialInfo: { flex: 1, marginRight: 15 },
    materialTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', textAlign: 'right' },
    activeText: { color: '#8B5CF6' },
    materialDuration: { fontSize: 12, color: '#94A3B8', marginTop: 4, textAlign: 'right' },
    playIconContainer: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' },
    activeIconContainer: { backgroundColor: '#8B5CF6' },
    progressTrack: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, marginTop: -4, marginHorizontal: 20, overflow: 'hidden' },
    progressBar: { height: '100%', backgroundColor: '#8B5CF6' },
    emptyState: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: '#94A3B8', fontSize: 15, marginTop: 10 }
});

export default CourseScreen;