import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetClassroomPupils } from '../../../../../src/hooks/useClassroom';

// --- Sub-Component: Pupil Card ---
const PupilCard = ({ pupil, index, onPress }) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      style={styles.cardContainer}
    >
      <Pressable 
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} 
        onPress={onPress}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {pupil.fullname.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.fullname}>{pupil.fullname}</Text>
          <Text style={styles.email}>{pupil.email}</Text>
        </View>

        <View style={styles.pointsContainer}>
          <Text style={styles.pointsValue}>{pupil.pointBalance}</Text>
          <Text style={styles.pointsLabel}>نقطة</Text>
        </View>

      </Pressable>
    </Animated.View>
  );
};

// --- Main Screen Component ---
const PupilHistory = () => {
  const { classId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: response, isLoading } = useGetClassroomPupils(classId);
  const pupilsList = response?.pupils || [];

  // Optimized Search Logic
  const filteredPupils = useMemo(() => {
    return pupilsList.filter((p) =>
      p.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, pupilsList]);

  if (isLoading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color="#00d1b2" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>قائمة التلاميذ</Text>
            <Text style={styles.headerSubtitle}>{pupilsList.length} تلميذ مسجل</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            placeholder="البحث عن تلميذ..."
            placeholderTextColor="#666"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
          />
        </View>

        {/* User Hint / Helper Note */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()} 
          style={styles.infoNote}
        >
          <Ionicons name="information-circle-outline" size={18} color="#00d1b2" />
          <Text style={styles.infoNoteText}>
            اضغط على اسم التلميذ لعرض سجل المشتريات والمكافآت الخاصة به.
          </Text>
        </Animated.View>
      </View>

      {/* Pupils List */}
      <FlatList
        data={filteredPupils}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <PupilCard 
            pupil={item} 
            index={index} 
            onPress={() => router.push(`(teacher)/(tabs)/rewards/${classId}/${item._id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={80} color="#222" />
            <Text style={styles.emptyText}>لم يتم العثور على تلاميذ</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0f0f0f' 
  },
  loadingCenter: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#0f0f0f' 
  },
  header: { 
    paddingHorizontal: 20, 
    paddingBottom: 20 
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 20 
  },
  headerTitleContainer: { 
    alignItems: 'flex-end' 
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#fff' 
  },
  headerSubtitle: { 
    fontSize: 14, 
    color: '#00d1b2', 
    fontWeight: '600' 
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: '#1a1a1a',
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 55,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: { 
    marginLeft: 10 
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  infoNote: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 209, 178, 0.05)',
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 209, 178, 0.1)',
  },
  infoNoteText: {
    color: '#00d1b2',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
    textAlign: 'right',
    flex: 1,
  },
  listContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 40 
  },
  cardContainer: { 
    marginBottom: 12 
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 22,
    padding: 15,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262626',
  },
  cardPressed: { 
    backgroundColor: '#222' 
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#00d1b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  avatarText: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  infoContainer: { 
    flex: 1, 
    alignItems: 'flex-end' 
  },
  fullname: { 
    color: '#fff', 
    fontSize: 17, 
    fontWeight: '700' 
  },
  email: { 
    color: '#666', 
    fontSize: 12, 
    marginTop: 2 
  },
  pointsContainer: {
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(0, 209, 178, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pointsValue: { 
    color: '#00d1b2', 
    fontSize: 18, 
    fontWeight: '900' 
  },
  pointsLabel: { 
    color: '#00d1b2', 
    fontSize: 9, 
    fontWeight: 'bold' 
  },
  emptyState: { 
    alignItems: 'center', 
    marginTop: 100 
  },
  emptyText: { 
    color: '#444', 
    fontSize: 18, 
    marginTop: 20, 
    fontWeight: '600' 
  }
});

export default PupilHistory;