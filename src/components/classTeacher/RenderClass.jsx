// src/components/classTeacher/RenderClass.jsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.cardContent}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.className}>{item?.name}</Text>
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
        </View>

        {/* Description (if exists) */}
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="calendar-outline" size={18} color="#666" />
            <Text style={styles.statText}>
              {new Date(item.createdAt).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </Text>
          </View>
        </View>

        {/* Actions Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              router.push(`/(teacher)/classes/${item.id}`);
            }}
          >
            <Ionicons name="settings" size={20} color="#8B5CF6" />
            <Text style={styles.actionText}> ادارة الدروس و التلاميذ </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RenderClass;

const styles = StyleSheet.create({
  classCard: {
    marginTop : 20,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  cardContent: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  className: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  active: {
    backgroundColor: '#D4EDDA',
  },
  inactive: {
    backgroundColor: '#F8D7DA',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#155724',
  },
  inactiveText: {
    color: '#721C24',
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'right',
    marginBottom: 16,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 24,
  },
  statText: {
    fontSize: 14,
    color: '#777',
    marginLeft: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 12, // Add gap instead of marginLeft
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center",
    backgroundColor: '#F0E7FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1
  },
  actionText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});