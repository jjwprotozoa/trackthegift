-- Track The Gift - Supabase Schema
-- Run this in the Supabase SQL editor to create all tables

-- Enable UUID extension (usually already enabled)
create extension if not exists "uuid-ossp";

-- Users profile table (linked to Supabase Auth)
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  username text not null,
  email text not null unique,
  plan text not null default 'free',
  track_credits integer not null default 2,
  created_at timestamptz not null default now()
);

-- Trackers table
create table if not exists public.trackers (
  id bigint generated always as identity primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  waybill text not null,
  carrier text not null default 'dhl',
  slug text not null unique,
  theme text not null default 'easter',
  recipient_name text,
  origin text,
  destination text,
  status text not null default 'created',
  status_message text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Subscriptions table
create table if not exists public.subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null default 'free',
  status text not null default 'active'
);

-- Indexes
create index if not exists idx_trackers_user_id on public.trackers(user_id);
create index if not exists idx_trackers_slug on public.trackers(slug);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);

-- Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.trackers enable row level security;
alter table public.subscriptions enable row level security;

-- Users policies
create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Trackers policies
create policy "Users can read own trackers"
  on public.trackers for select
  using (auth.uid() = user_id);

create policy "Anyone can read trackers by slug"
  on public.trackers for select
  using (true);

create policy "Users can create trackers"
  on public.trackers for insert
  with check (auth.uid() = user_id);

create policy "Users can update own trackers"
  on public.trackers for update
  using (auth.uid() = user_id);

create policy "Users can delete own trackers"
  on public.trackers for delete
  using (auth.uid() = user_id);

-- Subscriptions policies
create policy "Users can read own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can create own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id);
