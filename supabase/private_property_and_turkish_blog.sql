-- Keep every stay private to one guest group and complete the Turkish blog copy.

create extension if not exists btree_gist with schema extensions;

do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_constraint
    where conname = 'reservations_no_overlap'
      and conrelid = 'public.reservations'::regclass
  ) then
    alter table public.reservations
      add constraint reservations_no_overlap
      exclude using gist (
        daterange(check_in, check_out, '[)') with &&
      )
      where (status in ('payment_pending', 'confirmed'));
  end if;
end;
$$;

create or replace function private.get_room_availability_impl(
  p_from date,
  p_to date
)
returns table (
  source text,
  room_id smallint,
  start_date date,
  end_date date
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if p_from is null
    or p_to is null
    or p_from < current_date - 1
    or p_to <= p_from
    or p_to > current_date + 800
    or p_to - p_from > 800
  then
    raise exception using errcode = '22023', message = 'INVALID_DATE_RANGE';
  end if;

  return query
  select
    'reservation'::text,
    room.id,
    reservation.check_in,
    reservation.check_out
  from public.reservations reservation
  cross join public.rooms room
  where room.active
    and reservation.status in ('payment_pending', 'confirmed')
    and daterange(reservation.check_in, reservation.check_out, '[)')
      && daterange(p_from, p_to, '[)')

  union all

  select
    'block'::text,
    room.id,
    block.start_date,
    block.end_date
  from public.availability_blocks block
  join public.rooms room
    on room.active and (block.room_id is null or block.room_id = room.id)
  where block.active
    and daterange(block.start_date, block.end_date, '[)')
      && daterange(p_from, p_to, '[)');
end;
$$;

revoke all on function private.get_room_availability_impl(date, date)
  from public, anon, authenticated;
grant execute on function private.get_room_availability_impl(date, date)
  to anon, authenticated;

update public.blog_posts
set
  category_tr = 'TEPE VE GÖL',
  title_tr = 'Balaton ile bazalt arasında Badacsony',
  excerpt_tr = 'Volkanik tepeyi, Balaton kıyısını ve üzüm bağlarını tek bir peyzaj olarak gördüğünüzde bölge daha anlamlı hale gelir.',
  content_tr = E'Badacsony, Balaton Gölü''nün kuzey kıyısındaki volkanik bir tanık tepedir. Bazalt oluşumları, seyir noktaları ve üzüm bağları ayrı ayrı görülecek yerler değil, aynı arazinin farklı yorumlarıdır.\n\nÇok sayıda durağı tamamlamaya çalışmak yerine bir patika, mahzen veya kıyı şeridi seçin. Villaya döndüğünüzde havuz ve teras, günün geri kalanını plansız bırakmanız için yeterince alan sunar.'
where slug = 'slow-day';

update public.blog_posts
set
  category_tr = 'GRUP PLANLAMASI',
  title_tr = 'Dört yatak odası, tek grup: önce oda dağılımını planlayın',
  excerpt_tr = 'Yola çıkmadan önce yapılacak on dakikalık oda planı, kapıda bir saatlik kararsızlığı önleyebilir.',
  content_tr = E'Villada çift kişilik, iki yataklı ve esnek yatak düzenleri bulunur. Varıştan önce odaları çiftlere, çocuklara ve tek başına uyuyacak kişilere göre eşleştirin; balkon veya klimaya en çok kimin ihtiyaç duyduğunu belirleyin.\n\nYalnızca temel konularda anlaşın: varış aralığı, ilk kahvaltı ve ortak bir akşam yemeği. Seçtiğiniz odalar ne olursa olsun villa başka misafirlerle paylaşılmadığı için grubunuz günü kendi ritminde planlayabilir.'
where slug = 'pack-together';

update public.blog_posts
set
  category_tr = 'VİLLADA',
  title_tr = 'Havuz, sauna, akşam yemeği: programsız bir villa günü',
  excerpt_tr = 'Bazı günlerde bir varış noktasına gerek yoktur; ev zaten temponuzu değiştirecek kadar seçenek sunar.',
  content_tr = E'Hava ılıkken dışarıda başlayın, havuza geçin ve jakuziyi ya da fıçı saunayı daha sonraya bırakın. Seçtiğiniz oda sayısından bağımsız olarak bu alanları yalnızca kendi grubunuzla kullanırsınız.\n\nAkşam yemeğinin havasını yerel pazar ürünleri veya yakındaki bir şarap terası belirlesin. Mutfak, yemek masası, teras ve barbekü alanı konaklamanız boyunca yalnızca grubunuza ayrılır.'
where slug = 'shared-table';
