from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    XPreformatted,
)
from reportlab.graphics.shapes import Drawing, Line, Rect, String


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "output" / "pdf" / "Relax-Villa-Site-Kullanim-Rehberi.pdf"

NAVY = colors.HexColor("#25282E")
INK = colors.HexColor("#26272B")
MUTED = colors.HexColor("#6F7073")
GOLD = colors.HexColor("#A08F6D")
GOLD_LIGHT = colors.HexColor("#E7DDC9")
WARM = colors.HexColor("#FAF8F5")
WARM_2 = colors.HexColor("#F1EDE7")
BORDER = colors.HexColor("#E5E0D8")
GREEN = colors.HexColor("#55705D")
RED = colors.HexColor("#A43E35")


pdfmetrics.registerFont(TTFont("Arial", r"C:\Windows\Fonts\arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", r"C:\Windows\Fonts\arialbd.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Italic", r"C:\Windows\Fonts\ariali.ttf"))
consolas_path = Path(r"C:\Windows\Fonts\consola.ttf")
pdfmetrics.registerFont(TTFont("Code", str(consolas_path if consolas_path.exists() else Path(r"C:\Windows\Fonts\arial.ttf"))))


PAGE_W, PAGE_H = A4
LEFT = 18 * mm
RIGHT = 18 * mm
TOP = 20 * mm
BOTTOM = 18 * mm


base = getSampleStyleSheet()
styles = {
    "cover_kicker": ParagraphStyle(
        "cover_kicker",
        fontName="Arial-Bold",
        fontSize=9,
        leading=12,
        textColor=GOLD_LIGHT,
        tracking=2.2,
        alignment=TA_CENTER,
        spaceAfter=12,
    ),
    "cover_title": ParagraphStyle(
        "cover_title",
        fontName="Arial-Bold",
        fontSize=31,
        leading=34,
        textColor=colors.white,
        alignment=TA_CENTER,
        spaceAfter=14,
    ),
    "cover_subtitle": ParagraphStyle(
        "cover_subtitle",
        fontName="Arial",
        fontSize=12,
        leading=19,
        textColor=colors.HexColor("#D9D9DA"),
        alignment=TA_CENTER,
    ),
    "h1": ParagraphStyle(
        "h1",
        fontName="Arial-Bold",
        fontSize=23,
        leading=27,
        textColor=INK,
        spaceBefore=4,
        spaceAfter=12,
    ),
    "h2": ParagraphStyle(
        "h2",
        fontName="Arial-Bold",
        fontSize=15,
        leading=19,
        textColor=INK,
        spaceBefore=12,
        spaceAfter=7,
    ),
    "h3": ParagraphStyle(
        "h3",
        fontName="Arial-Bold",
        fontSize=11.5,
        leading=15,
        textColor=GOLD,
        spaceBefore=8,
        spaceAfter=5,
    ),
    "body": ParagraphStyle(
        "body",
        fontName="Arial",
        fontSize=9.4,
        leading=14.2,
        textColor=INK,
        spaceAfter=7,
    ),
    "small": ParagraphStyle(
        "small",
        fontName="Arial",
        fontSize=8.2,
        leading=12,
        textColor=MUTED,
        spaceAfter=5,
    ),
    "bullet": ParagraphStyle(
        "bullet",
        fontName="Arial",
        fontSize=9.3,
        leading=13.7,
        textColor=INK,
        leftIndent=13,
        firstLineIndent=-8,
        bulletIndent=0,
        spaceAfter=4,
    ),
    "number": ParagraphStyle(
        "number",
        fontName="Arial",
        fontSize=9.3,
        leading=13.7,
        textColor=INK,
        leftIndent=18,
        firstLineIndent=-13,
        spaceAfter=5,
    ),
    "code": ParagraphStyle(
        "code",
        fontName="Code",
        fontSize=7.6,
        leading=11.2,
        textColor=colors.HexColor("#E8E8E8"),
        leftIndent=0,
        rightIndent=0,
    ),
    "toc": ParagraphStyle(
        "toc",
        fontName="Arial",
        fontSize=10,
        leading=15,
        textColor=INK,
        spaceAfter=5,
    ),
    "callout_title": ParagraphStyle(
        "callout_title",
        fontName="Arial-Bold",
        fontSize=9.3,
        leading=12,
        textColor=INK,
        spaceAfter=3,
    ),
    "callout_body": ParagraphStyle(
        "callout_body",
        fontName="Arial",
        fontSize=8.7,
        leading=13,
        textColor=INK,
    ),
}


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(LEFT, 13 * mm, PAGE_W - RIGHT, 13 * mm)
    canvas.setFont("Arial", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(LEFT, 8.5 * mm, "RELAX VILLA PANZIO - SITE KULLANIM REHBERI")
    canvas.drawRightString(PAGE_W - RIGHT, 8.5 * mm, f"Sayfa {doc.page}")
    canvas.restoreState()


def cover_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setFillColor(GOLD)
    canvas.rect(0, PAGE_H - 10 * mm, PAGE_W, 10 * mm, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor("#343841"))
    canvas.circle(PAGE_W / 2, 54 * mm, 52 * mm, fill=1, stroke=0)
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(1)
    canvas.circle(PAGE_W / 2, 54 * mm, 34 * mm, fill=0, stroke=1)
    canvas.setFont("Arial-Bold", 30)
    canvas.setFillColor(GOLD_LIGHT)
    canvas.drawCentredString(PAGE_W / 2, 49 * mm, "RV")
    canvas.restoreState()


def section_title(number, title, intro=None):
    parts = [Paragraph(f'<font color="#A08F6D">{number}</font>  {title}', styles["h1"])]
    if intro:
        parts.append(Paragraph(intro, styles["body"]))
    parts.append(Spacer(1, 2 * mm))
    return parts


def p(text, style="body"):
    return Paragraph(text, styles[style])


def bullet(text):
    return Paragraph(f"• {text}", styles["bullet"])


def numbered(n, text):
    return Paragraph(f"{n}. {text}", styles["number"])


def code(text):
    block = XPreformatted(text.strip("\n"), styles["code"])
    table = Table([[block]], colWidths=[PAGE_W - LEFT - RIGHT - 8 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), NAVY),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#3D424C")),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return table


def callout(title, body, tone="gold"):
    accent = GOLD if tone == "gold" else (GREEN if tone == "green" else RED)
    table = Table(
        [["", [Paragraph(title, styles["callout_title"]), Paragraph(body, styles["callout_body"])]]],
        colWidths=[3 * mm, PAGE_W - LEFT - RIGHT - 11 * mm],
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, 0), accent),
                ("BACKGROUND", (1, 0), (1, 0), WARM),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (0, 0), 0),
                ("RIGHTPADDING", (0, 0), (0, 0), 0),
                ("TOPPADDING", (0, 0), (0, 0), 0),
                ("BOTTOMPADDING", (0, 0), (0, 0), 0),
                ("LEFTPADDING", (1, 0), (1, 0), 10),
                ("RIGHTPADDING", (1, 0), (1, 0), 10),
                ("TOPPADDING", (1, 0), (1, 0), 9),
                ("BOTTOMPADDING", (1, 0), (1, 0), 9),
                ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
            ]
        )
    )
    table.spaceAfter = 4 * mm
    return table


