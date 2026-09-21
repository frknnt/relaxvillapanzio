alter table public.booking_settings
  add column if not exists bank_account_number text not null default '',
  add column if not exists bic_swift text not null default '',
  add column if not exists contact_email text not null default '';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'booking_settings_bank_account_number_length'
      and conrelid = 'public.booking_settings'::regclass
  ) then
    alter table public.booking_settings
      add constraint booking_settings_bank_account_number_length
      check (char_length(bank_account_number) <= 80);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'booking_settings_bic_swift_length'
      and conrelid = 'public.booking_settings'::regclass
  ) then
    alter table public.booking_settings
      add constraint booking_settings_bic_swift_length
      check (char_length(bic_swift) <= 20);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'booking_settings_contact_email_length'
      and conrelid = 'public.booking_settings'::regclass
  ) then
    alter table public.booking_settings
      add constraint booking_settings_contact_email_length
      check (char_length(contact_email) <= 254);
  end if;
end
$$;

grant select (
  bank_account_number,
  bic_swift,
  contact_email
) on table public.booking_settings to anon;
