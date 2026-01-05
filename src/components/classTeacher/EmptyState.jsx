import { StyleSheet, Text, View } from 'react-native'

const EmptyState = ({subtitle ="ابدأ بإنشاء فصل دراسي جديد لدعوة تلاميذك" , teacherValid = true}) => {
  return (
   <View style={styles.emptyContainer}>
      <Ionicons name="school-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>لا توجد فصول دراسية بعد</Text>
      <Text style={styles.emptySubtitle}>
        {subtitle}
      </Text>
     {teacherValid &&  <TouchableOpacity
        style={styles.createFirstButton}
        onPress={() => router.push('/(teacher)/create-classroom')}
      >
        <Text style={styles.createFirstText}>إنشاء فصل جديد</Text>
      </TouchableOpacity>}
    </View>
  )
}

export default EmptyState

const styles = StyleSheet.create({
    emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  createFirstButton: {
    marginTop: 30,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
  },
  createFirstText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
}

})