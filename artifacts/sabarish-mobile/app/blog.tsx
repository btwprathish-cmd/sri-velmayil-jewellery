import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { router } from "expo-router";
import { formatIndianDate } from "@/utils/rates";

const BLOG_POSTS = [
  {
    slug: "difference-between-22k-and-24k-gold",
    title: "Difference Between 22K and 24K Gold: The Ultimate Guide",
    excerpt: "Wondering whether to choose 22K or 24K gold? Learn the key differences in purity, durability, and value.",
    date: "2026-06-12",
    author: "Velmayil Expert",
    readTime: "4 min read",
  },
  {
    slug: "how-to-check-bis-hallmark",
    title: "How to Check BIS Hallmark: Avoid Fake Gold Jewellery",
    excerpt: "A step-by-step guide to verifying BIS Hallmarked jewellery and HUID numbers when buying gold in Tirupur.",
    date: "2026-06-10",
    author: "Velmayil Quality Control",
    readTime: "3 min read",
  },
  {
    slug: "gold-investment-guide",
    title: "Gold Investment Guide for Beginners in Tirupur",
    excerpt: "Discover the best ways to invest in gold, from physical coins to digital gold and Sovereign Gold Bonds.",
    date: "2026-06-05",
    author: "Sabarish Velmayil",
    readTime: "5 min read",
  },
  {
    slug: "wedding-jewellery-buying-guide",
    title: "Wedding Jewellery Buying Guide: Tamil Bridal Traditions",
    excerpt: "Essential ornaments needed for a Tamil bridal trousseau and tips for buying during rate dips.",
    date: "2026-05-28",
    author: "Wedding Consultant",
    readTime: "4 min read",
  },
  {
    slug: "daily-gold-rate-updates",
    title: "How Daily Gold Rates are Calculated in Tirupur",
    excerpt: "Understand the global and domestic factors that influence the daily gold rate in Tirupur.",
    date: "2026-05-15",
    author: "Market Analyst",
    readTime: "4 min read",
  },
];

export default function BlogScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;

  function openPost(slug: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/blog/${slug}`);
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40, paddingTop: webTop }}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.headerTitle, { color: colors.gold, fontFamily: "Inter_700Bold" }]}>Jewellery Insights</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          Expert advice from Sri Velmayil Jewellery
        </Text>
      </View>

      <View style={styles.list}>
        {BLOG_POSTS.map((post) => (
          <Pressable
            key={post.slug}
            style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 }]}
            onPress={() => openPost(post.slug)}
          >
            <View style={styles.cardMeta}>
              <Text style={[styles.date, { color: colors.gold, fontFamily: "Inter_500Medium" }]}>
                {formatIndianDate(post.date)}
              </Text>
              <View style={[styles.readBadge, { backgroundColor: colors.muted }]}>
                <Ionicons name="time-outline" size={11} color={colors.mutedForeground} />
                <Text style={[styles.readTime, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{post.readTime}</Text>
              </View>
            </View>
            <Text style={[styles.title, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>{post.title}</Text>
            <Text style={[styles.excerpt, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{post.excerpt}</Text>
            <View style={styles.footer}>
              <Text style={[styles.author, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                By {post.author}
              </Text>
              <Ionicons name="arrow-forward" size={16} color={colors.gold} />
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 28 },
  headerSub: { fontSize: 13, marginTop: 4 },
  list: { paddingHorizontal: 20, gap: 12 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  cardMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  date: { fontSize: 11 },
  readBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  readTime: { fontSize: 11 },
  title: { fontSize: 15, lineHeight: 22, marginBottom: 6 },
  excerpt: { fontSize: 13, lineHeight: 20, marginBottom: 12 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  author: { fontSize: 12 },
});
