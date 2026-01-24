import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  LinearTransition
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetClassRewards } from '../../../../../src/hooks/useRewards';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-TN', {
    day: 'numeric',
    month: 'long',
  });
};

const RewardItem = ({ item, index }) => (
  <Animated.View
    entering={FadeInDown.delay(index * 100).springify()}
    layout={LinearTransition}
    style={styles.rewardCard}
  >
    <View style={styles.rewardInfo}>
      <Text style={styles.rewardName}>{item.name}</Text>
      <Text style={styles.rewardDate}>تنتهي في {formatDate(item.expiresAt)}</Text>
    </View>
    <View style={styles.costBadge}>
      <Text style={styles.costText}>{item.cost}</Text>
      <Text style={styles.pointsLabel}>نقطة</Text>
    </View>
  </Animated.View>
);

export default function RewardsListScreen() {
  const insets = useSafeAreaInsets();
  const { classId } = useLocalSearchParams();
  const router = useRouter();
  const { data: Rewards, isLoading } = useGetClassRewards(classId);

  return (
    <View style={styles.container}>
      {/* 1. Static Header Section */}
      <View style={[styles.headerArea, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>إدارة المكافآت</Text>
        <Text style={styles.subtitle}>تسيير جوائز القسم وتحفيز التلاميذ</Text>

        {/* 2. Your Suggested Button: Pupil History */}
        <Pressable 
          style={styles.historyFullButton}
          onPress={() => router.push(`(teacher)/(tabs)/rewards/${classId}/PupilHistory`)}
        >
          <LinearGradient
            colors={['#1a1a1a', '#262626']}
            style={styles.historyGradient}
          >
            <Ionicons name="chevron-back" size={18} color="#00d1b2" />
            <View style={styles.historyTextContainer}>
              <Text style={styles.historyTitle}>سجل مشتريات التلاميذ</Text>
              <Text style={styles.historySub}>عرض المكافآت التي تم استبدالها</Text>
            </View>
            <View style={styles.historyIconCircle}>
              <Ionicons name="people" size={20} color="#00d1b2" />
            </View>
          </LinearGradient>
        </Pressable>
      </View>

      {/* 3. Section Divider & Add Reward Button */}
      <View style={styles.sectionRow}>
        <Pressable 
          style={styles.addButton}
          onPress={() => router.push(`(teacher)/(tabs)/rewards/${classId}/Addrewards`)}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>إضافة مكافأة</Text>
        </Pressable>
        <Text style={styles.sectionLabel}>المكافآت المتوفرة</Text>
      </View>

      {/* 4. Rewards List */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00d1b2" />
        </View>
      ) : (
        <FlatList
          data={Rewards?.reward || []}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => <RewardItem item={item} index={index} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="gift-outline" size={50} color="#333" />
              <Text style={styles.emptyText}>قائمة المكافآت فارغة</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  headerArea: { paddingHorizontal: 20, paddingBottom: 10 },
  title: { fontSize: 32, fontWeight: '900', color: '#fff', textAlign: 'right' },
  subtitle: { fontSize: 16, color: '#888', textAlign: 'right', marginTop: 5 },
  
  // History Button Styles
  historyFullButton: { marginTop: 25, borderRadius: 20, overflow: 'hidden', elevation: 3 },
  historyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  historyTextContainer: { flex: 1, alignItems: 'flex-end', paddingRight: 15 },
  historyTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  historySub: { color: '#666', fontSize: 12, marginTop: 2 },
  historyIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 209, 178, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Section Row Styles
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 15
  },
  sectionLabel: { color: '#fff', fontSize: 18, fontWeight: '700' },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#00d1b2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center'
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 5, fontSize: 13 },

  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  rewardCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262626'
  },
  rewardInfo: { flex: 1, alignItems: 'flex-end', paddingRight: 15 },
  rewardName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  rewardDate: { color: '#555', fontSize: 12, marginTop: 4 },
  costBadge: {
    backgroundColor: 'rgba(0, 209, 178, 0.05)',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 70
  },
  costText: { color: '#00d1b2', fontSize: 20, fontWeight: '900' },
  pointsLabel: { color: '#00d1b2', fontSize: 9, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#444', fontSize: 16, marginTop: 10 }
});