def info_table(rows, widths=None, header=True):
    available = PAGE_W - LEFT - RIGHT
    widths = widths or [available * 0.31, available * 0.69]
    cooked = []
    for row_index, row in enumerate(rows):
        cooked.append(
            [
                Paragraph(str(cell), styles["callout_title"] if header and row_index == 0 else styles["small"])
                for cell in row
            ]
        )
    table = Table(cooked, colWidths=widths, repeatRows=1 if header else 0, hAlign="LEFT")
    commands = [
        ("GRID", (0, 0), (-1, -1), 0.45, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    if header:
        commands += [
            ("BACKGROUND", (0, 0), (-1, 0), NAVY),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ]
    for idx in range(1 if header else 0, len(rows)):
        if idx % 2 == 0:
            commands.append(("BACKGROUND", (0, idx), (-1, idx), WARM))
    table.setStyle(TableStyle(commands))
    return table


def architecture_drawing():
    w = PAGE_W - LEFT - RIGHT
    d = Drawing(w, 75 * mm)
    box_w = 43 * mm
    box_h = 18 * mm
    centers = [26 * mm, 80 * mm, 134 * mm]
    labels = [
        ("METIN", "site-content.ts\nsecondary-content.ts"),
        ("SAYFALAR", "page.tsx\npage-content.tsx"),
        ("SUNUM", "Tailwind CSS\ncomponents/site"),
    ]
    for i, (head, body) in enumerate(labels):
        x = centers[i]
        y = 38 * mm
        d.add(Rect(x, y, box_w, box_h, 4, 4, fillColor=WARM, strokeColor=BORDER, strokeWidth=1))
        d.add(String(x + 4 * mm, y + 11.5 * mm, head, fontName="Arial-Bold", fontSize=8, fillColor=GOLD))
        for j, line in enumerate(body.split("\n")):
            d.add(String(x + 4 * mm, y + (7 - j * 4) * mm, line, fontName="Arial", fontSize=7.2, fillColor=INK))
        if i < 2:
            d.add(Line(x + box_w + 3 * mm, y + 9 * mm, centers[i + 1] - 3 * mm, y + 9 * mm, strokeColor=GOLD, strokeWidth=1.2))
    d.add(Rect(26 * mm, 7 * mm, 151 * mm, 18 * mm, 4, 4, fillColor=NAVY, strokeColor=NAVY))
    d.add(String(31 * mm, 18 * mm, "TARAYICIDA GORUNEN SONUC", fontName="Arial-Bold", fontSize=8.5, fillColor=GOLD_LIGHT))
    d.add(String(31 * mm, 12 * mm, "Ana sayfa + About + Rooms + Blog + Contact", fontName="Arial", fontSize=8, fillColor=colors.white))
    for cx in centers:
        d.add(Line(cx + box_w / 2, 38 * mm, cx + box_w / 2, 25 * mm, strokeColor=BORDER, strokeWidth=0.8))
    return d


doc = BaseDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    leftMargin=LEFT,
    rightMargin=RIGHT,
    topMargin=TOP,
    bottomMargin=BOTTOM,
    title="Relax Villa Panzio Site Kullanım Rehberi",
    author="OpenAI Codex",
    subject="Relax Villa Panzio web sitesi düzenleme ve bakım kılavuzu",
)

cover_frame = Frame(25 * mm, 25 * mm, PAGE_W - 50 * mm, PAGE_H - 50 * mm, id="cover")
body_frame = Frame(LEFT, BOTTOM, PAGE_W - LEFT - RIGHT, PAGE_H - TOP - BOTTOM, id="body")
doc.addPageTemplates(
    [
        PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_bg),
        PageTemplate(id="Body", frames=[body_frame], onPage=footer),
    ]
)

