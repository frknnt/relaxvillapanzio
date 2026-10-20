"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, KeyRound, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { getErrorMessage } from "@/components/admin/admin-shared";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(() => isSupabaseConfigured());
  const [error, setError] = useState("");
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) return;

    let active = true;
    const supabase = getSupabaseBrowserClient();
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) {
        router.replace("/admin");
        return;
      }
      setChecking(false);
    });

    return () => {
      active = false;
    };
  }, [configured, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;

    setSubmitting(true);
    setError("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) throw signInError;
      if (!data.user) throw new Error("Oturum açılamadı. Lütfen tekrar deneyin.");

      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("active")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (adminError) throw adminError;
      if (!admin?.active) {
        await supabase.auth.signOut();
        throw new Error("Bu hesap yönetim paneline erişim yetkisine sahip değil.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      const message = getErrorMessage(caught, "Giriş yapılamadı.");
      setError(
        message.toLowerCase().includes("invalid login credentials")
          ? "E-posta adresi veya şifre hatalı."
          : message,
      );
      setSubmitting(false);
    }
  }

  return (
    <main className="relative grid min-h-dvh overflow-hidden bg-[#efebe4] lg:grid-cols-[1.05fr_0.95fr]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #26272b 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <section className="relative hidden min-h-dvh flex-col justify-between overflow-hidden bg-[#26282b] p-10 text-white lg:flex xl:p-14">
        <div className="absolute -top-40 -right-48 size-[34rem] rounded-full border border-white/10" />
        <div className="absolute -top-20 -right-32 size-[24rem] rounded-full border border-[#bca77d]/25" />
        <Link href="/" aria-label="Harmony Balaton Villa" className="relative z-10 inline-flex min-h-14 items-center">
          <Image
            src="/brand/logo-exact-white.svg"
            alt="Harmony Balaton Villa"
            width={394}
            height={158}
            priority
            className="h-14 w-auto"
          />
        </Link>

        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-semibold tracking-[0.28em] text-[#c8b487] uppercase">
            Yönetim merkezi
          </p>
          <h1 className="mt-5 text-5xl leading-[1.04] font-semibold tracking-[-0.05em] xl:text-6xl">
            Villayı tek bir yerden yönetin.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/60">
            Rezervasyonlar, ödemeler, dönemsel fiyatlar, içerikler ve görseller güvenli yönetici hesabınızla kontrol altında.
          </p>
        </div>

        <p className="relative z-10 text-xs text-white/35">Badacsonytomaj · Macaristan</p>
      </section>

      <section className="relative z-10 flex min-h-dvh min-w-0 items-center justify-center overflow-x-hidden p-5 sm:p-8">
        <div className="w-full min-w-0 max-w-md">
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#68696c] transition hover:text-[#2d2f33] lg:hidden"
          >
            <ArrowLeft className="size-4" />
            Siteye dön
          </Link>

          <div className="w-full min-w-0 max-w-full overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/95 p-6 shadow-[0_28px_80px_rgba(38,39,43,0.12)] backdrop-blur sm:p-9">
            <div className="mb-7 grid size-12 place-items-center rounded-2xl bg-[#2d2f33] text-white shadow-lg shadow-black/10">
              <KeyRound className="size-5" />
            </div>
            <p className="text-[0.68rem] font-bold tracking-[0.24em] text-[#9b8762] uppercase">
              Harmony Balaton Villa
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#26272b]">
              Yönetici girişi
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#77787b]">
              Devam etmek için yetkili hesabınızla oturum açın.
            </p>

            {!configured ? (
              <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                Supabase bağlantısı henüz yapılandırılmamış. Ortam değişkenlerine
                <code className="mx-1 rounded bg-amber-100 px-1 py-0.5 text-xs">
                  NEXT_PUBLIC_SUPABASE_URL
                </code>
                ve yayınlanabilir anahtarı ekleyin.
              </div>
            ) : checking ? (
              <div className="mt-8 flex items-center gap-2 text-sm text-[#77787b]">
                <LoaderCircle className="size-4 animate-spin" />
                Oturum kontrol ediliyor…
              </div>
            ) : (
              <form className="mt-7 grid min-w-0 gap-5" onSubmit={handleSubmit}>
                <label className="grid min-w-0 gap-2 text-sm font-medium text-[#36373a]">
                  E-posta adresi
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="yonetici@harmonybalatonvilla.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    disabled={submitting}
                    className="h-11 min-w-0 max-w-full bg-white"
                  />
                </label>

                <label className="grid min-w-0 gap-2 text-sm font-medium text-[#36373a]">
                  Şifre
                  <span className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      disabled={submitting}
                      className="h-11 min-w-0 max-w-full bg-white pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-[#7b7c7f] hover:bg-[#f2efe9] hover:text-[#2d2f33]"
                      aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </span>
                </label>

                {error ? (
                  <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {error}
                  </p>
                ) : null}

                <Button type="submit" size="lg" disabled={submitting} className="mt-1 h-11 w-full bg-[#2d2f33] hover:bg-[#1f2022]">
                  {submitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
                  {submitting ? "Giriş yapılıyor…" : "Giriş yap"}
                </Button>
              </form>
            )}
          </div>

          <p className="mt-5 break-words text-center text-xs leading-5 text-[#87887f]">
            Erişim yetkiniz yoksa sistem yöneticinizle iletişime geçin.
          </p>
        </div>
      </section>
    </main>
  );
}
