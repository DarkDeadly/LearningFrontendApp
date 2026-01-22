import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useClassroomDetails } from '../../../../../src/hooks/useClassroom';
import { useGetCourses } from '../../../../../src/hooks/useCourse';

const ClassDetails = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { classid } = useLocalSearchParams();
    
    // Data Fetching
    const { data: classroom, isLoading: isClassLoading } = useClassroomDetails(classid);
    const { data: courses, isLoading: isCoursesLoading } = useGetCourses(classid);
    const courseContent = courses?.courses || [];

    // --- Components for FlatList ---

    const RenderHeader = () => (
        <View>
            <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.header}>
                <Text style={styles.classTitle}>{classroom?.name}</Text>
                {classroom?.description && (
                    <Text style={styles.classDesc}>{classroom.description}</Text>
                )}
                
                {/* Stats Row - Good for Portfolio Polish */}
                <View style={styles.statsRow}>
                    <View style={styles.statBadge}>
                        <Ionicons name="book" size={16} color="#fff" />
                        <Text style={styles.statText}>{courseContent.length} دروس</Text>
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>الدروس المتاحة</Text>
            </View>
        </View>
    );

    const RenderEmpty = () => (
        <View style={styles.emptyState}>
            <Ionicons name="journal-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>لم يتم إضافة دروس بعد</Text>
            <Text style={styles.emptyStateSubText}>سوف تظهر الدروس هنا فور إضافتها</Text>
        </View>
    );

    const RenderCourseItem = ({ item, index }) => (
        <Animated.View
            entering={FadeInUp.delay(index * 100).duration(500)}
        >
            <TouchableOpacity 
                style={styles.courseCard}
                onPress={() =>{
                    router.push(`(pupil)/(tabs)/class/${classid}/${item._id}`)
                }}
            >
                <View style={styles.courseIcon}>
                    <Ionicons name="play-circle" size={28} color="#6D28D9" />
                </View>
                <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle}>{item.title}</Text>
                    <Text style={styles.courseDesc} numberOfLines={2}>
                        {item.description}
                    </Text>
                </View>
                <Ionicons name="chevron-back" size={20} color="#C7C7CC" />
            </TouchableOpacity>
        </Animated.View>
    );

    // --- Main Render ---

    if (isClassLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <FlatList
                data={courseContent}
                renderItem={RenderCourseItem}
                keyExtractor={(item) => item._id.toString()}
                // This replaces the ScrollView:
                ListHeaderComponent={RenderHeader}
                ListEmptyComponent={isCoursesLoading ? <ActivityIndicator color="#8B5CF6" /> : RenderEmpty}
                // Proper padding at the bottom of the list
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { paddingBottom: 40 },
    header: {
        padding: 24,
        paddingBottom: 40,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        alignItems: 'center'
    },
    classTitle: { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
    classDesc: { fontSize: 15, color: '#E0D4FF', textAlign: 'center', opacity: 0.9, lineHeight: 22 },
    statsRow: { flexDirection: 'row', marginTop: 15 },
    statBadge: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'rgba(255,255,255,0.2)', 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 20 
    },
    statText: { color: '#fff', marginLeft: 6, fontSize: 13, fontWeight: '600' },
    sectionHeader: { padding: 20, paddingBottom: 10 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', textAlign: 'right' },
    courseCard: {
        flexDirection: 'row-reverse', // RTL Support
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    courseIcon: {
        backgroundColor: '#F5F3FF',
        borderRadius: 15,
        padding: 10,
        marginLeft: 16, // Spacing for RTL
    },
    courseInfo: { flex: 1 },
    courseTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', textAlign: 'right' },
    courseDesc: { fontSize: 13, color: '#6B7280', marginTop: 4, textAlign: 'right' },
    emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
    emptyStateText: { fontSize: 18, fontWeight: 'bold', color: '#4B5563', marginTop: 16 },
    emptyStateSubText: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 8 },
});

export default ClassDetails;