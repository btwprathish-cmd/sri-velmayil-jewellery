import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const WHY_CHOOSE = [
  { icon: "time-outline" as const, title: "25 Years Excellence", desc: "Trusted since 1999, three generations of family craftsmanship in Tirupur." },
  { icon: "shield-checkmark-outline" as const, title: "Absolute Purity", desc: "100% BIS 916 hallmarked and HUID-stamped gold on every piece." },
  { icon: "receipt-outline" as const, title: "Transparent Pricing", desc: "Fully itemized bills — gold weight, making charges, GST. No hidden costs." },
  { icon: "hammer-outline" as const, title: "Master Artisans", desc: "Kodi Maalai, temple-inspired necklaces, and modern kadas crafted in-house." },
  { icon: "people-outline" as const, title: "Bridal Consultation", desc: "Private consultations for wedding trousseau planning and custom orders." },
  { icon: "swap-horizontal-outline" as const, title: "Fair Exchange", desc: "Old gold bought back at live rates — precision testing for maximum value." },
];

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40, paddingTop: webTop }}
    >
      {/* Hero */}
      <View style={[styles.hero, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <View style={[styles.heroBadge, { backgroundColor: colors.gold + "18", borderColor: colors.gold + "40" }]}>
          <Text style={[styles.heroBadgeText, { color: colors.gold, fontFamily: "Inter_600SemiBold" }]}>EST. 1999 · TIRUPUR</Text>
        </View>
        <Text style={[styles.heroTitle, { color: colors.gold, fontFamily: "Inter_700Bold" }]}>
          The Art of Earning Trust,
        </Text>
        <Text style={[styles.heroTitle, { color: colors.accent, fontFamily: "Inter_700Bold" }]}>
          One Ornament at a Time.
        </Text>
        <Text style={[styles.heroSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          For over 25 years, Sri Velmayil Jewellery has been the trusted name for pure gold and silver jewellery in Tirupur, Tamil Nadu.
        </Text>
      </View>

      {/* Heritage story */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.gold, fontFamily: "Inter_600SemiBold" }]}>OUR HERITAGE</Text>
        <Text style={[styles.bodyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          Founded in 1999, Sri Velmayil Jewellery started with a single promise: to offer pure, hallmarked gold at honest prices. Over the decades we have grown into one of Tirupur's most respected jewellery showrooms — serving thousands of families for weddings, festivals, and everyday celebrations.
        </Text>
        <Text style={[styles.bodyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 10 }]}>
          Our master artisans specialise in traditional Tamil jewellery — Kodi Maalai, temple-inspired necklaces, and modern kadas — all crafted with the same devotion that has defined us since day one.
        </Text>
      </View>

      {/* Why choose us */}
      <Text style={[styles.sectionTitle, { color: colors.accent, fontFamily: "Inter_700Bold" }]}>WHY CHOOSE US</Text>
      <View style={styles.whyGrid}>
        {WHY_CHOOSE.map(({ icon, title, desc }) => (
          <View key={title} style={[styles.whyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.whyIcon, { backgroundColor: colors.gold + "18" }]}>
              <Ionicons name={icon} size={20} color={colors.gold} />
            </View>
            <Text style={[styles.whyTitle, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>{title}</Text>
            <Text style={[styles.whyDesc, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{desc}</Text>
          </View>
        ))}
      </View>

      {/* Trust statement */}
      <View style={[styles.trustCard, { backgroundColor: colors.gold + "12", borderColor: colors.gold + "40" }]}>
        <Ionicons name="shield-checkmark" size={28} color={colors.gold} style={{ alignSelf: "center", marginBottom: 10 }} />
        <Text style={[styles.trustText, { color: colors.accent, fontFamily: "Inter_400Regular" }]}>
          Quality is not a procedure here — it is our culture. Every piece of jewellery undergoes rigorous purity testing before it reaches your hands. That commitment has earned the trust of three generations of families in Tirupur.
        </Text>
      </View>

      {/* Stats */}
      <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {[
          { value: "25+", label: "Years" },
          { value: "916", label: "Hallmark" },
          { value: "5000+", label: "Designs" },
          { value: "3", label: "Generations" },
        ].map(({ value, label }) => (
          <View key={label} style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.gold, fontFamily: "Inter_700Bold" }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  heroBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  heroBadgeText: { fontSize: 10, letterSpacing: 1.5 },
  heroTitle: { fontSize: 26, lineHeight: 34 },
  heroSub: { fontSize: 14, lineHeight: 22, marginTop: 12 },
  card: {
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  cardTitle: { fontSize: 12, letterSpacing: 2, marginBottom: 10 },
  bodyText: { fontSize: 14, lineHeight: 22 },
  sectionTitle: { fontSize: 12, letterSpacing: 2, marginHorizontal: 20, marginTop: 20, marginBottom: 12 },
  whyGrid: { paddingHorizontal: 20, gap: 10 },
  whyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  whyIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  whyTitle: { fontSize: 14, marginBottom: 4 },
  whyDesc: { fontSize: 13, lineHeight: 20 },
  trustCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  trustText: { fontSize: 14, lineHeight: 22, textAlign: "center" },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 16,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 20 },
  statLabel: { fontSize: 11, marginTop: 2 },
});
