do $$
begin
  create type public.support_status as enum ('new', 'in_progress', 'resolved', 'closed');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  email text not null check (email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
  phone text not null default '' check (char_length(phone) <= 40),
  language text not null default 'en' check (language in ('en', 'de', 'hu')),
  message text not null check (char_length(trim(message)) between 10 and 4000),
  status public.support_status not null default 'new',
  admin_notes text not null default '' check (char_length(admin_notes) <= 4000),
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_requests_status_created_idx
  on public.support_requests (status, created_at desc);

create index if not exists support_requests_resolved_by_idx
  on public.support_requests (resolved_by);

drop trigger if exists set_support_requests_updated_at on public.support_requests;
create trigger set_support_requests_updated_at
before update on public.support_requests
for each row execute function private.set_updated_at();

alter table public.support_requests enable row level security;

revoke all on table public.support_requests from anon, authenticated;
grant insert (name, email, phone, language, message)
  on table public.support_requests to anon;
grant select, insert, update, delete
  on table public.support_requests to authenticated;

drop policy if exists support_requests_public_insert on public.support_requests;
create policy support_requests_public_insert
on public.support_requests for insert
to anon
with check (
  status = 'new'
  and admin_notes = ''
  and resolved_at is null
  and resolved_by is null
);

drop policy if exists support_requests_admin_select on public.support_requests;
create policy support_requests_admin_select
on public.support_requests for select
to authenticated
using ((select private.is_admin()));

drop policy if exists support_requests_admin_insert on public.support_requests;
create policy support_requests_admin_insert
on public.support_requests for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists support_requests_admin_update on public.support_requests;
create policy support_requests_admin_update
on public.support_requests for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists support_requests_admin_delete on public.support_requests;
create policy support_requests_admin_delete
on public.support_requests for delete
to authenticated
using ((select private.is_admin()));

insert into public.blog_posts (
  slug,
  status,
  category_en,
  category_de,
  category_hu,
  title_en,
  title_de,
  title_hu,
  excerpt_en,
  excerpt_de,
  excerpt_hu,
  content_en,
  content_de,
  content_hu,
  cover_url,
  published_at
)
values
  (
    'slow-day',
    'published',
    'MOUNTAIN & LAKE',
    'BERG & SEE',
    'HEGY ÉS TÓ',
    'Badacsony between lake and basalt',
    'Badacsony zwischen Balaton und Basalt',
    'Badacsony a Balaton és a bazalt között',
    'The landscape makes sense when you see the volcanic hill, the Balaton shore and the vineyards as one place.',
    'Die Landschaft erschließt sich, wenn man Vulkanberg, Balatonufer und Weinberge als Einheit betrachtet.',
    'A táj akkor áll össze, ha a vulkanikus hegyet, a Balaton-partot és a szőlőket egy egységként nézik.',
    $en$Badacsony is a volcanic remnant hill on the northern shore of Lake Balaton. Its basalt formations, viewpoints and vineyards are not separate attractions, but different ways to experience the same landscape.

Instead of collecting stops, choose one trail, cellar or stretch of shoreline. Back at the villa, the pool and terrace leave enough room for the unplanned part of the day.$en$,
    $de$Badacsony ist ein vulkanischer Zeugenberg am Nordufer des Balaton. Basaltformationen, Aussichtspunkte und Weinberge sind keine getrennten Sehenswürdigkeiten, sondern unterschiedliche Seiten derselben Landschaft.

Wählen Sie lieber einen Weg, einen Weinkeller oder einen Abschnitt am See, statt möglichst viele Stopps zu sammeln. Pool und Terrasse lassen anschließend genug Raum für einen ungeplanten Nachmittag.$de$,
    $hu$A Badacsony vulkanikus tanúhegy a Balaton északi partján. A bazaltformák, a kilátópontok és a szőlőterületek nem külön látnivalók, hanem ugyanannak a tájnak eltérő olvasatai.

Sok megálló helyett válasszanak egy útvonalat, pincét vagy partszakaszt. A villába visszatérve a medence és a terasz elég teret hagy a nap hátralévő, tervezetlen részének.$hu$,
    '/images/local-1.jpg',
    now() - interval '3 days'
  ),
  (
    'pack-together',
    'published',
    'GROUP PLANNING',
    'GRUPPENPLANUNG',
    'CSOPORTOS TERVEZÉS',
    'Four bedrooms, one group: plan the room mix first',
    'Vier Schlafzimmer, eine Gruppe: zuerst die Zimmer verteilen',
    'Négy hálószoba, egy társaság: először a szobákat osszák el',
    'Ten minutes of room planning before the drive can save an hour of negotiation at the door.',
    'Zehn Minuten Zimmerplanung vor der Fahrt ersparen eine Stunde Diskussion an der Haustür.',
    'Tíz perc egyeztetés indulás előtt egyórás vitát spórolhat meg az ajtóban.',
    $en$The villa has double, twin and flexible sleeping arrangements. Match them to couples, children and individual sleepers before arrival, and note who needs balcony access or air conditioning most.

Then agree only the essentials: arrival window, first breakfast and one shared dinner. A whole house works best when the group has a framework, not a minute-by-minute schedule.$en$,
    $de$Die Villa bietet Doppel-, Zweibett- und flexible Schlafmöglichkeiten. Ordnen Sie sie Paaren, Kindern und Einzelschläfern vorab zu und berücksichtigen Sie, wer Balkon oder Klimaanlage besonders schätzt.

Danach genügen die Eckpunkte: Ankunftsfenster, erstes Frühstück und ein gemeinsames Abendessen. Ein ganzes Haus funktioniert mit einem Rahmen besser als mit einem minutiösen Programm.$de$,
    $hu$A villában franciaágyas, kétágyas és rugalmas elrendezésű szobák vannak. Érkezés előtt rendeljék őket párokhoz, gyerekekhez és külön alvókhoz, és vegyék figyelembe, kinek fontosabb az erkély vagy a légkondicionálás.

Ezután elég a lényegben megegyezni: érkezési idősáv, első reggeli és egy közös vacsora. Egy teljes ház kerettel működik jól, nem percre pontos programmal.$hu$,
    '/images/local-2.jpg',
    now() - interval '2 days'
  ),
  (
    'shared-table',
    'published',
    'AT THE HOUSE',
    'IM HAUS',
    'A VILLÁBAN',
    'Pool, sauna, dinner: a villa day with no timetable',
    'Pool, Sauna, Abendessen: ein Villentag ohne Zeitplan',
    'Medence, szauna, vacsora: egy villanap menetrend nélkül',
    'Some days do not need a destination; the house already has enough ways to change pace.',
    'Manche Tage brauchen kein Ausflugsziel; das Haus bietet bereits genug Möglichkeiten für einen Tempowechsel.',
    'Van, amikor nem kell úti cél; a ház önmagában is elég lehetőséget ad a ritmusváltásra.',
    $en$Start outside while the weather is mild, move to the pool, and save the hot tub or barrel sauna for later. Because the spaces are private, the order is entirely yours.

For dinner, let local market produce or a nearby wine terrace set the tone. What matters is not a complicated menu, but having the table, terrace and evening to yourselves.$en$,
    $de$Beginnen Sie draußen, solange das Wetter mild ist, wechseln Sie an den Pool und heben Sie Whirlpool oder Fasssauna für später auf. Da alles privat ist, bestimmen Sie die Reihenfolge.

Für das Abendessen können Marktprodukte aus der Region oder eine nahe Weinterrasse den Ton angeben. Entscheidend ist nicht ein kompliziertes Menü, sondern Tisch, Terrasse und Abend für sich zu haben.$de$,
    $hu$Kezdjék kint, amíg kellemes az idő, folytassák a medencénél, a jacuzzit vagy a hordószaunát pedig hagyják későbbre. Mivel minden privát, a sorrend teljesen az Önöké.

A vacsora hangulatát adhatják helyi piaci alapanyagok vagy egy közeli borterasz. Nem a bonyolult menü a fontos, hanem hogy az asztal, a terasz és az este csak az Önöké.$hu$,
    '/images/local-3.jpg',
    now() - interval '1 day'
  )
on conflict (slug) do nothing;
