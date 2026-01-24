import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useProfile } from '../../hooks/useAuth';
import { useJoinClassroom } from '../../hooks/useClassroom';
import { validateJoinClassroom } from '../../util/classValidation';

const RenderClass = ({ item }) => {
    const [pin, setPin] = useState("");
    const [error, setError] = useState(null);
    const { mutate: joinClassroom, isPending: Loading, error: serverError } = useJoinClassroom();
    const { data: user } = useProfile();
    const router = useRouter();

    const isJoined = user?.classroomId === item._id;

    const handleJoin = () => {
        const validationErrors = validateJoinClassroom(item._id, pin);
        if (Object.keys(validationErrors).length > 0) {
            setError("الرجاء إدخال رمز صحيح");
            return;
        }
        setError(null);
        joinClassroom({ classroomId: item._id, pin }, { 
            onSuccess: () => setPin('') 
        });
    };

    return (
        <View style={styles.classCard}>
            <View style={styles.cardContent}>
                {/* Header: Name and Status */}
                <View style={styles.headerRow}>
                    <View style={[styles.statusBadge, item.isActive ? styles.active : styles.inactive]}>
                        <Text style={[styles.statusText, item.isActive ? styles.activeText : styles.inactiveText]}>
                            {item.isActive ? 'نشط' : 'مغلق'}
                        </Text>
                    </View>
                    <Text style={styles.className}>{item.name}</Text>
                </View>

                {/* Teacher & Date Info */}
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoText}>{item?.teacherId?.fullname}</Text>
                        <Ionicons name="person-circle-outline" size={16} color="#8B5CF6" />
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoText}>
                            {new Date(item.createdAt).toLocaleDateString('ar-TN')}
                        </Text>
                        <Ionicons name="calendar-outline" size={16} color="#94A3B8" />
                    </View>
                </View>

                {item.description && (
                    <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                )}

                {(error || serverError) && (
                    <Text style={styles.errorText}>
                        {error || serverError?.response?.data?.message || "خطأ في الرمز"}
                    </Text>
                )}

                {/* Conditional Action Area */}
                <View style={styles.actionsContainer}>
                    {isJoined ? (
                        <TouchableOpacity 
                            style={styles.joinedButton}
                            onPress={() => router.push(`(pupil)/(tabs)/class/${item._id}`)}
                        >
                            <Text style={styles.joinedButtonText}>دخول القسم</Text>
                            <Ionicons name="enter-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.joinRow}>
                            <TouchableOpacity 
                                style={[styles.joinButton, Loading && { opacity: 0.7 }]}
                                onPress={handleJoin}
                                disabled={Loading || pin.length < 4}
                            >
                                <Text style={styles.joinButtonText}>{Loading ? '...' : 'انضمام'}</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={[styles.pinInput, error && styles.inputError]}
                                placeholder="رمز PIN"
                                placeholderTextColor="#CBD5E1"
                                keyboardType="number-pad"
                                value={pin}
                                onChangeText={setPin}
                                maxLength={4}
                                secureTextEntry
                                textAlign="center"
                            />
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

export default RenderClass;

const styles = StyleSheet.create({
    classCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...Platform.select({
            ios: { shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12 },
            android: { elevation: 4 }
        })
    },
    cardContent: { padding: 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    className: { fontSize: 18, fontWeight: '800', color: '#1E293B', flex: 1, textAlign: 'right', marginRight: 10 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    active: { backgroundColor: '#F0FDF4' },
    inactive: { backgroundColor: '#FEF2F2' },
    statusText: { fontSize: 11, fontWeight: '700' },
    activeText: { color: '#16A34A' },
    inactiveText: { color: '#DC2626' },
    infoRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15, marginBottom: 12 },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    infoText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
    description: { fontSize: 14, color: '#64748B', textAlign: 'right', marginBottom: 20, lineHeight: 20 },
    actionsContainer: { marginTop: 5 },
    joinRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
    pinInput: {
        flex: 1,
        height: 48,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B'
    },
    inputError: { borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' },
    joinButton: {
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 25,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    joinButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    joinedButton: {
        backgroundColor: '#6D28D9',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
        borderRadius: 12,
        gap: 8
    },
    joinedButtonText: { color: '#fff', fontWeight: '800', fontSize: 15 },
    errorText: { color: '#DC2626', fontSize: 12, textAlign: 'right', marginBottom: 8, fontWeight: '600' }
});