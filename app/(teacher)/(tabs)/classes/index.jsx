import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Internal Imports
import EmptyState from '../../../../src/components/classTeacher/EmptyState';
import RenderClass from '../../../../src/components/classTeacher/RenderClass';
import { useGetMyClassroom } from "../../../../src/hooks/useClassroom";

const ClassScreen = () => {
  const { data: classrooms, isLoading } = useGetMyClassroom();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Ensures status bar icons are white */}
      <StatusBar barStyle="light-content" />

      {/* --- HEADER SECTION --- */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#8B5CF6', '#6D28D9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
        >
          <Animated.View 
            entering={FadeInRight.duration(600).springify()}
            style={styles.headerContent}
          >
            <Text style={styles.headerTitle}>فصولي الدراسية</Text>
            <Text style={styles.headerSubtitle}>إدارة فصولك وتلاميذك بسهولة</Text>
          </Animated.View>

          {/* Floating + Button (FAB) */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.fab}
            onPress={() => router.push("/(teacher)/ClassAdd")}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.fabGradient}
            >
              <Text style={styles.fabText}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* --- CONTENT SECTION --- */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingText}>جاري تحميل الفصول...</Text>
          </View>
        ) : classrooms?.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={classrooms}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInUp.delay(index * 100).duration(500)}>
                <RenderClass item={item} />
              </Animated.View>
            )}
            keyExtractor={(item) => item.id || item._id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default ClassScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Professional off-white/slate
  },
  headerContainer: {
    zIndex: 10,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 25,
    paddingBottom: 55,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    alignItems: 'flex-end', // Arabic alignment
    // Shadow for Header Depth
    shadowColor: "#6D28D9",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  headerContent: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 6,
    textAlign: 'right',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: -32, // Perfect overlap on the curved edge
    width: 64,
    height: 64,
    borderRadius: 20, // Modern "Squircle"
    overflow: 'hidden',
    // Glowing Shadow for FAB
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },
  fabGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 34,
    color: '#fff',
    fontWeight: '300',
    marginTop: -4, // Optical centering
  },
  content: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '600',
  },
  list: {
    padding: 20,
    paddingTop: 30, // Extra room for the FAB overlap
    paddingBottom: 100,
  }
});