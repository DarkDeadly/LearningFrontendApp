import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useProfile } from '../../hooks/useAuth';
import { useJoinClassroom } from '../../hooks/useClassroom';
import { validateJoinClassroom } from '../../util/classValidation';

const RenderClass = ({ item }) => {

    const [pin, setPin] = useState("")
    const [Error, setError] = useState({})
    const { mutate: joinClassroom, isPending: Loading, error: serverError } = useJoinClassroom()
    const { data : user } = useProfile();
    const router = useRouter()

    const handleJoinClassroom = (classId, pinCode) => {
        const validationErrors = validateJoinClassroom(classId, pinCode);

        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }

        setError({});

        joinClassroom({
            classroomId: classId,
            pin: pinCode,
        },{onSuccess : () => setPin('')});

    };
    return (
        <TouchableOpacity
            style={styles.classCard}
            activeOpacity={0.9}
           
        >
            <LinearGradient
                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.cardContent}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                    <Text style={styles.className}>{item.name}</Text>
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
                {serverError && (
                    <Text style={styles.errorText}>
                        {serverError.response?.data?.message || "حدث خطأ أثناء الانضمام"}
                    </Text>
                )}
                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Ionicons name="people-outline" size={18} color="#666" />
                        <Text style={styles.statText}>
                            {item.teacherId.fullname}
                        </Text>
                    </View>
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
                   {
                    user?.classroomId === item._id ?   <TouchableOpacity
                        style={[
                            styles.classText,
                            Loading && { opacity: 0.6 }
                        ]}
                        onPress={() =>router.push(`(pupil)/(tabs)/class/${item._id}`)}
                        disabled={Loading}
                    >
                        <Text style={styles.actionText}>
                            تفحص القسم
                        </Text>
                    </TouchableOpacity> : <>
                     <TextInput
                        style={styles.pinInput}
                        placeholder="رمز الفصل"
                        placeholderTextColor="#999"
                        keyboardType="number-pad"
                        value={pin}
                        onChangeText={setPin}
                        maxLength={4}
                        secureTextEntry={true}
                    />

                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            Loading && { opacity: 0.6 }
                        ]}
                        onPress={() => handleJoinClassroom(item._id, pin)}
                        disabled={Loading}
                    >
                        <Text style={styles.actionText}>
                            {Loading ? 'جاري الانضمام...' : 'الانضمام إلى الفصل'}
                        </Text>
                    </TouchableOpacity>
                    </>

                   }
                   
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default RenderClass;

const styles = StyleSheet.create({
    classCard: {
        marginTop: 20,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
    },
    errorText: {
        color: '#DC2626',
        fontSize: 12,
        marginBottom: 6,
        textAlign: 'right',
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
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        gap: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0E7FF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    classText : {
        backgroundColor: '#F0E7FF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        width : "100%"
    },
    actionText: {
        color: '#8B5CF6',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
        textAlign:'center'
    },
    pinInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    }
});