import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { BRAND } from "@/utils/brand";

const FAQS = [
  {
    category: "Purity & Hallmark",
    items: [
      { q: "Is all your gold BIS 916 hallmarked?", a: "Yes. Every piece of gold jewellery at Sri Velmayil Jewellery is certified with the BIS 916 Hallmark and carries a unique HUID (Hallmark Unique ID) number, guaranteeing 91.6% purity." },
      { q: "How can I verify the HUID on my jewellery?", a: "Download the official BIS CARE app from Google Play or the App Store. Go to 'Verify HUID' and enter the 6-digit alphanumeric code stamped on your piece. It will show you the manufacturer, hallmarking centre, and testing date." },
      { q: "What does the 916 stamp mean?", a: "916 means 91.6% pure gold — this is 22-carat gold. The remaining 8.4% is composed of copper and silver alloys that make the gold durable enough for intricate jewellery without compromising purity." },
    ],
  },
  {
    category: "Rates & Pricing",
    items: [
      { q: "How are daily gold rates determined in Tirupur?", a: "Tirupur gold rates follow the MJDMA (Madras Jewellers & Diamond Merchants Association) benchmark, which is based on the international LBMA gold price in USD, converted at the day's USD-INR exchange rate, plus applicable import duties and GST." },
      { q: "What are the making charges?", a: "Making charges typically range from 10% to 20% of the gold value, depending on the design complexity. Simple bands and plain bangles attract lower charges, while intricate temple jewellery or bridal sets may be higher. We provide full itemized bills with no hidden costs." },
      { q: "Is GST included in the displayed rate?", a: "The gold rate displayed is the base metal rate. A flat 3% GST is applied on the final purchase value (gold + making charges) at the time of billing, as mandated by law." },
    ],
  },
  {
    category: "Customisation & Orders",
    items: [
      { q: "Do you accept custom jewellery orders?", a: "Absolutely. We take custom orders for bridal sets, personalized necklace designs, and traditional Tamil ornaments (Kasi Maalai, Vanki, Oddiyanam). Delivery typically takes 10–20 working days. Visit our showroom to discuss your design." },
      { q: "What payment methods do you accept?", a: "We accept Cash, all major Debit/Credit Cards, UPI (GPay, PhonePe, Paytm), Net Banking, and Old Gold Exchange. EMI options are available on select card purchases." },
    ],
  },
  {
    category: "Exchange & Buyback",
    items: [
      { q: "Do you buy back gold?", a: "Yes. We buy back gold at fair market rates based on the live rate for the day. Bring your jewellery along with its original purchase bill for the best valuation. Precision karatmeter testing is done on the spot." },
      { q: "Can I exchange old gold for new jewellery?", a: "Yes, we offer gold exchange. Your old gold is assessed at its current purity-adjusted market rate and the equivalent value is deducted from your new purchase. Making charges apply on the new piece." },
    ],
  },
  {
    category: "Store & Timings",
    items: [
      { q: "What are your working hours?", a: "Monday – Saturday: 9:00 AM to 8:00 PM. Sunday: 10:00 AM to 6:00 PM. We are closed on major national holidays. Festival season hours may vary — follow our WhatsApp group for updates." },
      { q: "Where is the showroom located?", a: "We are at 89 New Market Street, Tirupur, Tamil Nadu 641604 — near the main commercial district. Easy parking is available nearby." },
    ],
  },
];

function FaqSection({ category, items }: { category: string; items: { q: string; a: string }[] }) {
  const colors = useColors();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[styles.categoryLabel, { color: colors.gold, fontFamily: "Inter_700Bold" }]}>{category.toUpperCase()}</Text>
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {items.map((item, idx) => (
          <Pressable
            key={idx}
            style={[styles.faqItem, { borderBottomColor: colors.border, borderBottomWidth: idx < items.length - 1 ? 1 : 0 }]}
            onPress={() => {
              setOpenIndex(openIndex === idx ? null : idx);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={styles.faqHeader}>
              <Text style={[styles.faqQ, { color: colors.foreground, fontFamily: "Inter_500Medium", flex: 1 }]}>{item.q}</Text>
              <Ionicons name={openIndex === idx ? "remove-circle-outline" : "add-circle-outline"} size={20} color={colors.gold} />
            </View>
            {openIndex === idx && (
              <Text style={[styles.faqA, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{item.a}</Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function FaqScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40, paddingTop: webTop }}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.headerTitle, { color: colors.gold, fontFamily: "Inter_700Bold" }]}>FAQ</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          Common questions about gold, purity, and our showroom
        </Text>
      </View>

      <View style={styles.list}>
        {FAQS.map((section) => (
          <FaqSection key={section.category} category={section.category} items={section.items} />
        ))}
      </View>

      {/* CTA */}
      <Pressable
        style={({ pressed }) => [styles.cta, { backgroundColor: colors.gold, opacity: pressed ? 0.85 : 1 }]}
        onPress={() => Linking.openURL(`tel:${BRAND.phoneE164}`)}
      >
        <Ionicons name="call" size={18} color={colors.primaryForeground} />
        <Text style={[styles.ctaText, { color: colors.primaryForeground, fontFamily: "Inter_700Bold" }]}>Still have a question? Call us</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 28 },
  headerSub: { fontSize: 13, marginTop: 4, lineHeight: 20 },
  list: { paddingHorizontal: 20 },
  categoryLabel: { fontSize: 11, letterSpacing: 1.5, marginBottom: 8 },
  section: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  faqItem: { padding: 14 },
  faqHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  faqQ: { fontSize: 14, lineHeight: 20 },
  faqA: { fontSize: 13, lineHeight: 20, marginTop: 8 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 12,
  },
  ctaText: { fontSize: 15 },
});
