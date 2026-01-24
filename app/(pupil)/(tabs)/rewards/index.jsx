import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    LinearTransition
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetAllClassrooms } from '../../../../src/hooks/useClassroom';

// Professional gradient pairs for the UI
const GRADIENT_PALETTE = [
  ['#8B5CF6', '#6D28D9'], // Violet
  ['#3B82F6', '#1D4ED8'], // Blue
  ['#EC4899', '#BE185D'], // Pink
  ['#10B981', '#047857'], // Emerald
];

const ClassCard = ({ item, index, onPress }) => {
  // Pick a color from the palette based on index
  const cardColors = GRADIENT_PALETTE[index % GRADIENT_PALETTE.length];

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 120).springify().mass(0.8)}
      itemLayoutAnimation={LinearTransition.springify()}
    >
      <TouchableOpacity 
        activeOpacity={0.85} 
        style={styles.classCard}
        onPress={onPress}
      >
        <LinearGradient
          colors={cardColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            {/* Icon Section */}
            <View style={styles.iconCircle}>
              <Ionicons name="school" size={22} color={cardColors[0]} />
            </View>

            {/* Text Section - Flexible for full name display */}
            <View style={styles.textContainer}>
              <Text style={styles.className}>
                {item.name}
              </Text>
              <Text style={styles.teacherName}>
                {item.teacherId?.fullname || 'معلم الفصل'}
              </Text>
            </View>
          </View>
          
          {/* Action Badge */}
         
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ClassSelectionScreen = () => {
  const insets = useSafeAreaInsets();
  const { data: classroomData, isLoading } = useGetAllClassrooms();
  const router = useRouter()


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Sleek Professional Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#5B21B6', '#8B5CF6']}
          style={[styles.headerGradient, { paddingTop: insets.top + 20 }]}
        >
          <Animated.View entering={FadeInUp.duration(700)}>
            <Text style={styles.headerTitle}>انضم إلى فصلك الدراسي</Text>
            <Text style={styles.headerSubtitle}>
              اختر فصلك الآن لتكتشف عالم المكافآت والجوائز الحصرية المتاحة لك
            </Text>
          </Animated.View>
          
          <View style={styles.accentCircle} />
        </LinearGradient>
      </View>

      <FlatList
        data={classroomData}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <ClassCard 
            item={item} 
            index={index} 
            onPress={() => router.push(`(pupil)/(tabs)/rewards/${item._id}`) } 
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          !isLoading && (
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>لا توجد فصول دراسية متاحة حالياً</Text>
            </View>
          )
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFF' },
  headerContainer: {
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    overflow: 'hidden',
    backgroundColor: '#5B21B6',
    elevation: 20,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  headerGradient: {
    paddingHorizontal: 28,
    paddingBottom: 50,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#F5F3FF',
    textAlign: 'right',
    marginTop: 10,
    lineHeight: 24,
    opacity: 0.85,
  },
  accentCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -80,
    left: -80,
  },
  listContent: {
    padding: 20,
    paddingTop: 35,
  },
  classCard: {
    marginBottom: 20,
    borderRadius: 28,
    backgroundColor: '#FFF',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cardGradient: {
    padding: 22,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 28,
    minHeight: 110, // Ensures consistency even if text is 1 line
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  textContainer: {
    alignItems: 'flex-end',
    flex: 1,
    paddingLeft: 10, // Prevents text from touching the join badge
  },
  className: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
    lineHeight: 25, // Better spacing for multi-line Arabic text
  },
  teacherName: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 4,
  },
  joinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'center', // Keeps badge vertically centered when text expands
  },
  joinText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 10,
    color: '#94A3B8',
    fontSize: 16,
  }
});

export default ClassSelectionScreen;