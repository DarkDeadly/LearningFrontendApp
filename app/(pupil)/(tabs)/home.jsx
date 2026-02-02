import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCurrentUser } from '../../../src/hooks/useAuth';
import { useIsOnline } from '../../../src/hooks/useNetworkStatus';
const cards = [
  {
    id: "course",
    icon: 'book-outline',
    title: 'دروسي',
    subtitle: 'اطلع على صفوفك المسجلة',
    color: '#4A90E2',
    route: '/class',
  },
  {
    id: "rewards",
    icon: 'gift-outline',
    title: 'المكافآت',
    subtitle: 'تحقق من مكافآتك ونقاطك',
    color: '#4A90E2',
    route: '/rewards',
  },
  {
    id: 'messages',
    icon: 'chatbubble-outline',
    title: 'الرسائل',
    subtitle: 'تواصل مع المعلمين والزملاء',
    color: '#4A90E2',
    route: '/messages',
  },
  {
    id: 'profile',
    icon: 'trophy-outline',
    title: 'نقاطي',
    subtitle: 'عرض نقاطك الحالية',
    color: '#4A90E2',
    route: '/profile',
  },
];
const HomeScreen = () => {
  const { data: user, isLoading, isError, error, refetch } = useCurrentUser();
  const router = useRouter();
  const isOnline = useIsOnline();  // FIX: Added offline detection

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
        <Text style={styles.errorTitle}>حدث خطأ في تحميل البيانات</Text>
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
    <View style={{ flex: 1, backgroundColor: '#F0F4F8' }}>
      {/* FIX: Show offline banner when not connected */}
      {!isOnline && <OfflineBar />}

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header with Avatar */}
        <LinearGradient colors={['#4A90E2', '#2171BE']} style={styles.header}>
          <Text style={styles.welcomeText}>مرحباً بعودتك</Text>

          {/* Anime Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../../assets/images/studentIcon.jpeg')} // Your anime avatar
              style={styles.avatar}
            />
          </View>

          <Text style={styles.name}>{user.fullname}</Text>
        </LinearGradient>

        {/* Cards Grid */}
        <View style={styles.cardsGrid}>
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => router.push(card.route)}  // FIX: Changed to push for proper back navigation
              activeOpacity={0.8}
            >
              <LinearGradient colors={[card.color, '#1E6BB8']} style={styles.cardGradient}>
                <Ionicons name={card.icon} size={48} color="#fff" />
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  // FIX: Added centered container for loading and error states
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
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
    paddingBottom: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 5,
    borderColor: '#fff',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 20,
  },
  card: {
    width: '45%',
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 12,
  },
  cardGradient: {
    padding: 20,
    alignItems: 'center',
    height: 180,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#E0F2FF',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});