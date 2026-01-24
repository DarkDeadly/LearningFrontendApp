import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RenderClass = ({ item }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.classCard}
      activeOpacity={0.9}
      onPress={() => router.push(`/(teacher)/classes/${item.id}`)}
    >
      <View style={styles.cardContent}>
        {/* Header Row: Status on Left, Name on Right (RTL) */}
        <View style={styles.headerRow}>
          <View style={[
            styles.statusBadge, 
            item.isActive ? styles.active : styles.inactive
          ]}>
            <Text style={[
              styles.statusText,
              item.isActive ? styles.activeText : styles.inactiveText
            ]}>
              {item.isActive ? 'نشط' : 'غير نشط'}
            </Text>
          </View>
          
          <Text style={styles.className} >
            {item?.name}
          </Text>
        </View>

        {/* Description */}
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {/* Stats Row: Aligned to Right */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statText}>
              {new Date(item.createdAt).toLocaleDateString('ar-TN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </Text>
            <Ionicons name="calendar-outline" size={16} color="#94A3B8" style={styles.statIcon} />
          </View>
        </View>

        {/* Actions Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              router.push(`/(teacher)/classes/${item.id}`);
            }}
          >
            <Text style={styles.actionText}>إدارة الفصل التلاميذ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RenderClass;

const styles = StyleSheet.create({
  classCard: {
    marginVertical: 20,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F1F5F9', // Very subtle border for definition
    elevation: 4,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  cardContent: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  className: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  active: {
    backgroundColor: '#F0FDF4',
  },
  inactive: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  activeText: {
    color: '#16A34A',
  },
  inactiveText: {
    color: '#DC2626',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'right',
    marginBottom: 16,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statIcon: {
    marginLeft: 6,
  },
  statText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  actionsRow: {
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F3FF',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  actionIcon: {
    marginRight: 0,
    marginLeft: 4,
  },
  actionText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '700',
  },
});