story = []

# Cover
story += [
    Spacer(1, 48 * mm),
    Paragraph("PROJE EL KITABI", styles["cover_kicker"]),
    Paragraph("Relax Villa Panzio<br/>Web Sitesi Kullanım Rehberi", styles["cover_title"]),
    Paragraph(
        "Metinleri, dilleri, görselleri, rezervasyon alanını ve iletişim bilgilerini<br/>güvenli şekilde değiştirmek için baştan sona rehber",
        styles["cover_subtitle"],
    ),
    Spacer(1, 77 * mm),
    Paragraph("Next.js / TypeScript / Tailwind CSS", styles["cover_kicker"]),
    Paragraph("Hazırlanma tarihi: 16 Eylül 2026", styles["cover_subtitle"]),
    NextPageTemplate("Body"),
    PageBreak(),
]

# Contents and mental model
story += section_title("00", "Bu rehber ne işe yarıyor?")
story += [
    p(
        "Bu PDF, projeyi daha önce hiç görmemiş biri için yazıldı. Hedefin şudur: VS Code içinde doğru dosyayı bulmak, metni veya görseli değiştirmek, üç dili bozmamak, sonucu yerelde kontrol etmek ve son kararı kendin vererek Git işlemlerini yapmak."
    ),
    callout(
        "En önemli fikir",
        "Bu sitede metinlerin büyük kısmı sayfa bileşenlerinin içine dağınık yazılmadı. Ana sayfa metinleri app/site-content.ts, diğer sayfaların metinleri app/secondary-content.ts içinde üç dil halinde tutuluyor.",
    ),
    p("İçindekiler", "h2"),
]
for item in [
    "01 - Sistemin genel yapısı",
    "02 - Projeyi VS Code ile açmak ve çalıştırmak",
    "03 - Metinleri değiştirme sistemi",
    "04 - Üç dil mantığı",
    "05 - Ana sayfa ve rezervasyon akışı",
    "06 - About, Rooms, Blog ve Contact sayfaları",
    "07 - Görseller ve galeri",
    "08 - WhatsApp, e-posta ve IBAN ayarları",
    "09 - Tasarım ve Tailwind sınıfları",
    "10 - SEO başlıkları",
    "11 - Güvenli çalışma ve kontrol listesi",
    "12 - Hızlı tarifler ve sorun giderme",
]:
    story.append(Paragraph(item, styles["toc"]))

story.append(PageBreak())

# 01
story += section_title(
    "01",
    "Sistemin genel yapısı",
    "Proje, Next.js App Router düzeninde TypeScript ile yazıldı. Görünüm Tailwind CSS sınıflarıyla kuruluyor. Çalıştırma ve üretim derlemesi Vinext/Vite katmanı üzerinden yapılıyor.",
)
story += [
    architecture_drawing(),
    p("Sistemi üç katman gibi düşünebilirsin:", "h2"),
    bullet("İçerik katmanı: Yazılar, çeviriler, iletişim bilgileri ve görsel listeleri."),
    bullet("Sayfa katmanı: Hangi bölümün nerede görüneceğini belirleyen React/TSX dosyaları."),
    bullet("Sunum katmanı: Renk, boşluk, sütun, mobil davranış ve animasyon gibi Tailwind/CSS ayarları."),
    p("Ana dosya haritası", "h2"),
    info_table(
        [
            ["Dosya / klasör", "Görevi"],
            ["app/page.tsx", "Ana sayfa, hero, sayaçlar, rezervasyon alanı ve ödeme penceresi."],
            ["app/site-content.ts", "Ana sayfanın EN/DE/HU metinleri."],
            ["app/secondary-content.ts", "About, Rooms, Blog, Contact, ortak menü ve footer metinleri."],
            ["app/site-config.ts", "WhatsApp numarası, e-posta adresi ve IBAN."],
            ["app/about + app/rooms", "Hakkımızda, odalar ve galeri sayfaları."],
            ["app/blog + app/contact", "Blog kartları, iletişim formu, iletişim kartı ve harita."],
            ["components/site", "Header, footer, dil sistemi ve tekrar kullanılan site parçaları."],
            ["public/images", "Sitede kullanılan tüm fotoğraflar."],
            ["app/globals.css", "Genel renkler, fontlar ve ortak yardımcı sınıflar."],
        ],
        widths=[52 * mm, 120 * mm],
    ),
    callout(
        "Dokunmaman gereken klasörler",
        "node_modules, dist, .next, .wrangler ve .sites-runtime klasörleri kaynak kod değildir. Bunlar otomatik oluşturulur. Metin değiştirmek için bu klasörlere girme.",
        "red",
    ),
]

