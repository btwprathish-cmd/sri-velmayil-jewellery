import React from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

import HomePage from "@/pages/HomePage";
import GoldRateTodayPage from "@/pages/GoldRateTodayPage";
import SilverRatePage from "@/pages/SilverRatePage";
import CollectionsPage from "@/pages/CollectionsPage";
import MetalPage from "@/pages/MetalPage";
import MetalCategoryPage from "@/pages/MetalCategoryPage";

import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import FaqPage from "@/pages/FaqPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import MigratePage from "@/pages/MigratePage";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0c0418] text-[#fbf6e8] flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0c0418] text-[#fbf6e8]">
      {children}
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin/login">
        <AdminLayout>
          <AdminLoginPage />
        </AdminLayout>
      </Route>

      <Route path="/admin/dashboard">
        <AdminLayout>
          <AdminDashboardPage />
        </AdminLayout>
      </Route>

      <Route path="/admin/migrate">
        <AdminLayout>
          <MigratePage />
        </AdminLayout>
      </Route>

      <Route path="/admin">
        {() => {
          window.location.replace("/admin/dashboard");
          return null;
        }}
      </Route>

      {/* Main Routes */}
      <Route path="/">
        <Layout>
          <HomePage />
        </Layout>
      </Route>

      <Route path="/gold-rate-today-tirupur">
        <Layout>
          <GoldRateTodayPage />
        </Layout>
      </Route>

      <Route path="/silver-rate-today-tirupur">
        <Layout>
          <SilverRatePage />
        </Layout>
      </Route>

      {/* Collections Routes */}
      <Route path="/jewellery-collections/:metal/:category">
        <Layout>
          <MetalCategoryPage />
        </Layout>
      </Route>

      <Route path="/jewellery-collections/:metal">
        <Layout>
          <MetalPage />
        </Layout>
      </Route>

      <Route path="/jewellery-collections">
        <Layout>
          <CollectionsPage />
        </Layout>
      </Route>

      {/* NEW SEO FRIENDLY ROUTE */}
      <Route path="/collections">
        <Layout>
          <CollectionsPage />
        </Layout>
      </Route>

      {/* About Routes */}
      <Route path="/about-us">
        <Layout>
          <AboutPage />
        </Layout>
      </Route>

      {/* NEW SEO FRIENDLY ROUTE */}
      <Route path="/about">
        <Layout>
          <AboutPage />
        </Layout>
      </Route>

      {/* Contact Routes */}
      <Route path="/contact-us">
        <Layout>
          <ContactPage />
        </Layout>
      </Route>

      {/* NEW SEO FRIENDLY ROUTE */}
      <Route path="/contact">
        <Layout>
          <ContactPage />
        </Layout>
      </Route>

      <Route path="/faq">
        <Layout>
          <FaqPage />
        </Layout>
      </Route>

      {/* 404 Route */}
      <Route>
        <Layout>
          <div className="py-32 text-center">
            <h1 className="font-serif text-4xl font-bold text-[#D4AF37] mb-4">
              404 — Page Not Found
            </h1>

            <p className="text-[#F3E5AB]/60 mb-8">
              The page you're looking for doesn't exist.
            </p>

            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold rounded-lg"
            >
              Back to Home
            </a>
          </div>
        </Layout>
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}
