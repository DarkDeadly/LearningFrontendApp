import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCurrentUser, useLogout } from '../../../src/hooks/useAuth'; // ← your auth hooks

const ProfileScreen = () => {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

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

  if (!user) return null; // Safety

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Blue Header with Avatar */}
      <LinearGradient colors={['#4A90E2', '#2171BE']} style={styles.header}>
        <Text style={styles.headerTitle}>ملفي الشخصي</Text>

        {/* Anime Avatar - Replace with your asset or user's avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../../assets/images/professor.png')} // Your anime avatar
            style={styles.avatar}
          />
        </View>

        <Text style={styles.name}>{user.fullname}</Text>
      </LinearGradient>

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

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Ionicons name="save-outline" size={24} color="#fff" />
          <Text style={styles.saveText}>حفظ التغييرات</Text>
        </TouchableOpacity>

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
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#2171BE',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
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