story.append(PageBreak())

# 02
story += section_title("02", "Projeyi VS Code ile açmak ve çalıştırmak")
story += [
    p("Proje klasörü:"),
    code(r"C:\Users\furka\Documents\ChatGPT\Relax Villa Panzio"),
    p("VS Code içinde açmanın en kolay yolu", "h2"),
    numbered(1, "VS Code'u aç."),
    numbered(2, "File > Open Folder menüsünden yukarıdaki Relax Villa Panzio klasörünü seç."),
    numbered(3, "Terminal > New Terminal ile terminali aç."),
    numbered(4, "İlk kurulum gerekiyorsa npm install çalıştır."),
    numbered(5, "Siteyi çalıştırmak için npm run dev yaz."),
    code("npm install\nnpm run dev"),
    p(
        "Terminal sana bir Local adres verir. Bu projede genellikle http://localhost:5173 görünür. Tarayıcıda bu adresi açınca kaydettiğin değişiklikler çoğu zaman otomatik yenilenir."
    ),
    p("VS Code kısayolları", "h2"),
    info_table(
        [
            ["Kısayol", "Ne yapar?"],
            ["Ctrl + P", "Dosya adını yazarak hızlıca açar."],
            ["Ctrl + Shift + F", "Tüm projede bir metni arar. Değiştirmek istediğin cümleyi bulmanın en hızlı yoludur."],
            ["Ctrl + S", "Dosyayı kaydeder."],
            ["Ctrl + `", "Terminali açar veya gizler."],
            ["Alt + Shift + F", "Açık dosyayı biçimlendirir. VS Code formatter ayarlıysa kullan."],
        ],
    ),
    callout(
        "Bir yazıyı bulamıyorsan",
        "Ekranda gördüğün cümlenin 4-6 kelimesini kopyala, Ctrl + Shift + F ile ara. Sonuç büyük ihtimalle site-content.ts veya secondary-content.ts içinde çıkar.",
        "green",
    ),
]

story.append(PageBreak())

# 03
story += section_title("03", "Metinleri değiştirme sistemi")
story += [
    p("Ana sayfa metinleri: app/site-content.ts", "h2"),
    p(
        "Bu dosyada en, de ve hu adında üç ana blok vardır. Her blok aynı anahtarları taşır. Örneğin hero başlığı heroTitle, rezervasyon başlığı bookingTitle, evcil hayvan sayacı pets anahtarıyla gelir."
    ),
    code(
        '''export const siteCopy = {
  en: {
    heroTitle: "ONE VILLA. FOUR BEDROOMS. ALL YOURS.",
    adults: "Adults",
    children: "Children",
    pets: "Pets + fee",
  },
  de: { ... },
  hu: { ... },
} as const;'''
    ),
    p("İç sayfa metinleri: app/secondary-content.ts", "h2"),
    p(
        "About, Rooms, Blog ve Contact metinleri bu dosyadadır. Dosya yine en/de/hu bloklarından oluşur. Her dilin içinde navigation, common, about, rooms, blog ve contactPage alanları bulunur."
    ),
    code(
        '''secondaryCopy.en.about.title
secondaryCopy.en.rooms.galleryTitle
secondaryCopy.en.blog.articles
secondaryCopy.en.contactPage.formTitle'''
    ),
    callout(
        "Kural",
        "Bir anahtarın adını değiştirme; yalnızca sağ tarafındaki tırnak içindeki metni değiştir. Anahtarı değiştirirsen sayfa artık o metni bulamaz.",
        "red",
    ),
    p("Doğru ve yanlış örnek", "h2"),
    info_table(
        [
            ["Durum", "Örnek"],
            ["Doğru", 'heroTitle: "YOUR NEW TITLE",'],
            ["Yanlış", 'newHero: "YOUR NEW TITLE",  // Sayfa heroTitle arıyor'],
            ["Doğru", 'bookingText: "Yeni açıklama",'],
            ["Yanlış", 'bookingText: "Yeni "özel" açıklama",  // İç tırnaklar kodu bozar'],
        ],
    ),
    p(
        "Bir cümlenin içinde çift tırnak kullanman gerekiyorsa dışarıda tek tırnak kullanabilir veya kod kaçış karakteri kullanabilirsin. En kolay yol, normal düz cümle kullanmaktır."
    ),
]

story.append(PageBreak())

