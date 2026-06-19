import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { formatIndianDate } from "@/utils/rates";

const BLOG_POSTS: Record<string, {
  title: string;
  date: string;
  author: string;
  readTime: string;
  content: string;
}> = {
  "difference-between-22k-and-24k-gold": {
    title: "Difference Between 22K and 24K Gold: The Ultimate Guide",
    date: "2026-06-12",
    author: "Velmayil Expert",
    readTime: "4 min read",
    content: `What is the difference between 22K and 24K gold? Understanding the purity and characteristics of gold is essential before making an investment.

What is 24K Gold?
24K gold is 100% pure gold, containing no other metals. It is highly lustrous, bright yellow, and very soft.
• Purity: 24 Carats (99.9% pure)
• Durability: Very soft and malleable — not suitable for daily-wear jewellery
• Best for: Gold coins, bullion bars, and investment

What is 22K Gold?
22K gold is 91.6% pure gold (also known as 916 Gold). The remaining 8.4% is copper and silver alloy that adds durability.
• Purity: 22 Carats (91.6% pure)
• Durability: Harder and scratch-resistant
• Best for: Wedding necklaces, bangles, bridal and daily-wear jewellery

Purity Comparison:
24K = 99.9% → Coins & Bars (Investment)
22K = 91.6% → Intricate Jewellery (916 Hallmark)
18K = 75.0% → Stone-studded Jewellery

Key Takeaway:
Choose 24K for savings or investment. Choose 22K for wearable jewellery. Both hold strong resale value. Always look for the BIS Hallmark and HUID number on every piece.`,
  },
  "how-to-check-bis-hallmark": {
    title: "How to Check BIS Hallmark: Avoid Fake Gold Jewellery",
    date: "2026-06-10",
    author: "Velmayil Quality Control",
    readTime: "3 min read",
    content: `Since April 1, 2023, all gold jewellery sold in India must carry BIS Hallmarking. Here's how to verify your gold.

The Three Signs of Authenticity:
1. BIS Logo — The Bureau of Indian Standards triangular mark
2. Purity Stamp — e.g. 22K916 (91.6% pure), 18K750 (75% pure)
3. HUID Code — A unique 6-digit alphanumeric ID (e.g. AB12CD)

How to Verify via BIS CARE App:
1. Download the BIS CARE app from Google Play or the App Store
2. Tap 'Verify HUID'
3. Enter the 6-digit HUID code from your jewellery
4. The app shows: registry date, jewellery type, manufacturer name, and hallmarking centre

At Sri Velmayil Jewellery Tirupur, all our gold is 100% BIS Hallmarked with HUID — guaranteeing absolute purity and peace of mind.`,
  },
  "gold-investment-guide": {
    title: "Gold Investment Guide for Beginners in Tirupur",
    date: "2026-06-05",
    author: "Sabarish Velmayil",
    readTime: "5 min read",
    content: `Gold has historically been a symbol of wealth and a safe financial haven. Here are the best gold investment strategies for beginners.

1. Physical Gold (Jewellery & Coins)
• Gold Coins & Bars: Buy 24K gold coins (1g to 50g). Lower making charges than jewellery and maximum liquidity.
• Gold Jewellery: BIS 916 gold jewellery serves as both a lifestyle asset and emergency liquidity.

2. Sovereign Gold Bonds (SGBs)
Issued by the Reserve Bank of India (RBI).
• Earn 2.5% fixed annual interest (paid semi-annually)
• Capital gains are completely tax-free at maturity (8 years)
• No physical gold to store

3. Digital Gold
Buy as little as ₹10 online. The provider stores physical gold in secure vaults on your behalf.

Why Invest in Gold Now?
• Inflation Hedge: Gold value increases when currency purchasing power drops
• Portfolio Diversification: Gold often moves opposite to stock markets, reducing overall risk`,
  },
  "wedding-jewellery-buying-guide": {
    title: "Wedding Jewellery Buying Guide: Tamil Bridal Traditions",
    date: "2026-05-28",
    author: "Wedding Consultant",
    readTime: "4 min read",
    content: `A Tamil wedding is incomplete without traditional yellow gold jewellery. Here is a checklist for the essential bridal set.

Essential Tamil Bridal Ornaments:
1. Kasu Mala — Long necklace of gold coins stamped with Goddess Lakshmi, symbolizing prosperity
2. Manga Malai — Mango-motif necklace, often embellished with rubies and emeralds
3. Vanki (Armlet) — Inverted V-shaped armlet with deity engravings
4. Oddiyanam (Waist Belt) — Gold waist chain holding the bridal saree
5. Jhumkas & Mattal — Bell-shaped earrings with gold chain extensions
6. Nethi Chutti — Gold maang tikka worn on the forehead

Tips for Buying Wedding Jewellery:
• Plan Early: Track the gold rate history and buy during rate dips
• Allocate by Category: Budget for the heavy bridal haram first, then shorter necklaces and bangles
• Verify the Hallmark: Insist on BIS 916 and HUID on every ornament
• Custom Orders: Allow 10–20 working days for custom bridal sets at Sri Velmayil`,
  },
  "daily-gold-rate-updates": {
    title: "How Daily Gold Rates are Calculated in Tirupur",
    date: "2026-05-15",
    author: "Market Analyst",
    readTime: "4 min read",
    content: `Why does the gold rate change every day? Here's what drives the daily gold rate in Tirupur.

International Factors (The Base Price):
• LBMA (London Bullion Market Association): The global benchmark, priced in USD per troy ounce (~31.1g)
• USD-INR Exchange Rate: A weaker Rupee against the Dollar increases gold import costs and domestic prices
• US Federal Reserve Interest Rates: Lower US rates make gold more attractive, pushing global prices higher

Domestic Factors (Indian Import & Taxes):
• Import Duty: India imports most of its gold; government import duties directly add to cost
• GST: A flat 3% GST is applied on the final purchase value

Local Factors in Tamil Nadu:
• MJDMA (Madras Jewellers & Diamond Merchants Association): Sets daily opening rates for Tamil Nadu, used as the primary benchmark in Tirupur
• Local Demand: Festival seasons (Akshaya Tritiya, Diwali) and wedding seasons can cause minor local premiums

By tracking the daily rate and buying during dips, you can optimize your gold purchases significantly.`,
  },
};

