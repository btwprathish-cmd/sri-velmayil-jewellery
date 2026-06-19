import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useQuery } from "@tanstack/react-query";
import { fetchLatestRate, formatINR, FALLBACK_RATE } from "@/utils/rates";

const GOLD_COLLECTIONS = [
  {
    id: "necklaces",
    name: "Necklaces",
    icon: "diamond-stone" as const,
    count: 12,
    items: [
      { name: "Antique Peacock Necklace", weight_g: 32.5, making: 12 },
      { name: "Classic Gold Choker", weight_g: 24.0, making: 10 },
      { name: "Bridal Gold Haram", weight_g: 48.0, making: 14 },
      { name: "Temple Coin Necklace", weight_g: 28.0, making: 11 },
    ],
  },
  {
    id: "bangles",
    name: "Bangles",
    icon: "circle-outline" as const,
    count: 8,
    items: [
      { name: "Traditional Gold Bangles (set of 4)", weight_g: 35.0, making: 10 },
      { name: "Lightweight Filigree Bangle", weight_g: 12.0, making: 13 },
      { name: "Bridal Kangan Set (6 pieces)", weight_g: 65.0, making: 12 },
    ],
  },
  {
    id: "rings",
    name: "Rings",
    icon: "ring" as const,
    count: 10,
    items: [
      { name: "Simple Gold Band Ring", weight_g: 3.5, making: 15 },
      { name: "Floral Design Ring", weight_g: 5.0, making: 18 },
      { name: "Bridal Engagement Ring", weight_g: 6.5, making: 20 },
    ],
  },
  {
    id: "earrings",
    name: "Earrings",
    icon: "star-outline" as const,
    count: 15,
    items: [
      { name: "Jhumka Earrings", weight_g: 8.0, making: 14 },
      { name: "Stud Earrings", weight_g: 2.5, making: 16 },
      { name: "Long Chandelier Earrings", weight_g: 12.0, making: 13 },
    ],
  },
];

const SILVER_COLLECTIONS = [
  {
    id: "silver-articles",
    name: "Articles",
    icon: "star-outline" as const,
    count: 6,
    items: [
      { name: "Silver Lamp (Vilakku)", weight_g: 250, making: 8 },
      { name: "Silver Plate & Bowl Set", weight_g: 180, making: 7 },
      { name: "Silver Paadham (Anklets)", weight_g: 80, making: 9 },
    ],
  },
  {
    id: "silver-jewellery",
    name: "Jewellery",
    icon: "diamond-stone" as const,
    count: 9,
    items: [
      { name: "Silver Necklace", weight_g: 45, making: 10 },
      { name: "Silver Bangles (set of 4)", weight_g: 60, making: 8 },
      { name: "Silver Anklets (pair)", weight_g: 40, making: 9 },
    ],
  },
];