# 04
story += section_title("04", "Üç dil mantığı: İngilizce, Almanca, Macarca")
story += [
    p(
        "Dil seçimi components/site/language-provider.tsx tarafından yönetilir. Site ilk açıldığında İngilizce kullanılır. Kullanıcı EN, DE veya HU seçtiğinde seçim tarayıcının localStorage alanına relax-villa-language anahtarıyla kaydedilir. Sonraki ziyarette aynı dil açılır."
    ),
    p("Metin sayfaya nasıl geliyor?", "h2"),
    code(
        '''const { language } = useLanguage();
const t = siteCopy[language];

<h1>{t.heroTitle}</h1>'''
    ),
    p("Bu kodun Türkçesi şudur: Kullanıcının seçtiği dili öğren, o dilin metin paketini t değişkenine koy, sonra heroTitle değerini ekranda göster."),
    p("Yeni veya değişen bir metinde izlenecek sıra", "h2"),
    numbered(1, "Önce İngilizce en bloğundaki metni değiştir."),
    numbered(2, "Aynı anahtarı Almanca de bloğunda güncelle."),
    numbered(3, "Aynı anahtarı Macarca hu bloğunda güncelle."),
    numbered(4, "EN, DE ve HU düğmelerine basarak üçünü de tarayıcıda kontrol et."),
    callout(
        "Neden üçünde de aynı anahtar olmalı?",
        "TypeScript bu üç dilin yapısının uyumlu olmasını bekler. Bir dile yeni alan ekleyip diğer ikisine eklemezsen derleme hatası alabilir veya belirli dilde metin kaybolabilir.",
    ),
    p("Navigasyon metinleri", "h2"),
    p(
        "Header ve footer için app/secondary-content.ts içindeki navigation ve common alanları kullanılır. Örneğin navigation.blog menüdeki Blog/Journal adını; common.bookingNote footer ödeme açıklamasını değiştirir."
    ),
]

story.append(PageBreak())

# 05
story += section_title("05", "Ana sayfa ve rezervasyon akışı")
story += [
    p("Ana sayfanın kodu app/page.tsx dosyasındadır. Bu dosyada iki tür şey bir aradadır:"),
    bullet("Sayfanın bölümleri: hero, villa tanıtımı, galeri ön izlemesi, özellikler, yorumlar, rezervasyon ve footer."),
    bullet("Etkileşimler: tarihler, yetişkin/çocuk/evcil hayvan sayaçları, ödeme penceresi ve WhatsApp mesajı."),
    p("Ana sayfa metin anahtarları", "h2"),
    info_table(
        [
            ["Anahtar", "Ekrandaki alan"],
            ["heroEyebrow / heroTitle / heroText", "En üstteki büyük hero alanı."],
            ["aboutTitle / aboutLead / aboutBody", "Villa tanıtım alanı."],
            ["roomsTitle / roomNames", "Dört oda kartı."],
            ["facilitiesTitle / facilities", "Villa özellikleri listesi."],
            ["testimonialsTitle / testimonials", "Yorum ön izlemesi."],
            ["bookingTitle / bookingText", "Alt rezervasyon alanı."],
            ["adults / children / pets", "Sayaç etiketleri."],
        ],
    ),
    p("Sayaç sistemi", "h2"),
    p(
        "Yetişkin, çocuk ve evcil hayvan değerleri React state içinde tutulur. Artı/eksi düğmeleri GuestCounter bileşenini kullanır. Yetişkin varsayılanı 2, çocuk ve evcil hayvan varsayılanı 0'dır. Sayaçlar 0 ile 20 arasında sınırlandırılmıştır."
    ),
    code(
        '''const [adults, setAdults] = useState(2);
const [children, setChildren] = useState(0);
const [pets, setPets] = useState(0);'''
    ),
    p("Rezervasyon düğmesine basılınca", "h2"),
    numbered(1, "Giriş ve çıkış tarihleri seçilmiş mi kontrol edilir."),
    numbered(2, "Eksikse dateError mesajı gösterilir."),
    numbered(3, "Tarihler varsa ödeme/rezervasyon penceresi açılır."),
    numbered(4, "WhatsApp bağlantısı tarihleri, toplam misafir sayısını ve evcil hayvan sayısını mesaja ekler."),
    callout(
        "Fiyat hesaplama yok",
        "Şu an sistem toplam konaklama fiyatı veya evcil hayvan ücretini matematiksel olarak hesaplamıyor. Pets + fee etiketi ek ücret olduğunu belirtir ve sayı WhatsApp mesajına eklenir. Otomatik fiyat istenirse ayrıca gecelik fiyat, gün sayısı ve evcil hayvan birim ücreti mantığı kurulmalıdır.",
    ),
]

story.append(PageBreak())

# 06
story += section_title("06", "About, Rooms, Blog ve Contact sayfaları")
story += [
    p("Her iç sayfada iki dosya vardır", "h2"),
    bullet("page.tsx: Sayfanın SEO başlığı/açıklaması ve ana bileşen çağrısı."),
    bullet("page-content.tsx: Tarayıcıda görünen asıl sayfa düzeni ve etkileşimler."),
    p("About - app/about", "h2"),
    p(
        "Başlıklar, vizyon/misyon, çevre bilgileri ve SSS metinleri secondary-content.ts içindeki about alanındadır. SSS listesi faqs dizisidir. Her soru question, cevabı answer alanını kullanır. Evcil hayvanın ek ücretli olduğu bilgi şu anda SSS içinde yer alır."
    ),
    code(
        '''faqs: [
  {
    question: "Are pets allowed?",
    answer: "Yes, pets are welcome for an additional fee...",
  },
]'''
    ),
    p("Rooms - app/rooms", "h2"),
    p(
        "Oda adları, oda açıklamaları ve galeri sekmelerinin yazıları secondary-content.ts içindeki rooms alanındadır. Fotoğraf listesi ayrı olarak app/rooms/gallery-data.ts dosyasında tutulur."
    ),
    p("Blog - app/blog", "h2"),
    p(
        "Blog kartlarının başlıkları ve kategorileri secondary-content.ts içindeki blog.articles dizisinden gelir. Kart fotoğrafları page-content.tsx başındaki articleImages dizisindedir. Şu an yalnızca üç blog kartı gösterilir; eski uzun paragraf alanları sayfada render edilmez. İçerik dosyasında excerpt ve paragraphs değerleri dursa da kullanıcıya görünmez."
    ),
    p("Contact - app/contact", "h2"),
    p(
        "Form alanları, bilgi kartı ve Google Maps burada bulunur. Formda ad, e-posta, iletişim numarası, tercih edilen dil ve mesaj vardır. Tarih/misafir alanları kaldırılmıştır. Formun altındaki eski uyarı metni de gösterilmez."
    ),
]

