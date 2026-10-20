# Harmony Balaton Villa yönetici paneli kurulumu

Panel ve veritabanı bağlantısı hazırdır. Güvenlik nedeniyle yönetici şifresi kodda
tutulmaz. İlk hesabı yalnızca bir kez Supabase panelinden oluşturmanız gerekir.

## 1. Yönetici hesabını oluşturun

1. Supabase Dashboard içinde **Authentication → Users** sayfasını açın.
2. **Add user → Create new user** seçeneğini kullanın.
3. Müşterinizin e-posta adresini ve güçlü, benzersiz bir şifreyi girin.
4. Hesabı oluşturun. Şifreyi kaynak koda, GitHub'a veya bu SQL dosyalarına yazmayın.
5. **Authentication → Attack Protection** bölümünde leaked password protection
   özelliğini etkinleştirin.

## 2. Hesaba panel yetkisi verin

Supabase **SQL Editor** içinde aşağıdaki sorguyu çalıştırın. E-posta adresini ilk
adımda oluşturduğunuz gerçek adresle değiştirin.

```sql
insert into public.admin_users (user_id, display_name, active)
select id, 'Villa Owner', true
from auth.users
where lower(email) = lower('OWNER_EMAIL_HERE')
on conflict (user_id) do update
set display_name = excluded.display_name,
    active = true,
    updated_at = now();
```

Sorgu sonunda bir yönetici kaydı bulunduğunu doğrulamak için:

```sql
select au.email, admins.display_name, admins.active
from public.admin_users admins
join auth.users au on au.id = admins.user_id;
```

## 3. İlk panel ayarlarını tamamlayın

`/admin/login` adresinden giriş yaptıktan sonra şu sırayı izleyin:

1. **Rezervasyon ayarları:** IBAN, hesap sahibi, banka adı, WhatsApp numarası,
   evcil hayvan ücreti, maksimum kapasite, ödeme bekleme süresi, iptal koşulları,
   veri saklama süresi ve işletmeci bilgileri.
2. **Dönemsel fiyatlar:** Rezervasyona açılacak her ay için tüm villa ve dört
   odanın ayrı hafta içi/hafta sonu gecelik fiyatı ile minimum gece sayısı.
3. **Kapalı tarihler:** Bakım veya özel kullanım günleri.
4. **Blog yazıları:** Kapak görselini doğrudan yükleyin; EN/DE/HU/TR içerikleri
   taslak veya yayında olarak yönetin.
5. **Galeri:** Görselleri yükleyin, kategori/oda/sıra ve dört dilde açıklama ekleyin.

Fiyat tanımlanmayan aylar müşteri takviminde seçilemez. Bu davranış eksik fiyatla
yanlış rezervasyon alınmasını önlemek içindir.

## 4. Canlı ortama değişkenleri ekleyin

`.env.example` içindeki üç değişkeni hosting servisinde tanımlayın:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
```

Yalnızca publishable key kullanılır. `service_role` anahtarını hiçbir zaman
tarayıcıya, `.env.local` dışındaki dosyalara veya GitHub'a koymayın.

## Rezervasyon akışı

1. Misafir fiyatı tanımlı oda veya odaları ve yalnızca o odalar için boş tarihleri seçer.
2. Sistem geceleri hafta içi/hafta sonu olarak hesaplar ve varsa evcil hayvan
   ücretini bir kez ekler.
3. Talep `Ödeme bekleniyor` durumunda oluşur ve tarihler geçici olarak kapanır.
4. Misafir IBAN'a havale yapıp dekontu WhatsApp üzerinden gönderir.
5. İşletme sahibi panelden **Ödemeyi onayla** dediğinde rezervasyon `Onaylandı`,
   ödeme de `Alındı` olur.
6. Ödeme bekleme süresi geçen talepler yeni rezervasyon işlemi sırasında otomatik
   olarak süresi dolmuş duruma alınır.

## Güvenlik özeti

- Tüm işletme tablolarında Row Level Security aktiftir.
- Müşteri kişisel bilgileri anonim API sorgularına kapalıdır.
- Yönetim işlemleri yalnızca aktif `admin_users` kayıtlarına açıktır.
- İletişim formu tabloya doğrudan yazmaz; sunucu doğrulamalı ve hız sınırlı RPC kullanır.
- Rezervasyon ve iletişim formlarındaki bot tuzakları veritabanında da doğrulanır.
- Görseller `villa-media` bucket'ına benzersiz yollarla yüklenir.
- IBAN ödemesi site tarafından tahsil edilmez; panel yalnızca işletme sahibinin
  banka hesabında gördüğü ödemeyi onaylamasını kaydeder.
