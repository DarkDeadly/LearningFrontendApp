import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetClassroomPupils } from '../../../../../../src/hooks/useClassroom';

function MainScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: pupilsEnrolled, isLoading } = useGetClassroomPupils(id);

  // ✅ Loading state (early return)
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // ✅ Always provide an array to FlatList
  const pupils = pupilsEnrolled?.pupils ?? [];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}
    onPress={() => console.log(item)}
    >
      {/* Manage Button */}
      <View style={styles.actionContainer}>
        <Text style={styles.actionText}>إدارة</Text>
        <Ionicons name="chevron-back" size={16} color="#3b82f6" />
      </View>

      {/* Student Info */}
      <View style={styles.cardContent}>
        <Text style={styles.studentName}>{item?.fullname ?? '—'}</Text>
        <Text style={styles.studentEmail}>{item?.email ?? ''}</Text>
      </View>

      {/* Avatar */}
      <LinearGradient
        colors={['#6366f1', '#a855f7']}
        style={styles.avatar}
      >
        <Text style={styles.avatarText}>
          {item?.fullname?.charAt(0)?.toUpperCase() ?? '?'}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>إدارة النقاط</Text>

          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerSubtitle}>
          عرض وإدارة سجلات علامات التلاميذ
        </Text>
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="البحث عن اسم التلميذ..."
            style={styles.searchInput}
            placeholderTextColor="#94a3b8"
          />
          <Ionicons name="search-outline" size={20} color="#64748b" />
        </View>
      </View>

      {/* List */}
      <View style={styles.content}>
        <View style={styles.listHeader}>
          <Text style={styles.studentCount}>
            {pupilsEnrolled?.counts ?? 0} تلاميذ
          </Text>
          <Text style={styles.listTitle}>القائمة الحالية</Text>
        </View>

        <FlatList
          data={pupils}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 40, color: '#64748b' }}>
              لا يوجد تلاميذ بعد
            </Text>
          }
        />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },

  headerSubtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 14,
  },

  headerIcon: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },

  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -28,
  },

  searchBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },

  searchInput: {
    flex: 1,
    textAlign: 'right',
    marginRight: 10,
    fontSize: 16,
    color: '#1e293b',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 24,
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },

  studentCount: {
    fontSize: 14,
    color: '#64748b',
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  cardContent: {
    flex: 1,
    marginRight: 16,
    alignItems: 'flex-end',
  },

  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },

  studentEmail: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },

  actionContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  actionText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 13,
    marginRight: 4,
  },
});