story.append(PageBreak())

# 07
story += section_title("07", "Görseller ve galeri")
story += [
    p("Tüm site fotoğrafları public/images klasöründedir. Kodda /images/... şeklinde başlayan yollar doğrudan bu klasörü işaret eder."),
    p("Önemli görsel eşleşmeleri", "h2"),
    info_table(
        [
            ["Dosya", "Kullanıldığı yer"],
            ["hero.jpg", "Ana sayfa masaüstü hero."],
            ["hero-mobile.jpg", "Ana sayfa mobil hero."],
            ["mood.jpg", "Ana sayfadaki atmosfer bölümü."],
            ["story.jpg", "Blog sayfası hero."],
            ["local-1.jpg, local-2.jpg, local-3.jpg", "Üç blog kartı."],
            ["footer.jpg", "Tüm sayfalardaki footer arka planı."],
            ["gallery/outdoor-04.jpg", "Contact sayfası hero."],
            ["gallery/bedroom-*, shared-*, outdoor-*", "Rooms sayfasındaki tam galeri."],
        ],
    ),
    p("Bir fotoğrafı aynı adla değiştirmek", "h2"),
    numbered(1, "Yeni fotoğrafı uygun boyutta hazırla."),
    numbered(2, "Eski dosyanın adını ve uzantısını aynen koru."),
    numbered(3, "public/images içindeki eski dosyanın yerine yenisini koy."),
    numbered(4, "Tarayıcıda Ctrl + F5 ile önbelleği atlayarak yenile."),
    p("Yeni galeri fotoğrafı eklemek", "h2"),
    numbered(1, "Dosyayı public/images/gallery içine koy."),
    numbered(2, "app/rooms/gallery-data.ts dosyasını aç."),
    numbered(3, "galleryImages dizisine src, category ve order bilgisiyle yeni satır ekle."),
    code('{ src: "/images/gallery/outdoor-10.jpg", category: "outdoors", order: 10 },'),
    callout(
        "Dosya adları",
        "Dosya yolunda Türkçe karakter ve boşluk kullanmamak daha güvenlidir. outdoor-10.jpg gibi küçük harf, rakam ve tire kullan.",
    ),
]

story.append(PageBreak())

# 08
story += section_title("08", "WhatsApp, e-posta ve IBAN ayarları")
story += [
    p("Bu üç bilgi app/site-config.ts içindedir:"),
    code(
        '''export const WHATSAPP_NUMBER: string = "";
export const CONTACT_EMAIL: string = "";
export const BANK_IBAN: string = "";'''
    ),
    p("Gerçek bilgiler geldiğinde örnek kullanım", "h2"),
    code(
        '''export const WHATSAPP_NUMBER: string = "36301234567";
export const CONTACT_EMAIL: string = "booking@example.com";
export const BANK_IBAN: string = "HU00 0000 0000 0000 0000 0000 0000";'''
    ),
    bullet("WhatsApp numarasını ülke koduyla, artı işareti ve boşluk olmadan yaz."),
    bullet("E-posta adresini müşteriden teyit etmeden yayınlama."),
    bullet("IBAN'ı müşteriden yazılı olarak al ve bir karakter bile değiştirmeden gir."),
    p("Contact formunun davranışı", "h2"),
    info_table(
        [
            ["Ayar durumu", "Form ne yapar?"],
            ["WhatsApp dolu", "Hazırlanan mesajla WhatsApp penceresi açılır."],
            ["WhatsApp boş, e-posta dolu", "Hazırlanan metin e-posta uygulamasına aktarılır."],
            ["İkisi de boş", "Mesaj gönderilmez; mümkünse panoya kopyalanır ve kullanıcı bilgilendirilir."],
        ],
    ),
    callout(
        "Güvenlik kontrolü",
        "IBAN ve telefon gibi kritik bilgileri ekledikten sonra müşteriye ekran görüntüsü gönderip teyit al. Yanlış IBAN maddi kayba yol açabilir.",
        "red",
    ),
    p("Google Maps adresi", "h2"),
    p(
        "Contact sayfasında adres şu anda 8257 Badacsonytomaj, Füredi út 5, Hungary olarak hem metinde hem Google Maps bağlantısında kullanılır. Adres değişirse secondary-content.ts içindeki common.address ile contact/page-content.tsx içindeki mapsUrl ve iframe adresini birlikte güncelle."
    ),
]

