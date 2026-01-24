import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetPupilPurchaseHistory } from '../../../../../../src/hooks/useRewards';

// --- Helper: Tunisian Arabic Formatting ---
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return {
    day: date.toLocaleDateString('ar-TN', { day: 'numeric', month: 'long' }),
    time: date.toLocaleTimeString('ar-TN', { hour: '2-digit', minute: '2-digit' }),
  };
};

const HistoryItem = ({ item, index }) => {
  const { day, time } = formatDateTime(item.createdAt);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={styles.historyCard}
    >
      <View style={styles.cardTop}>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsValue}>-{item.pointsSpent}</Text>
          <Text style={styles.pointsLabel}>نقطة</Text>
        </View>
        
        <View style={styles.rewardInfo}>
          <Text style={styles.rewardName}>{item.rewardName}</Text>
          <Text style={styles.dateTime}>{day} • {time}</Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardBottom}>
        <Text style={styles.refCode}>ID: {item._id.slice(-6).toUpperCase()}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>عملية مكتملة</Text>
          <Ionicons name="checkmark-circle" size={14} color="#00d1b2" />
        </View>
      </View>
    </Animated.View>
  );
};

const PupilHistory = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { classId, pupilId } = useLocalSearchParams();
  
  // Using your custom hook
  const { data: pupilHistory, isLoading } = useGetPupilPurchaseHistory(classId, pupilId);
  const historyData = pupilHistory?.history || [];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Visual Grabber for FormSheet */}
      <View style={styles.grabber} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          onPress={() => router.back()} 
          style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="close" size={24} color="#666" />
        </Pressable>
        
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerTitle}>سجل المشتريات</Text>
          <Text style={styles.headerSubtitle}>إجمالي العمليات: {pupilHistory?.count || 0}</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00d1b2" />
        </View>
      ) : (
        <FlatList
          data={historyData}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => <HistoryItem item={item} index={index} />}
          ListEmptyComponent={
            <Animated.View entering={FadeInUp} style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="receipt-outline" size={40} color="#333" />
              </View>
              <Text style={styles.emptyTitle}>السجل فارغ</Text>
              <Text style={styles.emptySubtitle}>لم يقم هذا التلميذ باستبدال أي نقاط بعد</Text>
            </Animated.View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  grabber: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextGroup: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: '#00d1b2',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  historyCard: {
    backgroundColor: '#161616',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardInfo: {
    alignItems: 'flex-end',
    flex: 1,
  },
  rewardName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  dateTime: {
    color: '#666',
    fontSize: 11,
    marginTop: 4,
  },
  pointsContainer: {
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 65,
  },
  pointsValue: {
    color: '#ff4d4d',
    fontSize: 16,
    fontWeight: '900',
  },
  pointsLabel: {
    color: '#ff4d4d',
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#222',
    marginVertical: 12,
    borderStyle: 'dashed',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 209, 178, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#00d1b2',
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 4,
  },
  refCode: {
    color: '#333',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: '#666',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
});

export default PupilHistory;