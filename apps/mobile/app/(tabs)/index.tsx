import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TextInput,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import {
  fetchLatestRate,
  fetchRateHistory,
  getDerivedRates,
  formatIndianDate,
  formatINR,
  FALLBACK_RATE,
  LiveRateRecord,
} from "@/utils/rates";

function TrendBadge({ trend }: { trend: number | null | undefined }) {
  const colors = useColors();
  if (!trend || trend === 0) return null;
  const up = trend > 0;
  return (
    <View style={[styles.trendBadge, { backgroundColor: up ? "#ef444420" : "#22c55e20", borderColor: up ? "#ef444440" : "#22c55e40" }]}>
      <Ionicons name={up ? "arrow-up" : "arrow-down"} size={11} color={up ? "#ef4444" : "#22c55e"} />
      <Text style={[styles.trendText, { color: up ? "#ef4444" : "#22c55e" }]}>
        {up ? "+" : "-"}₹{Math.abs(trend)}/g
      </Text>
    </View>
  );
}

function RateCard({ label, sub, value, accent }: { label: string; sub: string; value: number; accent?: boolean }) {
  const colors = useColors();
  return (
    <View style={[styles.rateCard, { backgroundColor: colors.muted, borderColor: accent ? colors.gold + "60" : colors.border }]}>
      <View style={styles.rateCardLeft}>
        <Text style={[styles.rateCardLabel, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>{label}</Text>
        <Text style={[styles.rateCardSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{sub}</Text>
      </View>
      <Text style={[styles.rateCardValue, { color: accent ? colors.gold : colors.foreground, fontFamily: "Inter_700Bold" }]}>
        {formatINR(value)}
      </Text>
    </View>
  );
}

function HistoryRow({ record }: { record: LiveRateRecord }) {
  const colors = useColors();
  return (
    <View style={[styles.historyRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.historyDate, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
        {formatIndianDate(record.date)}
      </Text>
      <Text style={[styles.historyValue, { color: colors.gold, fontFamily: "Inter_600SemiBold" }]}>
        {formatINR(record.gold22k_1g)}
      </Text>
      <Text style={[styles.historyValue, { color: colors.silver, fontFamily: "Inter_600SemiBold" }]}>
        {formatINR(record.silver_1g)}
      </Text>
    </View>
  );
}

export default function RatesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [weight, setWeight] = useState("1");
  const [refreshing, setRefreshing] = useState(false);

  const { data: rate, refetch: refetchRate } = useQuery({
    queryKey: ["latestRate"],
    queryFn: fetchLatestRate,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const { data: history } = useQuery({
    queryKey: ["rateHistory"],
    queryFn: fetchRateHistory,
    retry: 1,
    staleTime: 10 * 60 * 1000,
  });

  const displayRate = rate ?? FALLBACK_RATE;
  const derived = getDerivedRates(displayRate);
  const weightNum = parseFloat(weight) || 0;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchRate();
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [refetchRate]);

  const webTop = Platform.OS === "web" ? 67 : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingTop: webTop }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold} />
      }
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.brandName, { color: colors.gold, fontFamily: "Inter_700Bold" }]}>SRI VELMAYIL</Text>
        <Text style={[styles.brandSub, { color: colors.accent, fontFamily: "Inter_400Regular" }]}>JEWELLERY · TIRUPUR</Text>
      </View>

      {/* Today label */}
      <View style={styles.dateRow}>
        <View style={[styles.dateBadge, { backgroundColor: colors.gold + "18", borderColor: colors.gold + "40" }]}>
          <MaterialCommunityIcons name="diamond-stone" size={12} color={colors.gold} />
          <Text style={[styles.dateText, { color: colors.gold, fontFamily: "Inter_600SemiBold" }]}>
            {rate ? `Rates for ${formatIndianDate(displayRate.date)}` : "Loading live rates..."}
          </Text>
        </View>
        {!rate && <ActivityIndicator size="small" color={colors.gold} style={{ marginLeft: 8 }} />}
      </View>

      {/* Trend badges */}
      <View style={styles.trendRow}>
        <TrendBadge trend={displayRate.trend_gold} />
        {displayRate.trend_silver != null && (
          <View style={{ marginLeft: 8 }}>
            <TrendBadge trend={displayRate.trend_silver} />
          </View>
        )}
      </View>

      {/* Gold rates section */}
      <Text style={[styles.sectionTitle, { color: colors.gold, fontFamily: "Inter_700Bold" }]}>Gold Rates</Text>
      <RateCard label="22K Gold (916 Hallmarked)" sub="Standard ornament rate" value={displayRate.gold22k_1g} accent />
      <RateCard label="24K Pure Gold" sub="Coins and bullion" value={derived.gold24k_1g} accent />
      <RateCard label="18K Studded Gold" sub="Diamond & stone settings" value={derived.gold18k_1g} />

      {/* Silver rates section */}
      <Text style={[styles.sectionTitle, { color: colors.silver, fontFamily: "Inter_700Bold", marginTop: 24 }]}>Silver Rates</Text>
      <RateCard label="Silver (1 Gram)" sub="Fine silver articles" value={displayRate.silver_1g} />
      <RateCard label="Silver (1 Kilogram)" sub="Investment bulk silver" value={displayRate.silver_1g * 1000} />

      {/* Price Calculator */}
      <Text style={[styles.sectionTitle, { color: colors.accent, fontFamily: "Inter_700Bold", marginTop: 24 }]}>Price Calculator</Text>
      <View style={[styles.calcCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.calcLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>Enter weight (grams)</Text>
        <TextInput
          style={[styles.calcInput, { backgroundColor: colors.input, color: colors.foreground, borderColor: colors.border, fontFamily: "Inter_600SemiBold" }]}
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          placeholder="e.g. 10"
          placeholderTextColor={colors.mutedForeground}
        />
        {weightNum > 0 && (
          <View style={styles.calcResults}>
            {[
              { label: "22K Gold", value: displayRate.gold22k_1g * weightNum, color: colors.gold },
              { label: "24K Gold", value: derived.gold24k_1g * weightNum, color: colors.gold },
              { label: "Silver", value: displayRate.silver_1g * weightNum, color: colors.silver },
            ].map(({ label, value, color }) => (
              <View key={label} style={[styles.calcRow, { borderTopColor: colors.border }]}>
                <Text style={[styles.calcRowLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>{label}</Text>
                <Text style={[styles.calcRowValue, { color, fontFamily: "Inter_700Bold" }]}>{formatINR(value)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Rate History */}
      {history && history.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.accent, fontFamily: "Inter_700Bold", marginTop: 24 }]}>Recent History</Text>
          <View style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.historyHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.historyHeaderText, { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>DATE</Text>
              <Text style={[styles.historyHeaderText, { color: colors.gold, fontFamily: "Inter_600SemiBold" }]}>22K / G</Text>
              <Text style={[styles.historyHeaderText, { color: colors.silver, fontFamily: "Inter_600SemiBold" }]}>SILVER / G</Text>
            </View>
            {history.slice(0, 7).map((r) => (
              <HistoryRow key={r.date} record={r} />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: "center",
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  brandName: { fontSize: 22, letterSpacing: 4 },
  brandSub: { fontSize: 11, letterSpacing: 3, marginTop: 2 },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 12,
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    gap: 5,
  },
  dateText: { fontSize: 12 },
  trendRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    gap: 3,
  },
  trendText: { fontSize: 11, fontWeight: "600" },
  sectionTitle: { fontSize: 13, letterSpacing: 2, paddingHorizontal: 20, marginBottom: 10, marginTop: 20 },
  rateCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  rateCardLeft: { flex: 1, marginRight: 8 },
  rateCardLabel: { fontSize: 14 },
  rateCardSub: { fontSize: 11, marginTop: 2 },
  rateCardValue: { fontSize: 20 },
  calcCard: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  calcLabel: { fontSize: 12, marginBottom: 8 },
  calcInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
  },
  calcResults: { marginTop: 12 },
  calcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  calcRowLabel: { fontSize: 13 },
  calcRowValue: { fontSize: 18 },
  historyCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
  },
  historyHeaderText: { fontSize: 11, flex: 1, textAlign: "center" },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  historyDate: { fontSize: 12, flex: 1.5 },
  historyValue: { fontSize: 13, flex: 1, textAlign: "center" },
});
