import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EmptyState from '../../../src/components/classTeacher/EmptyState';
import RenderClass from '../../../src/components/classTeacher/RenderClass';
import { useGetMyClassroom } from "../../../src/hooks/useClassroom";

const classScreen = () => {
  const {data : classrooms , isLoading } = useGetMyClassroom()
  console.log(classrooms)
  const router = useRouter()
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.header}>
        <Text style={styles.headerTitle}>فصولي الدراسية</Text>
        <Text style={styles.headerSubtitle}>إدارة فصولك وتلاميذك بسهولة</Text>

        {/* Floating + Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/(teacher)/ClassAdd")}
        >
          <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.fabGradient}>
            <Text style={styles.fabText}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>جاري تحميل الفصول...</Text>
        </View>
      ) : classrooms.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={classrooms}
          renderItem={({ item }) => <RenderClass item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

export default classScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E0D4FF',
    marginTop: 8,
    textAlign: 'right',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: -30,
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 10,
  },
  fabGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  }
})