story.append(PageBreak())

# 09
story += section_title("09", "Tasarım ve Tailwind CSS mantığı")
story += [
    p(
        "Sayfalardaki className değerleri Tailwind sınıflarıdır. Bir öğenin rengi, boşluğu, genişliği ve mobil davranışı çoğunlukla burada belirlenir."
    ),
    code(
        '''<section className="bg-[#faf8f5] px-6 py-20 sm:px-10 md:py-28">
  <h2 className="text-3xl font-bold text-[#26272b]">Başlık</h2>
</section>'''
    ),
    p("Sık görülen sınıflar", "h2"),
    info_table(
        [
            ["Sınıf", "Anlamı"],
            ["px-6 / py-20", "Yatay / dikey iç boşluk."],
            ["mt-6 / gap-3", "Üst boşluk / elemanlar arası boşluk."],
            ["text-sm / text-3xl", "Yazı boyutu."],
            ["font-semibold / font-bold", "Yazı kalınlığı."],
            ["bg-[#faf8f5]", "Arka plan rengi."],
            ["text-[#26272b]", "Yazı rengi."],
            ["grid / flex", "Yerleşim sistemi."],
            ["sm: / md: / lg:", "Ekran büyüdüğünde devreye giren responsive ayar."],
            ["hidden / block", "Gizle / göster."],
        ],
    ),
    p("Genel tema", "h2"),
    p(
        "app/globals.css içinde --primary, --secondary, --accent, --border gibi renk değişkenleri vardır. Ayrıca .eyebrow ve .section-title gibi tekrar kullanılan sınıflar burada tanımlanır. Site genelindeki rengi değiştirmek istiyorsan önce bu dosyayı incele; tek bir bileşenin rengini değiştirmek için ilgili TSX dosyasındaki className yeterlidir."
    ),
    callout(
        "Responsive kontrol",
        "Masaüstünde güzel görünen bir alan mobilde taşabilir. Özellikle grid sütunları, büyük başlıklar ve sayaçlarda her değişiklikten sonra dar ekranı da kontrol et.",
    ),
]

story.append(PageBreak())

# 10
story += section_title("10", "SEO başlıkları ve sayfa açıklamaları")
story += [
    p(
        "Tarayıcı sekmesindeki başlık ve arama motoru açıklaması içerik dosyalarından değil, route klasörlerindeki page.tsx dosyalarından gelir."
    ),
    info_table(
        [
            ["Sayfa", "SEO dosyası"],
            ["Ana sayfa", "app/layout.tsx içindeki genel metadata."],
            ["About", "app/about/page.tsx"],
            ["Rooms", "app/rooms/page.tsx"],
            ["Blog", "app/blog/page.tsx"],
            ["Contact", "app/contact/page.tsx"],
        ],
    ),
    code(
        '''export const metadata: Metadata = {
  title: "Contact Relax Villa | Badacsonytomaj",
  description: "Contact Relax Villa and request dates...",
};'''
    ),
    bullet("title yaklaşık 50-60 karakter civarında ve sayfaya özel olsun."),
    bullet("description sayfanın gerçek içeriğini kısa ve doğal biçimde anlatsın."),
    bullet("Bir sayfanın görünen H1 başlığını değiştirmek SEO title değerini otomatik değiştirmez; gerekirse ikisini de güncelle."),
    p("Blog SEO notu", "h2"),
    p(
        "Blog sayfasındaki üç kart sayfanın konu sinyalini verir, ancak şu anda ayrı blog detay sayfaları yoktur. Gerçek SEO blog sistemi istenirse her yazı için /blog/yazi-slug adresi, kendine ait metadata, başlık, içerik ve dahili bağlantı kurulmalıdır."
    ),
]

story.append(PageBreak())

# 11
story += section_title("11", "Güvenli çalışma ve kontrol listesi")
story += [
    p("Her değişiklikte şu sırayı kullan:", "h2"),
    numbered(1, "Değiştireceğin cümleyi Ctrl + Shift + F ile bul."),
    numbered(2, "Doğru dosyada ve doğru dil bloğunda olduğunu kontrol et."),
    numbered(3, "Yalnızca gerekli satırı değiştir; aynı anda büyük temizlik yapma."),
    numbered(4, "Aynı anahtarı EN, DE ve HU için güncelle."),
    numbered(5, "Dosyayı kaydet ve tarayıcıda masaüstü görünümü kontrol et."),
    numbered(6, "Mobil görünümü kontrol et."),
    numbered(7, "Terminalde TypeScript ve build kontrollerini çalıştır."),
    numbered(8, "git diff ile yalnızca beklediğin dosyaların değiştiğini gör."),
    code("npm exec tsc -- --noEmit\nnpm run build\ngit status\ngit diff"),
    callout(
        "Commit kontrolü sende",
        "Bu projede commitleri sen yazmak istediğin için dosya değişiklikleri otomatik commitlenmiyor. Kontroller bittikten sonra commit mesajını ve push işlemini kendin yapabilirsin.",
        "green",
    ),
    p("Git için temel komutlar", "h2"),
    code(
        '''git status
git diff
git add app/page.tsx app/site-content.ts
git commit -m "Rezervasyon metinlerini güncelle"
git push'''
    ),
    p(
        "git add . bütün değişiklikleri ekler. Hangi dosyaların gideceğinden emin değilsen dosya adlarını tek tek yazmak daha güvenlidir."
    ),
]

