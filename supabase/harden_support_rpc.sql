-- Route public contact submissions through a validated function instead of
-- allowing anonymous callers to insert into the table directly.

create index if not exists support_requests_created_idx
  on public.support_requests (created_at desc);

revoke insert (name, email, phone, language, message)
  on table public.support_requests from anon;

drop policy if exists support_requests_public_insert on public.support_requests;

create or replace function private.create_support_request_impl(
  p_name text,
  p_email text,
  p_phone text,
  p_language text,
  p_message text,
  p_website text default ''
)
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  normalized_name text := trim(coalesce(p_name, ''));
  normalized_email text := lower(trim(coalesce(p_email, '')));
  normalized_phone text := trim(coalesce(p_phone, ''));
  normalized_language text := lower(trim(coalesce(p_language, '')));
  normalized_message text := trim(coalesce(p_message, ''));
  request_id uuid;
begin
  if trim(coalesce(p_website, '')) <> '' then
    raise exception using errcode = '22023', message = 'INVALID_REQUEST';
  end if;

  if char_length(normalized_name) not between 2 and 120
    or char_length(normalized_email) not between 3 and 254
    or normalized_email !~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    or char_length(normalized_phone) > 40
    or normalized_language not in ('en', 'de', 'hu')
    or char_length(normalized_message) not between 10 and 4000
  then
    raise exception using errcode = '22023', message = 'INVALID_REQUEST';
  end if;

  -- Serialize the global check so rotating email addresses cannot bypass it.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('support:global'));

  if (
    select count(*)
    from public.support_requests request
    where request.created_at > pg_catalog.now() - interval '1 minute'
  ) >= 30 then
    raise exception using errcode = 'P0001', message = 'RATE_LIMITED';
  end if;

  insert into public.support_requests (name, email, phone, language, message)
  values (
    normalized_name,
    normalized_email,
    normalized_phone,
    normalized_language,
    normalized_message
  )
  returning id into request_id;

  return request_id;
end;
$$;

revoke all on function private.create_support_request_impl(
  text, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function private.create_support_request_impl(
  text, text, text, text, text, text
) to anon;

create or replace function public.create_support_request(
  p_name text,
  p_email text,
  p_phone text,
  p_language text,
  p_message text,
  p_website text default ''
)
returns uuid
language sql
volatile
security invoker
set search_path = ''
as $$
  select private.create_support_request_impl(
    p_name,
    p_email,
    p_phone,
    p_language,
    p_message,
    p_website
  );
$$;

revoke all on function public.create_support_request(
  text, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.create_support_request(
  text, text, text, text, text, text
) to anon;
