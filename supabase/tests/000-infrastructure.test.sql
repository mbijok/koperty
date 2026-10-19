-- Smoke test: confirms the pgTAP toolchain runs against the local database.
begin;

select plan(3);

select has_extension('pgtap', 'pgTAP extension is installed');
select has_schema('public', 'public schema exists');
select has_schema('auth', 'Supabase auth schema exists');

select * from finish();

rollback;