story.append(PageBreak())

# 12
story += section_title("12", "Hızlı tarifler")
recipes = [
    ("Hero başlığını değiştir", "app/site-content.ts dosyasında heroTitle anahtarını EN/DE/HU bloklarında değiştir."),
    ("Villa özelliklerini değiştir", "app/site-content.ts içindeki facilities dizisini üç dilde aynı sırayla düzenle."),
    ("Yorum metnini değiştir", "app/site-content.ts içindeki testimonials dizisini güncelle."),
    ("About metnini değiştir", "app/secondary-content.ts içindeki about alanını üç dilde düzenle."),
    ("SSS ekle", "secondary-content.ts içindeki faqs dizisine question ve answer nesnesi ekle; üç dile de eklemeyi unutma."),
    ("Oda adını değiştir", "secondary-content.ts içindeki rooms.bedroomNames dizisini düzenle."),
    ("Blog kartı başlığını değiştir", "secondary-content.ts içindeki blog.articles dizisinde title ve category değerlerini güncelle."),
    ("Blog fotoğrafını değiştir", "app/blog/page-content.tsx içindeki articleImages dizisindeki yolu değiştir."),
    ("Contact form etiketini değiştir", "secondary-content.ts içindeki contactPage.formFields alanını güncelle."),
    ("Telefon, e-posta veya IBAN ekle", "app/site-config.ts dosyasındaki üç sabiti doldur."),
    ("Footer metnini değiştir", "secondary-content.ts içindeki common alanını düzenle."),
    ("Yeni galeri görseli ekle", "Fotoğrafı public/images/gallery içine koy ve gallery-data.ts dizisine ekle."),
]
story.append(info_table([["İstediğin işlem", "Nereye bakacaksın?"]] + recipes, widths=[57 * mm, 115 * mm]))
story += [
    Spacer(1, 5 * mm),
    p("En sık karşılaşılan hatalar", "h2"),
    info_table(
        [
            ["Belirti", "Muhtemel neden / çözüm"],
            ["Sayfa açılmıyor", "Eksik virgül, tırnak veya süslü parantez olabilir. Terminal hatasının ilk dosya/satırını kontrol et."],
            ["Sadece bir dil bozuk", "O dil bloğunda anahtar eksik veya yanlış yazılmış olabilir."],
            ["Fotoğraf görünmüyor", "Dosya adı, uzantı veya /images ile başlayan yol yanlış olabilir."],
            ["WhatsApp açılmıyor", "site-config.ts içindeki numara boş veya ülke kodu formatı hatalı olabilir."],
            ["IBAN kopyalanmıyor", "BANK_IBAN boş bırakılmış olabilir."],
            ["Mobilde yatay kayma var", "Sabit genişlik, uzun metin veya fazla sütun olabilir. Responsive sınıfları kontrol et."],
            ["Değişiklik görünmüyor", "Dosyayı kaydet, Ctrl + F5 yap veya geliştirme sunucusunu yeniden başlat."],
        ],
    ),
]

story.append(PageBreak())

# Final one-page checklist
story += section_title("13", "Yayın öncesi tek sayfalık kontrol")
story += [
    p("İçerik", "h2"),
    bullet("EN, DE ve HU metinleri tamamlandı."),
    bullet("Adres, e-posta, WhatsApp ve IBAN müşteri tarafından onaylandı."),
    bullet("Evcil hayvan, ödeme ve iptal bilgileri doğru."),
    bullet("Demo yorumlar gerçek yorumlarla değiştirildi veya açıkça demo olarak kaldı."),
    p("Görsel kontrol", "h2"),
    bullet("Ana sayfa masaüstü ve mobil hero kontrol edildi."),
    bullet("Yetişkin, çocuk ve evcil hayvan sayaçları çalışıyor."),
    bullet("About, Rooms, Blog ve Contact sayfaları mobilde taşmıyor."),
    bullet("Galeri görselleri açılıyor ve doğru kategoride."),
    bullet("Google Maps doğru adresi gösteriyor."),
    p("Teknik kontrol", "h2"),
    bullet("npm exec tsc -- --noEmit başarılı."),
    bullet("npm run build başarılı."),
    bullet("git status ve git diff incelendi."),
    bullet("Commit ve push yalnızca kontrol sonrasında yapıldı."),
    Spacer(1, 8 * mm),
    callout(
        "Kısacası",
        "Metin değiştirmek için önce içerik dosyalarına, görsel değiştirmek için public/images ve gallery-data.ts dosyasına, iletişim bilgileri için site-config.ts dosyasına bak. Tasarım değişikliği gerektiğinde ilgili page-content.tsx veya app/page.tsx içindeki Tailwind className değerlerine geç.",
        "green",
    ),
    Spacer(1, 10 * mm),
    Paragraph("Bu rehber Relax Villa Panzio projesinin 16 Eylül 2026 tarihindeki yapısına göre hazırlanmıştır.", styles["small"]),
]

doc.build(story)
print(OUTPUT)
