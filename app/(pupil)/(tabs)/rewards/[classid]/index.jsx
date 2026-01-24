import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfile } from '../../../../../src/hooks/useAuth';
import { useGetClassRewards, usePurchaseReward } from '../../../../../src/hooks/useRewards';

const RewardItem = ({ item, userBalance, onPurchase, isPurchasing }) => {
    const canAfford = userBalance >= item.cost;

    // Localized Date for Tunisia
    const formattedDate = new Date(item.expiresAt).toLocaleDateString('ar-TN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <Animated.View 
            entering={FadeInDown.springify()} 
            style={styles.card}
        >
            {/* Top Row: Title and Cost */}
            <View style={styles.topRow}>
                <View style={styles.rewardTextGroup}>
                    <Text style={styles.rewardName}>{item.name}</Text>
                    <Text style={styles.rewardExpiry}>ينتهي في: {formattedDate}</Text>
                </View>
                
                <View style={styles.costContainer}>
                    <Text style={styles.costText}>{item.cost}</Text>
                    <Text style={styles.coinIcon}>🪙</Text>
                </View>
            </View>

            {/* Bottom Row: Full Width Action Button */}
            <TouchableOpacity
                disabled={!canAfford || isPurchasing}
                onPress={() => onPurchase(item._id)}
                style={[
                    styles.purchaseBtn,
                    !canAfford && styles.disabledBtn
                ]}
            >
                {isPurchasing ? (
                    <ActivityIndicator size="small" color="#FFF" />
                ) : (
                    <View style={styles.btnContent}>
                        <Ionicons 
                            name={canAfford ? "cart-outline" : "lock-closed-outline"} 
                            size={20} 
                            color="#FFF" 
                            style={{ marginLeft: 8 }}
                        />
                        <Text style={styles.purchaseBtnText}>
                            {canAfford ? 'استبدال النقاط الآن' : 'رصيدك غير كافٍ'}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const Rewards = () => {
    const { classid } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    
    const { data: profileData, isLoading: profileLoading } = useProfile();
    const { data: classReward, isLoading: rewardsLoading } = useGetClassRewards(classid);
    const { mutate: purchase, isPending: isPurchasing } = usePurchaseReward();

    const rewardsList = classReward?.reward || [];
    const currentBalance = profileData?.pointBalance || 0;

    if (profileLoading || rewardsLoading) {
        return (
            <View style={styles.loadingCenter}>
                <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <LinearGradient
                colors={['#5B21B6', '#8B5CF6']}
                style={[styles.header, { paddingTop: insets.top + 20 }]}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name='arrow-back-sharp' size={24} color="#fff" />
                </TouchableOpacity>
                
                <View style={styles.balanceRow}>
                    <View style={styles.balanceInfo}>
                        <Text style={styles.balanceLabel}>رصيدك الحالي</Text>
                        <Text style={styles.balanceValue}>{currentBalance} 🪙</Text>
                    </View>
                    <View style={styles.walletIconBg}>
                        <Ionicons name="wallet" size={32} color="#FFF" />
                    </View>
                </View>
            </LinearGradient>

            <FlatList
                data={rewardsList}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listPadding}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <RewardItem 
                        item={item} 
                        userBalance={currentBalance}
                        onPurchase={(id) => purchase(id)}
                        isPurchasing={isPurchasing}
                    />
                )}
                ListHeaderComponent={() => (
                    <Text style={styles.sectionTitle}>مكافآت الفصل الدراسي</Text>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="gift-outline" size={60} color="#E2E8F0" />
                        <Text style={styles.emptyText}>لا توجد مكافآت متاحة حالياً</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FBFBFF' },
    loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        paddingHorizontal: 25,
        paddingBottom: 40,
        borderBottomLeftRadius: 45,
        borderBottomRightRadius: 45,
        elevation: 10,
        shadowColor: '#8B5CF6',
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    backBtn: {
        width: 45,
        height: 45,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'flex-start'
    },
    balanceRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    balanceInfo: { alignItems: 'flex-end' },
    balanceLabel: { color: '#DDD6FE', fontSize: 16, fontWeight: '600' },
    balanceValue: { color: '#FFFFFF', fontSize: 38, fontWeight: '900', marginTop: 4 },
    walletIconBg: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listPadding: { padding: 20, paddingTop: 30 },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1E293B',
        textAlign: 'right',
        marginBottom: 20
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 4,
        shadowColor: '#64748B',
        shadowOpacity: 0.08,
        shadowRadius: 12,
    },
    topRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 25,
    },
    rewardTextGroup: { flex: 1, alignItems: 'flex-end' },
    rewardName: { 
        fontSize: 20, 
        fontWeight: '800', 
        color: '#1E293B', 
        textAlign: 'right',
        lineHeight: 28
    },
    rewardExpiry: { fontSize: 12, color: '#94A3B8', marginTop: 6 },
    costContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#F5F3FF',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 15,
        marginRight: 12,
    },
    costText: { color: '#7C3AED', fontSize: 20, fontWeight: '900' },
    coinIcon: { fontSize: 18, marginRight: 5 },
    purchaseBtn: {
        backgroundColor: '#8B5CF6',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 20,
        alignItems: 'center',
    },
    btnContent: { flexDirection: 'row-reverse', alignItems: 'center' },
    disabledBtn: { backgroundColor: '#CBD5E1' },
    purchaseBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
    emptyContainer: { alignItems: 'center', marginTop: 80 },
    emptyText: { color: '#94A3B8', marginTop: 12, fontSize: 16 }
});

export default Rewards;