function CollectionCategoryCard({
  name,
  items,
  metal,
  goldRate,
  silverRate,
}: {
  name: string;
  items: { name: string; weight_g: number; making: number }[];
  metal: "gold" | "silver";
  goldRate: number;
  silverRate: number;
}) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const accentColor = metal === "gold" ? colors.gold : colors.silver;

  function calcPrice(weight: number, making: number, rate: number) {
    const base = weight * rate;
    const mc = base * (making / 100);
    return Math.round(base + mc);
  }

  return (
    <View style={[styles.categoryCard, { backgroundColor: colors.card, borderColor: expanded ? accentColor + "60" : colors.border }]}>
      <Pressable
        style={styles.categoryHeader}
        onPress={() => {
          setExpanded((p) => !p);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <View style={[styles.categoryIcon, { backgroundColor: accentColor + "18" }]}>
          <MaterialCommunityIcons name="diamond-stone" size={18} color={accentColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.categoryName, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>{name}</Text>
          <Text style={[styles.categoryCount, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            {items.length} designs available
          </Text>
        </View>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={18} color={colors.mutedForeground} />
      </Pressable>

      {expanded && (
        <View style={[styles.itemsList, { borderTopColor: colors.border }]}>
          {items.map((item) => {
            const rate = metal === "gold" ? goldRate : silverRate;
            const price = calcPrice(item.weight_g, item.making, rate);
            const fromPrice = Math.round(item.weight_g * rate);
            return (
              <View key={item.name} style={[styles.itemRow, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemName, { color: colors.foreground, fontFamily: "Inter_500Medium" }]}>{item.name}</Text>
                  <Text style={[styles.itemWeight, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                    {item.weight_g}g · {item.making}% making charges
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[styles.itemPrice, { color: accentColor, fontFamily: "Inter_700Bold" }]}>{formatINR(price)}</Text>
                  <Text style={[styles.itemBasePrice, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                    metal: {formatINR(fromPrice)}
                  </Text>
                </View>
              </View>
            );
          })}
          <View style={[styles.hallmarkRow, { borderTopColor: colors.border }]}>
            <Ionicons name="shield-checkmark" size={12} color={accentColor} />
            <Text style={[styles.hallmarkText, { color: accentColor, fontFamily: "Inter_500Medium" }]}>BIS 916 Hallmarked · HUID Certified</Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default function CollectionsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<"gold" | "silver">("gold");
  const webTop = Platform.OS === "web" ? 67 : 0;

  const { data: rate } = useQuery({
    queryKey: ["latestRate"],
    queryFn: fetchLatestRate,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const displayRate = rate ?? FALLBACK_RATE;
  const goldRate = displayRate.gold22k_1g;
  const silverRate = displayRate.silver_1g;

  const collections = tab === "gold" ? GOLD_COLLECTIONS : SILVER_COLLECTIONS;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingTop: webTop }}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.headerTitle, { color: colors.gold, fontFamily: "Inter_700Bold" }]}>Collections</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          25 years of master craftsmanship
        </Text>
      </View>

      {/* Hallmark badge */}
      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: colors.gold + "15", borderColor: colors.gold + "40" }]}>
          <Ionicons name="shield-checkmark" size={12} color={colors.gold} />
          <Text style={[styles.badgeText, { color: colors.gold, fontFamily: "Inter_600SemiBold" }]}>BIS 916 HALLMARKED</Text>
        </View>
      </View>

      {/* Tab switcher */}
      <View style={[styles.tabRow, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        {(["gold", "silver"] as const).map((t) => {
          const active = tab === t;
          const color = t === "gold" ? colors.gold : colors.silver;
          return (
            <Pressable
              key={t}
              style={[styles.tabBtn, active && { backgroundColor: color + "22", borderColor: color + "60" }]}
              onPress={() => {
                setTab(t);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <FontAwesome5 name="gem" size={13} color={active ? color : colors.mutedForeground} />
              <Text style={[styles.tabBtnText, { color: active ? color : colors.mutedForeground, fontFamily: active ? "Inter_600SemiBold" : "Inter_400Regular" }]}>
                {t === "gold" ? "Gold" : "Silver"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Rate info strip */}
      <View style={[styles.rateStrip, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.rateStripText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          Prices based on live {tab} rate:
        </Text>
        <Text style={[styles.rateStripValue, { color: tab === "gold" ? colors.gold : colors.silver, fontFamily: "Inter_700Bold" }]}>
          {formatINR(tab === "gold" ? goldRate : silverRate)}/g
        </Text>
      </View>

      {/* Collection cards */}
      <View style={styles.list}>
        {collections.map((col) => (
          <CollectionCategoryCard
            key={col.id}
            name={col.name}
            items={col.items}
            metal={tab}
            goldRate={goldRate}
            silverRate={silverRate}
          />
        ))}
      </View>

      <Text style={[styles.disclaimer, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
        Prices are indicative. Visit our showroom for exact pricing and availability.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 4 },
  headerTitle: { fontSize: 28 },
  headerSub: { fontSize: 13, marginTop: 2 },
  badgeRow: { paddingHorizontal: 20, marginTop: 10 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    gap: 5,
  },
  badgeText: { fontSize: 10, letterSpacing: 1.5 },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  tabBtnText: { fontSize: 14 },
  rateStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  rateStripText: { fontSize: 12 },
  rateStripValue: { fontSize: 16 },
  list: { paddingHorizontal: 20, marginTop: 14, gap: 10 },
  categoryCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: { fontSize: 15 },
  categoryCount: { fontSize: 12, marginTop: 2 },
  itemsList: { borderTopWidth: 1 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    gap: 8,
  },
  itemName: { fontSize: 13 },
  itemWeight: { fontSize: 11, marginTop: 2 },
  itemPrice: { fontSize: 16 },
  itemBasePrice: { fontSize: 10, marginTop: 2 },
  hallmarkRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    gap: 5,
  },
  hallmarkText: { fontSize: 11 },
  disclaimer: { fontSize: 11, textAlign: "center", margin: 20, lineHeight: 16 },
});
