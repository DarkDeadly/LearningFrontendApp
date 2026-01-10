import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetHistory } from "../../../../../../src/hooks/usePoints";
import { usePupilStore } from "../../../../../../src/stores/PupilStore";

const HistoryItem = ({ item }) => {
  const isBonus = item.type === "bonus";

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.accent,
          isBonus ? styles.bonusAccent : styles.penaltyAccent,
        ]}
      />

      <View style={styles.content}>
        <Text style={styles.reason}>{item.reason}</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <Text
        style={[
          styles.amount,
          isBonus ? styles.bonusText : styles.penaltyText,
        ]}
      >
        {isBonus ? "+" : ""}
        {item.amount}
      </Text>
    </View>
  );
};

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
   const {selectedStudent} = usePupilStore()    
   const {data , isPending} = useGetHistory(selectedStudent.classroomId , selectedStudent._id)
   const historydata = data?.history     

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 8,
        },
      ]}
    >
        {isPending ? <ActivityIndicator size={"large"} /> :
        <>
        <Text style={styles.title}>History</Text>

      <FlatList
        data={historydata}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <HistoryItem item={item} />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      />
        </>
        }
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  accent: {
    width: 4,
    height: "100%",
    borderRadius: 4,
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  reason: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },

  date: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  amount: {
    fontSize: 18,
    fontWeight: "700",
  },

  bonusAccent: {
    backgroundColor: "#22C55E",
  },
  bonusText: {
    color: "#22C55E",
  },

  penaltyAccent: {
    backgroundColor: "#EF4444",
  },
  penaltyText: {
    color: "#EF4444",
  },
});