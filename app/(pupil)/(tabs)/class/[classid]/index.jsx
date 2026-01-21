import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useClassroomDetails } from '../../../../../src/hooks/useClassroom';
import { useGetCourses } from '../../../../../src/hooks/useCourse';

const ClassDetails = () => {
    const insets = useSafeAreaInsets();
    const { classid } = useLocalSearchParams()
    const { data: classroom, isLoading } = useClassroomDetails(classid)
    const { data: courses, isLoading: isCoursesLoading } = useGetCourses(classid);
    const courseContent = courses?.courses

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Header */}
                <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.header}>
                    <Text style={styles.classTitle}>{classroom?.name}</Text>
                    {classroom?.description && <Text style={styles.classDesc}>{classroom.description}</Text>}
                </LinearGradient>

                {/* Courses Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>الدروس</Text>
                    {isCoursesLoading ? (
                        <ActivityIndicator size="large" color="#8B5CF6" style={{ marginTop: 20 }} />
                    ) : (
                        <FlatList
                            data={courseContent}
                            renderItem={({ item: course, index }) => (
                                <Animated.View
                                    key={course?._id}
                                    entering={FadeInUp.delay(index * 150).duration(400)}
                                >
                                    <TouchableOpacity style={styles.courseCard}
                                        onPress={() => {
                                            console.log(course)
                                        }}
                                    >
                                        <View style={styles.courseIcon}>
                                            <Ionicons name="book-outline" size={24} color="#6D28D9" />
                                        </View>
                                        <View style={styles.courseInfo}>
                                            <Text style={styles.courseTitle}>{course.title}</Text>
                                            <Text style={styles.courseDesc} numberOfLines={2}>{course.description}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            )}
                            keyExtractor={(item) => item._id.toString()}
                            ListEmptyComponent={
                                <View style={styles.emptyState}>
                                    <Ionicons name="journal-outline" size={48} color="#D1D5DB" />
                                    <Text style={styles.emptyStateText}>لم يتم إضافة دروس بعد</Text>
                                    <Text style={styles.emptyStateSubText}>سوف تظهر الدروس هنا فور إضافتها من قبل المعلم</Text>
                                </View>
                            }
                            scrollEnabled={false} // Disable FlatList scrolling as it's inside a ScrollView
                        />
                    )}
                </View>

            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        padding: 24,
        paddingTop: 40,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    classTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 12 },
    classDesc: { fontSize: 16, color: '#E0D4FF', textAlign: 'center', marginBottom: 24 },
    statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 24 },
    statCard: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 16, borderRadius: 16, alignItems: 'center', minWidth: 100 },
    statNumber: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    statLabel: { fontSize: 14, color: '#E0D4FF', marginTop: 4 },
    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 20, gap: 16, justifyContent: 'center' },
    actionCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, alignItems: 'center', width: '42%', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
    actionText: { marginTop: 12, fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' },
    section: { padding: 20, paddingTop: 0 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginVertical: 16, textAlign: 'right' },
    courseCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#4F46E5',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        alignItems: 'center',
    },
    courseIcon: {
        backgroundColor: '#EDE9FE',
        borderRadius: 999,
        padding: 12,
        marginRight: 16,
    },
    courseInfo: {
        flex: 1,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'right',
    },
    courseDesc: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
        textAlign: 'right',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4B5563',
    },
    emptyStateSubText: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 8,
    },
});

export default ClassDetails;
