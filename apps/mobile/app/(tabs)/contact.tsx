import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { BRAND, getWhatsAppUrl } from "@/utils/brand";
import { router } from "expo-router";

function InfoRow({ icon, label, value, onPress }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const colors = useColors();
  const content = (
    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.infoIcon, { backgroundColor: colors.gold + "18" }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.infoLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.foreground, fontFamily: "Inter_500Medium" }]}>{value}</Text>
      </View>
      {onPress && <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />}
    </View>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
        {content}
      </Pressable>
    );
  }
  return content;
}

function ActionButton({ label, color, icon, onPress }: {
  label: string;
  color: string;
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.actionBtn, { backgroundColor: color, opacity: pressed ? 0.85 : 1 }]}
      onPress={onPress}
    >
      {icon}
      <Text style={[styles.actionBtnText, { fontFamily: "Inter_700Bold" }]}>{label}</Text>
    </Pressable>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const colors = useColors();
  const [open, setOpen] = React.useState(false);
  return (
    <Pressable
      style={[styles.faqItem, { borderBottomColor: colors.border }]}
      onPress={() => {
        setOpen((p) => !p);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQ, { color: colors.foreground, fontFamily: "Inter_500Medium", flex: 1 }]}>{q}</Text>
        <Ionicons name={open ? "remove" : "add"} size={18} color={colors.gold} />
      </View>
      {open && (
        <Text style={[styles.faqA, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{a}</Text>
      )}
    </Pressable>
  );
}

const FAQS = [
  { q: "Is your gold BIS hallmarked?", a: "Yes. All our gold jewellery is BIS 916 hallmarked with HUID certification, ensuring purity and authenticity." },
  { q: "What is the making charge?", a: "Making charges range from 10–20% depending on the design complexity. We offer transparent pricing with no hidden costs." },
  { q: "Do you offer custom jewellery?", a: "Yes! We take custom orders for bridal sets, personal designs, and traditional Tamil jewellery. Visit our showroom to discuss your requirements." },
  { q: "Can I sell back gold to you?", a: "Yes, we buy back gold at fair market rates. Bring your jewellery with original bill for the best valuation." },
  { q: "What are your working hours?", a: "We are open Monday–Saturday: 9:00 AM – 8:00 PM and Sunday: 10:00 AM – 6:00 PM." },
];

export default function ContactScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;

  function handleCall() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`tel:${BRAND.phoneE164}`);
  }

  function handleWhatsApp() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const msg = getWhatsAppUrl("Hi, I would like to enquire about your jewellery collection at Sri Velmayil Jewellery Tirupur.");
    Linking.openURL(msg);
  }

  function handleWhatsAppGroup() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(BRAND.whatsappGroup);
  }

  function handleEmail() {
    Linking.openURL(`mailto:${BRAND.email}`);
  }

  function handleMaps() {
    const query = encodeURIComponent(BRAND.fullAddress);
    const url = Platform.OS === "ios"
      ? `maps:?q=${query}`
      : `https://maps.google.com/?q=${query}`;
    Linking.openURL(url);
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingTop: webTop }}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.headerTitle, { color: colors.gold, fontFamily: "Inter_700Bold" }]}>Contact Us</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          Visit us at our Tirupur showroom
        </Text>
      </View>

      {/* Quick action buttons */}
      <View style={styles.actionRow}>
        <ActionButton
          label="Call Store"
          color={colors.gold}
          icon={<Ionicons name="call" size={18} color={colors.primaryForeground} />}
          onPress={handleCall}
        />
        <ActionButton
          label="WhatsApp"
          color="#25D366"
          icon={<FontAwesome name="whatsapp" size={18} color="#fff" />}
          onPress={handleWhatsApp}
        />
      </View>

      {/* Store info card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.gold, fontFamily: "Inter_600SemiBold" }]}>Showroom Details</Text>
        <InfoRow
          icon={<Ionicons name="location" size={18} color={colors.gold} />}
          label="Address"
          value={BRAND.fullAddress}
          onPress={handleMaps}
        />
        <InfoRow
          icon={<Ionicons name="call" size={18} color={colors.gold} />}
          label="Phone"
          value={BRAND.phone}
          onPress={handleCall}
        />
        <InfoRow
          icon={<MaterialIcons name="email" size={18} color={colors.gold} />}
          label="Email"
          value={BRAND.email}
          onPress={handleEmail}
        />
        <InfoRow
          icon={<Ionicons name="time" size={18} color={colors.gold} />}
          label="Mon–Sat"
          value="9:00 AM – 8:00 PM"
        />
        <InfoRow
          icon={<Ionicons name="time" size={18} color={colors.gold} />}
          label="Sunday"
          value="10:00 AM – 6:00 PM"
        />
      </View>

      {/* WhatsApp Group */}
      <Pressable
        style={({ pressed }) => [styles.waGroupCard, { backgroundColor: "#0d2b1a", borderColor: "#25D366" + "50", opacity: pressed ? 0.85 : 1 }]}
        onPress={handleWhatsAppGroup}
      >
        <FontAwesome name="whatsapp" size={32} color="#25D366" />
        <View style={{ flex: 1 }}>
          <Text style={[styles.waGroupTitle, { fontFamily: "Inter_700Bold" }]}>Join our WhatsApp Group</Text>
          <Text style={[styles.waGroupSub, { fontFamily: "Inter_400Regular" }]}>Get daily gold rate updates & offers</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#25D366" />
      </Pressable>

      {/* About */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.gold, fontFamily: "Inter_600SemiBold" }]}>About Us</Text>
        <Text style={[styles.aboutText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          Sri Velmayil Jewellery is a trusted name in fine gold and silver jewellery in Tirupur, Tamil Nadu. With over 25 years of craftsmanship, we specialise in traditional Tamil jewellery, bridal sets, and custom designs — all certified with BIS 916 hallmark and HUID.
        </Text>
        <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
          {[
            { value: "25+", label: "Years" },
            { value: "916", label: "Hallmark" },
            { value: "5000+", label: "Designs" },
          ].map(({ value, label }) => (
            <View key={label} style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.gold, fontFamily: "Inter_700Bold" }]}>{value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* More section */}
      <Text style={[styles.sectionTitle, { color: colors.accent, fontFamily: "Inter_700Bold" }]}>MORE</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {[
          { icon: "information-circle-outline" as const, label: "About Sri Velmayil", sub: "Our story, heritage & values", route: "/about" },
          { icon: "help-circle-outline" as const, label: "FAQ", sub: "Common questions answered", route: "/faq" },
          { icon: "newspaper-outline" as const, label: "Jewellery Insights", sub: "Expert gold & buying guides", route: "/blog" },
        ].map(({ icon, label, sub, route }, idx) => (
          <Pressable
            key={route}
            style={({ pressed }) => [
              styles.moreRow,
              { borderBottomColor: colors.border, borderBottomWidth: idx < 2 ? 1 : 0, opacity: pressed ? 0.7 : 1 }
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(route as any);
            }}
          >
            <View style={[styles.infoIcon, { backgroundColor: colors.gold + "18" }]}>
              <Ionicons name={icon} size={18} color={colors.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoValue, { color: colors.foreground, fontFamily: "Inter_500Medium" }]}>{label}</Text>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </View>

      {/* Quick FAQ */}
      <Text style={[styles.sectionTitle, { color: colors.accent, fontFamily: "Inter_700Bold" }]}>QUICK ANSWERS</Text>
      <View style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {FAQS.map((faq) => (
          <FaqItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 4 },
  headerTitle: { fontSize: 28 },
  headerSub: { fontSize: 13, marginTop: 2 },
  actionRow: { flexDirection: "row", gap: 12, marginHorizontal: 20, marginTop: 16 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionBtnText: { fontSize: 15, color: "#fff" },
  card: { marginHorizontal: 20, marginTop: 16, borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  cardTitle: { fontSize: 13, letterSpacing: 1.5, padding: 14, paddingBottom: 8 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  infoIcon: { width: 36, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  infoLabel: { fontSize: 11, marginBottom: 2 },
  infoValue: { fontSize: 14 },
  waGroupCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 14,
  },
  waGroupTitle: { fontSize: 15, color: "#fff" },
  waGroupSub: { fontSize: 12, color: "#25D36699", marginTop: 2 },
  aboutText: { fontSize: 14, lineHeight: 22, padding: 14, paddingTop: 4 },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 14,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 22 },
  statLabel: { fontSize: 11, marginTop: 2 },
  sectionTitle: { fontSize: 13, letterSpacing: 2, paddingHorizontal: 20, marginTop: 24, marginBottom: 8 },
  faqCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  faqItem: { padding: 14, borderBottomWidth: 1 },
  faqHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  faqQ: { fontSize: 14, lineHeight: 20 },
  faqA: { fontSize: 13, lineHeight: 20, marginTop: 8 },
  moreRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
});
