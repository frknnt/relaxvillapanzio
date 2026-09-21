"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, DatabaseZap, LoaderCircle, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { AdminShell, ADMIN_NAV, type AdminView } from "@/components/admin/admin-shell";
import { DashboardView } from "@/components/admin/dashboard-view";
import { ReservationsView } from "@/components/admin/reservations-view";
import { SupportView } from "@/components/admin/support-view";
import { RatesView } from "@/components/admin/rates-view";
import { AvailabilityView } from "@/components/admin/availability-view";
import { BlogView } from "@/components/admin/blog-view";
import { GalleryView } from "@/components/admin/gallery-view";
import { SettingsView } from "@/components/admin/settings-view";

type GateState =
  | { status: "loading" }
  | { status: "not-configured" }
  | { status: "unauthorized"; email: string }
  | { status: "error"; message: string }
  | {
      status: "ready";
      userId: string;
      email: string;
      displayName: string;
    };

function getInitialView(): AdminView {
  if (typeof window === "undefined") return "dashboard";
  const value = window.location.hash.replace("#", "") as AdminView;
  return ADMIN_NAV.some((item) => item.id === value) ? value : "dashboard";
}

export function AdminPortal() {
  const router = useRouter();
  const [gate, setGate] = useState<GateState>({ status: "loading" });
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setActiveView(getInitialView()), 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const verifyAccess = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setGate({ status: "not-configured" });
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        router.replace("/admin/login");
        return;
      }

      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("display_name, active")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (adminError) throw adminError;
      if (!admin?.active) {
        setGate({
          status: "unauthorized",
          email: userData.user.email ?? "Bilinmeyen hesap",
        });
        return;
      }

      setGate({
        status: "ready",
        userId: userData.user.id,
        email: userData.user.email ?? "",
        displayName: String(admin.display_name ?? ""),
      });
    } catch (caught) {
      setGate({
        status: "error",
        message:
          caught instanceof Error
            ? caught.message
            : "Yönetici yetkisi doğrulanamadı.",
      });
    }
  }, [router]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void verifyAccess(), 0);
    if (!isSupabaseConfigured()) {
      return () => window.clearTimeout(timeoutId);
    }

    const supabase = getSupabaseBrowserClient();
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") router.replace("/admin/login");
    });
    return () => {
      window.clearTimeout(timeoutId);
      data.subscription.unsubscribe();
    };
  }, [router, verifyAccess]);

  function handleViewChange(view: AdminView) {
    setActiveView(view);
    window.history.replaceState(null, "", `/admin#${view}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSignOut() {
    if (!isSupabaseConfigured()) return;
    setSigningOut(true);
    await getSupabaseBrowserClient().auth.signOut();
    router.replace("/admin/login");
  }

  if (gate.status === "loading") {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#f5f2ed] p-6">
        <div className="flex items-center gap-3 text-sm text-[#747579]">
          <LoaderCircle className="size-5 animate-spin text-[#9a855f]" />
          Yönetici hesabı doğrulanıyor…
        </div>
      </main>
    );
  }

  if (gate.status !== "ready") {
    const content = {
      "not-configured": {
        icon: DatabaseZap,
        title: "Supabase bağlantısı eksik",
        description:
          "Yönetim panelinin çalışması için yayınlanabilir Supabase bağlantı bilgileri ortam değişkenlerine eklenmeli.",
      },
      unauthorized: {
        icon: ShieldX,
        title: "Bu hesap yetkili değil",
        description: `${gate.status === "unauthorized" ? gate.email : "Bu hesap"} için aktif yönetici kaydı bulunamadı.`,
      },
      error: {
        icon: AlertTriangle,
        title: "Panel açılamadı",
        description: gate.status === "error" ? gate.message : "Beklenmeyen bir hata oluştu.",
      },
    }[gate.status];
    const Icon = content.icon;

    return (
      <main className="grid min-h-dvh place-items-center bg-[#f5f2ed] p-6">
        <div className="w-full max-w-md rounded-3xl border border-[#e1dcd4] bg-white p-7 text-center shadow-[0_24px_70px_rgba(38,39,43,0.1)] sm:p-9">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f1ede7] text-[#8f7a56]">
            <Icon className="size-6" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-[-0.035em]">{content.title}</h1>
          <p className="mt-3 text-sm leading-6 text-[#77787b]">{content.description}</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            {gate.status === "error" ? (
              <Button onClick={() => void verifyAccess()}>Tekrar dene</Button>
            ) : null}
            {gate.status === "unauthorized" ? (
              <Button onClick={() => void handleSignOut()}>Başka hesapla giriş yap</Button>
            ) : (
              <Button asChild variant={gate.status === "error" ? "outline" : "default"}>
                <Link href="/admin/login">Giriş sayfasına git</Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href="/">Siteye dön</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <AdminShell
      activeView={activeView}
      onViewChange={handleViewChange}
      displayName={gate.displayName}
      email={gate.email}
      onSignOut={() => void handleSignOut()}
      signingOut={signingOut}
    >
      {activeView === "dashboard" ? <DashboardView /> : null}
      {activeView === "reservations" ? <ReservationsView /> : null}
      {activeView === "support" ? <SupportView userId={gate.userId} /> : null}
      {activeView === "rates" ? <RatesView userId={gate.userId} /> : null}
      {activeView === "availability" ? <AvailabilityView userId={gate.userId} /> : null}
      {activeView === "blog" ? <BlogView userId={gate.userId} /> : null}
      {activeView === "gallery" ? <GalleryView userId={gate.userId} /> : null}
      {activeView === "settings" ? <SettingsView userId={gate.userId} /> : null}
    </AdminShell>
  );
}
