// app/(pupil)/(tabs)/profile/index.tsx  (or wherever your ProfileScreen is)

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCurrentUser, useLogout } from '../../../src/hooks/useAuth'; // ← your auth hooks

const ProfileScreen = () => {
  const { data: user, isLoading, isError, error, refetch } = useCurrentUser();
  const logoutMutation = useLogout();
  // FIX: Removed console.log from production code

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد أنك تريد تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'خروج',
          style: 'destructive',
          onPress: () => logoutMutation.mutate(),
        },
      ]
    );
  };

  // FIX: Added loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  // FIX: Added error state with retry
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#E74C3C" />
        <Text style={styles.errorTitle}>حدث خطأ في تحميل الملف الشخصي</Text>
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

  if (!user) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Blue Header with Avatar */}
      <LinearGradient colors={['#4A90E2', '#2171BE']} style={styles.header}>
        <Text style={styles.headerTitle}>ملفي الشخصي</Text>

        {/* Anime Avatar - Replace with your asset or user's avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../../assets/images/studentIcon.jpeg')} // Your anime avatar
            style={styles.avatar}
          />
        </View>

        <Text style={styles.name}>{user.fullname}</Text>
      </LinearGradient>

      {/* Points Card */}
      <View style={styles.pointsCard}>
        <Text style={styles.pointsLabel}>نقاطك الحالية</Text>
        <View style={styles.pointsRow}>
          <Text style={styles.points}>{user.pointBalance || 0}</Text>
          <Text style={styles.coinEmoji}>🪙</Text>
        </View>
        <Text style={styles.pointsMessage}>
          استمر في التعلم واجمع المزيد من النقاط
        </Text>
      </View>

      {/* Email Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>البريد الإلكتروني</Text>
        <View style={styles.emailBox}>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      {/* Achievement Badge (Optional) */}
      <View style={styles.achievementBadge}>
        <Text style={styles.achievementText}>
          🎉 نصيحة: حافظ على بيانات حسابك آمنة وحذفها بشكل دوري
        </Text>
      </View>

      {/* Buttons - FIX: Removed non-functional save button */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.logoutButton,
            logoutMutation.isPending && styles.logoutButtonDisabled,
          ]}
          onPress={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>
            {logoutMutation.isPending ? 'جاري الخروج...' : 'تسجيل الخروج'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  // FIX: Added centered container for loading and error states
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
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
  },
  retryButton: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
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
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  pointsCard: {
    margin: 20,

    backgroundColor: '#2171BE',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  pointsLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  points: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
  coinEmoji: {
    fontSize: 40,
  },
  pointsMessage: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  emailBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  email: {
    fontSize: 16,
    color: '#333',
  },
  achievementBadge: {
    margin: 20,
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 15,
    color: '#B8860B',
    marginLeft: 10,
  },
  buttonsContainer: {
    margin: 20,
    marginBottom: 40,
  },
  // FIX: Removed saveButton styles (non-functional button removed)
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#E74C3C',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});