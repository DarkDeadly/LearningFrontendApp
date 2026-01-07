import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useClassroomDetails, useGetClassroomPupils } from '../../../../../src/hooks/useClassroom';
// Assume you have hooks for classroom data
// import { useClassroomDetail } from '../../../src/hooks/useClassroom';

const ClassroomContent = () => {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const {data} = useGetClassroomPupils(id)
  const {data : classroomDetails , isLoading} = useClassroomDetails(id)



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
          <Text style={styles.classTitle}>{classroomDetails?.name}</Text>
          {classroomDetails?.description &&<Text style={styles.classDesc}>{classroomDetails.description}</Text>}
          
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{data?.counts}</Text>
              <Text style={styles.statLabel}>تلميذ</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(teacher)/(tabs)/classes/points')}>
            <Ionicons name="trophy-outline" size={32} color="#8B5CF6" />
            <Text style={styles.actionText}>ادارة نقاط</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(teacher)/(tabs)/classes/courseAdd')}>
            <Ionicons name="book-outline" size={32} color="#F59E0B" />
            <Text style={styles.actionText}>إضافة دروس</Text>
          </TouchableOpacity>
        </View>
        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>النشاط الأخير</Text>
          <View style={styles.activityItem}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.activityText}>اكتمل درس "الجمع والطرح" - 28 تلميذ</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="star" size={24} color="#F59E0B" />
            <Text style={styles.activityText}>أحمد حصل على 50 نقطة!</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

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
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  activityItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, elevation: 2 },
  activityText: { marginLeft: 12, fontSize: 15, color: '#444', flex: 1 },
});

export default ClassroomContent;