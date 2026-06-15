"use client";

import dynamic from "next/dynamic";

const WhatsAppWidget = dynamic(() => import("@/components/WhatsAppWidget"), { ssr: false });

export default function DeferredWhatsAppWidget() {
  return <WhatsAppWidget />;
}