function renderContent(content: string, colors: ReturnType<typeof useColors>) {
  const paragraphs = content.split("\n\n");
  return paragraphs.map((para, i) => {
    const lines = para.split("\n");
    return (
      <View key={i} style={{ marginBottom: 16 }}>
        {lines.map((line, j) => {
          if (line.startsWith("•") || line.match(/^\d+\./)) {
            return (
              <View key={j} style={styles.bulletRow}>
                <Text style={[styles.bullet, { color: colors.gold }]}>·</Text>
                <Text style={[styles.bodyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular", flex: 1 }]}>
                  {line.replace(/^[•\d+\.]\s*/, "")}
                </Text>
              </View>
            );
          }
          const isHeading = line.length < 60 && !line.includes("→") && line === lines[0] && j === 0;
          if (isHeading && i > 0) {
            return (
              <Text key={j} style={[styles.paraHeading, { color: colors.accent, fontFamily: "Inter_600SemiBold" }]}>{line}</Text>
            );
          }
          return (
            <Text key={j} style={[styles.bodyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{line}</Text>
          );
        })}
      </View>
    );
  });
}

export default function BlogPostScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;

  const post = BLOG_POSTS[slug ?? ""];

  if (!post) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Ionicons name="document-outline" size={48} color={colors.mutedForeground} />
        <Text style={[{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 12 }]}>Article not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40, paddingTop: webTop }}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <View style={styles.metaRow}>
          <Text style={[styles.date, { color: colors.gold, fontFamily: "Inter_500Medium" }]}>
            {formatIndianDate(post.date)}
          </Text>
          <View style={[styles.readBadge, { backgroundColor: colors.muted }]}>
            <Ionicons name="time-outline" size={11} color={colors.mutedForeground} />
            <Text style={[styles.readTime, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{post.readTime}</Text>
          </View>
        </View>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>{post.title}</Text>
        <Text style={[styles.author, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>By {post.author}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderContent(post.content, colors)}
      </View>

      {/* Trust footer */}
      <View style={[styles.trustFooter, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="shield-checkmark" size={20} color={colors.gold} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.trustTitle, { color: colors.gold, fontFamily: "Inter_600SemiBold" }]}>Sri Velmayil Trust Certification</Text>
          <Text style={[styles.trustSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            This article is written by our jewellery specialists to help you make informed gold purchases.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  date: { fontSize: 12 },
  readBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  readTime: { fontSize: 11 },
  title: { fontSize: 22, lineHeight: 30, marginBottom: 8 },
  author: { fontSize: 12 },
  content: { paddingHorizontal: 20 },
  bodyText: { fontSize: 14, lineHeight: 22 },
  paraHeading: { fontSize: 15, marginBottom: 6 },
  bulletRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  bullet: { fontSize: 20, lineHeight: 22 },
  trustFooter: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginHorizontal: 20,
    marginTop: 24,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  trustTitle: { fontSize: 13, marginBottom: 4 },
  trustSub: { fontSize: 12, lineHeight: 18 },
});
