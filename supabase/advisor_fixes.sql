create index if not exists availability_blocks_created_by_idx
  on public.availability_blocks (created_by);

create index if not exists blog_posts_created_by_idx
  on public.blog_posts (created_by);

create index if not exists blog_posts_updated_by_idx
  on public.blog_posts (updated_by);

create index if not exists booking_settings_updated_by_idx
  on public.booking_settings (updated_by);

create index if not exists gallery_images_created_by_idx
  on public.gallery_images (created_by);

create index if not exists monthly_rates_updated_by_idx
  on public.monthly_rates (updated_by);

create index if not exists reservation_events_created_by_idx
  on public.reservation_events (created_by);

create index if not exists reservations_confirmed_by_idx
  on public.reservations (confirmed_by);

drop policy if exists monthly_rates_public_read on public.monthly_rates;
create policy monthly_rates_public_read
on public.monthly_rates for select
to anon
using (active);

drop policy if exists monthly_rates_admin_read on public.monthly_rates;
create policy monthly_rates_admin_read
on public.monthly_rates for select
to authenticated
using (active or (select private.is_admin()));

drop policy if exists blog_posts_public_read on public.blog_posts;
create policy blog_posts_public_read
on public.blog_posts for select
to anon
using (status = 'published' and published_at is not null and published_at <= now());

drop policy if exists blog_posts_admin_read on public.blog_posts;
create policy blog_posts_admin_read
on public.blog_posts for select
to authenticated
using (
  (status = 'published' and published_at is not null and published_at <= now())
  or (select private.is_admin())
);

drop policy if exists gallery_images_public_read on public.gallery_images;
create policy gallery_images_public_read
on public.gallery_images for select
to anon
using (visible);

drop policy if exists gallery_images_admin_read on public.gallery_images;
create policy gallery_images_admin_read
on public.gallery_images for select
to authenticated
using (visible or (select private.is_admin()));

alter function public.admin_set_reservation_status(
  uuid,
  public.reservation_status,
  text
) security invoker;
