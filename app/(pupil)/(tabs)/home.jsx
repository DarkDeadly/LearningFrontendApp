import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCurrentUser } from '../../../src/hooks/useAuth';
const cards = [
    {
      id : "course",
      icon: 'book-outline',
      title: 'دروسي',
      subtitle: 'اطلع على صفوفك المسجلة',
      color: '#4A90E2',
      route:'/class',
    },
    {
      id : "rewards",
      icon: 'gift-outline',
      title: 'المكافآت',
      subtitle: 'تحقق من مكافآتك ونقاطك',
      color: '#4A90E2',
      route : '/rewards',
    },
    {
      id : 'messages',
      icon: 'chatbubble-outline',
      title: 'الرسائل',
      subtitle: 'تواصل مع المعلمين والزملاء',
      color: '#4A90E2',
      route : '/messages',
    },
    {
      id : 'profile',
      icon: 'trophy-outline',
      title: 'نقاطي',
      subtitle: 'عرض نقاطك الحالية',
      color: '#4A90E2',
      route : '/profile',
    },
  ];
const HomeScreen = () => {
  const { data : user } = useCurrentUser();
  const router = useRouter();

  if (!user) return null;

  
  return (
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
            onPress={() => router.replace(card.route)}
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
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
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