begin;

-- Enable RLS on every exposed table in the public schema.
alter table public."User" enable row level security;
alter table public."Farm" enable row level security;
alter table public."Field" enable row level security;
alter table public."Crop" enable row level security;
alter table public."SoilData" enable row level security;
alter table public."WeatherData" enable row level security;
alter table public."IrrigationLog" enable row level security;
alter table public."Loan" enable row level security;
alter table public."MarketplaceListing" enable row level security;
alter table public."MandiPrice" enable row level security;
alter table public."Transaction" enable row level security;
alter table public."Alert" enable row level security;

-- Remove the permissive development policy if it was ever created.
drop policy if exists "Allow all" on public."User";
drop policy if exists "Allow all" on public."Farm";
drop policy if exists "Allow all" on public."Field";
drop policy if exists "Allow all" on public."Crop";
drop policy if exists "Allow all" on public."SoilData";
drop policy if exists "Allow all" on public."WeatherData";
drop policy if exists "Allow all" on public."IrrigationLog";
drop policy if exists "Allow all" on public."Loan";
drop policy if exists "Allow all" on public."MarketplaceListing";
drop policy if exists "Allow all" on public."MandiPrice";
drop policy if exists "Allow all" on public."Transaction";
drop policy if exists "Allow all" on public."Alert";

-- This app uses Prisma + backend JWTs instead of Supabase Auth, so creating
-- an ALLOW ALL policy would re-expose every row through the Supabase Data API.
-- Leave regular client roles with no row access until targeted policies exist.
revoke all on table public."User" from anon, authenticated;
revoke all on table public."Farm" from anon, authenticated;
revoke all on table public."Field" from anon, authenticated;
revoke all on table public."Crop" from anon, authenticated;
revoke all on table public."SoilData" from anon, authenticated;
revoke all on table public."WeatherData" from anon, authenticated;
revoke all on table public."IrrigationLog" from anon, authenticated;
revoke all on table public."Loan" from anon, authenticated;
revoke all on table public."MarketplaceListing" from anon, authenticated;
revoke all on table public."MandiPrice" from anon, authenticated;
revoke all on table public."Transaction" from anon, authenticated;
revoke all on table public."Alert" from anon, authenticated;

commit;
