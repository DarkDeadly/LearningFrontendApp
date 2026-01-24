import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetMyClassroom } from '../../../../src/hooks/useClassroom';

const formatDateArabic = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-TN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};



const ClassCard = ({ item, index }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const router = useRouter()


  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withSpring(1);
  };

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify().damping(15)}
      layout={LinearTransition.springify()}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => router.push(`(teacher)/(tabs)/rewards/${item.id}`)}
      >
        <Animated.View style={[styles.card, animatedStyle]}>
          <LinearGradient
            colors={['#1a1a1a', '#2d3436']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.classLabel}>الفصل الدراسي</Text>
              <Text style={styles.className}>{item.name}</Text>
              
              <View style={styles.footer}>
                <View style={[styles.dot, { backgroundColor: item.isActive ? '#00d1b2' : '#ff3860' }]} />
                <Text style={styles.dateText}>
                  أُنشئ في {formatDateArabic(item.createdAt)}
                </Text>
              </View>
            </View>
            
           
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default function ClassSelection() {
  const insets = useSafeAreaInsets();
  const {data : classrooms , isLoading } = useGetMyClassroom()

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#00d1b2" />
        <Text style={[styles.dateText, { marginTop: 10 }]}>جاري تحميل الفصول...</Text>
      </View>
    );
  }


  return (
    <View style={[styles.container, { 
      paddingTop: insets.top, 
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right 
    }]}>
      <View style={styles.header}>
        <Text style={styles.title}>لوحة التحكم</Text>
        <Text style={styles.subtitle}>اختر فصلاً دراسياً لإنشاء المكافآت</Text>
      </View>

      <FlatList
        data={classrooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => <ClassCard item={item} index={index} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    padding: 24,
    marginBottom: 8,
    alignItems: 'flex-end', // لضمان المحاذاة لليمين في المحتوى العربي
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'right', // محاذاة النص لليمين
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
    textAlign: 'right',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  gradient: {
    flexDirection: 'row-reverse', // عكس الاتجاه ليكون الأيقونة على اليسار والنص على اليمين
    alignItems: 'center',
    padding: 24,
    minHeight: 140,
  },
  cardInfo: {
    flex: 1,
    alignItems: 'flex-end', // محاذاة النصوص داخل الكارت لليمين
  },
  classLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00d1b2',
    textAlign: 'right',
  },
  className: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 6,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row-reverse', // عكس النقاط والتاريخ
    alignItems: 'center',
    marginTop: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8, // مسافة من اليمين بدلاً من اليسار
  },
  dateText: {
    fontSize: 13,
    color: '#777',
    textAlign: 'right',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  center: {
    flexDirection : 'column',
    alignItems : "center",
    justifyContent : "center"
  }
});