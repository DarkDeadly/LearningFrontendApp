import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RenderClass from '../../../../src/components/classStudent/RenderClass';
import EmptyState from '../../../../src/components/classTeacher/EmptyState';
import { useGetAllClassrooms } from '../../../../src/hooks/useClassroom';

const ClassScreen = () => {
  const { data, isLoading, isError, error, refetch } = useGetAllClassrooms();
  const insets = useSafeAreaInsets();

  // FIX: Added loading state
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>جاري تحميل الاقسام المتاحة...</Text>
      </View>
    );
  }

  // FIX: Added error state with retry
  if (isError) {
    return (
      <View style={styles.loading}>
        <Ionicons name="alert-circle-outline" size={64} color="#E74C3C" />
        <Text style={styles.errorTitle}>حدث خطأ في تحميل الاقسام</Text>
        <Text style={styles.errorMessage}>
          {error?.response?.data?.message || 'يرجى المحاولة مرة أخرى'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refetch()}
        >
          <Ionicons name="refresh-outline" size={20} color="#fff" />
          <Text style={styles.retryText}>إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Animated.View entering={FadeInRight.duration(600)}>
          <Text style={styles.headerTitle}>استكشف اقسام</Text>
          <Text style={styles.headerSubtitle}>انضم إلى زملائك وابدأ رحلتك التعليمية اليوم</Text>
        </Animated.View>
      </LinearGradient>

      {data?.length === 0 ? (
        <EmptyState subtitle="لا توجد فصول متاحة حالياً" teacherValid={false} />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => <RenderClass item={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ClassScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 25, paddingBottom: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { fontSize: 30, fontWeight: '900', color: '#fff', textAlign: 'right' },
  headerSubtitle: { fontSize: 15, color: '#E0D4FF', marginTop: 8, textAlign: 'right', fontWeight: '500' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#94A3B8' },
  // FIX: Added error state styles
  errorTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  list: { padding: 20, paddingBottom: 40 }
});