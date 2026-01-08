import { LinearGradient } from 'expo-linear-gradient'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import RenderClass from '../../../src/components/classStudent/RenderClass'
import EmptyState from '../../../src/components/classTeacher/EmptyState'
import { useGetAllClassrooms } from '../../../src/hooks/useClassroom'

const ClassScreen = () => {
  const {data , isLoading} = useGetAllClassrooms()
  console.log(data)
  return (
    <View style={styles.container}>
     <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.header}>
             <Text style={styles.headerTitle}>فصولي الدراسية</Text>
             <Text style={styles.headerSubtitle}>لننطلق في رحلتنا التعليمية مع فترات دراسية منظمة</Text>
      </LinearGradient>
      {/* Content */}
            {isLoading ? (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color="#8B5CF6" />
                <Text style={styles.loadingText}>جاري تحميل الفصول...</Text>
              </View>
            ) : data?.length === 0 ? (
              <EmptyState subtitle='' teacherValid={false} />
            ) : (
              <FlatList
                data={data}
                renderItem={({ item }) => <RenderClass item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
              />
            )}
    </View>
  )
}

export default ClassScreen

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