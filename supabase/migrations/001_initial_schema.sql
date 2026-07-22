-- ============================================
-- FundRise - Initial Database Schema
-- ============================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- USERS (extends supabase auth.users)
-- ============================================
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  avatar text,
  bio text,
  location text,
  phone text,
  role text not null default 'user' check (role in ('user', 'admin')),
  email_verified boolean not null default false,
  two_factor_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create user on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', '')
  );

  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', '')
  );

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- PROFILES
-- ============================================
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references public.users(id) on delete cascade,
  display_name text not null default '',
  avatar text,
  bio text,
  location text,
  website text,
  social_links jsonb default '{}',
  total_raised numeric(12,2) not null default 0,
  total_donated numeric(12,2) not null default 0,
  campaign_count int not null default 0,
  donation_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- CATEGORIES
-- ============================================
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  icon text,
  description text,
  campaign_count int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Seed categories
insert into public.categories (name, slug, icon) values
  ('Medical', 'medical', 'HeartPulse'),
  ('Education', 'education', 'GraduationCap'),
  ('Emergency', 'emergency', 'Siren'),
  ('Family', 'family', 'Users'),
  ('Charity', 'charity', 'HandHeart'),
  ('Community', 'community', 'Building2'),
  ('Environment', 'environment', 'TreePine'),
  ('Animals', 'animals', 'PawPrint'),
  ('Sports', 'sports', 'Trophy'),
  ('Creative', 'creative', 'Palette'),
  ('Business', 'business', 'Briefcase'),
  ('Travel', 'travel', 'Plane');

-- ============================================
-- CAMPAIGNS
-- ============================================
create table public.campaigns (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  slug text unique not null,
  title text not null,
  short_description text not null,
  full_story text not null,
  goal numeric(12,2) not null,
  raised numeric(12,2) not null default 0,
  currency text not null default 'USD',
  category_id uuid references public.categories(id) on delete set null,
  country text,
  beneficiary_type text not null default 'self' check (beneficiary_type in ('self', 'someone_else', 'charity')),
  beneficiary_name text,
  cover_image text not null,
  gallery_images jsonb not null default '[]',
  video_url text,
  deadline timestamptz,
  status text not null default 'draft' check (status in ('draft', 'pending', 'active', 'completed', 'rejected', 'suspended')),
  tags jsonb not null default '[]',
  donor_count int not null default 0,
  view_count int not null default 0,
  share_count int not null default 0,
  featured boolean not null default false,
  trending boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- DONATIONS
-- ============================================
create table public.donations (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  amount numeric(12,2) not null,
  currency text not null default 'USD',
  payment_method text not null,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,
  anonymous boolean not null default false,
  message text,
  donor_name text,
  donor_email text,
  created_at timestamptz not null default now()
);

-- ============================================
-- CAMPAIGN UPDATES
-- ============================================
create table public.campaign_updates (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text not null,
  images jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- ============================================
-- COMMENTS
-- ============================================
create table public.comments (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  parent_id uuid references public.comments(id) on delete cascade,
  likes int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================
-- LIKES
-- ============================================
create table public.likes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint likes_unique_comment unique (user_id, comment_id),
  constraint likes_unique_campaign unique (user_id, campaign_id),
  constraint likes_check_target check (
    (comment_id is not null and campaign_id is null) or
    (comment_id is null and campaign_id is not null)
  )
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  read boolean not null default false,
  link text,
  created_at timestamptz not null default now()
);

-- ============================================
-- WITHDRAWALS
-- ============================================
create table public.withdrawals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  amount numeric(12,2) not null,
  method text not null check (method in ('bank', 'paypal', 'crypto', 'stripe')),
  account_details jsonb not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- PAYMENT TRANSACTIONS
-- ============================================
create table public.payment_transactions (
  id uuid primary key default uuid_generate_v4(),
  donation_id uuid not null references public.donations(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  amount numeric(12,2) not null,
  fee numeric(12,2) not null default 0,
  net_amount numeric(12,2) not null,
  gateway text not null,
  status text not null,
  reference text unique not null,
  created_at timestamptz not null default now()
);

-- ============================================
-- REPORTS
-- ============================================
create table public.reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references public.users(id) on delete cascade,
  target_type text not null check (target_type in ('campaign', 'comment')),
  target_id uuid not null,
  reason text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'resolved')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- SETTINGS
-- ============================================
create table public.settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value text,
  type text not null default 'text'
);

-- ============================================
-- FAQs
-- ============================================
create table public.faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================
-- TESTIMONIALS
-- ============================================
create table public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  avatar text,
  content text not null,
  rating int not null default 5,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================
-- MESSAGES
-- ============================================
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid not null references public.users(id) on delete cascade,
  receiver_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index idx_campaigns_user_id on public.campaigns(user_id);
create index idx_campaigns_category_id on public.campaigns(category_id);
create index idx_campaigns_status on public.campaigns(status);
create index idx_campaigns_slug on public.campaigns(slug);
create index idx_campaigns_created_at on public.campaigns(created_at desc);

create index idx_donations_campaign_id on public.donations(campaign_id);
create index idx_donations_user_id on public.donations(user_id);

create index idx_comments_campaign_id on public.comments(campaign_id);

create index idx_notifications_user_read on public.notifications(user_id, read);

create index idx_withdrawals_user_status on public.withdrawals(user_id, status);

create index idx_profiles_user_id on public.profiles(user_id);

create index idx_messages_sender on public.messages(sender_id);
create index idx_messages_receiver on public.messages(receiver_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.campaigns enable row level security;
alter table public.donations enable row level security;
alter table public.campaign_updates enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.notifications enable row level security;
alter table public.withdrawals enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.reports enable row level security;
alter table public.settings enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.messages enable row level security;

-- ============================================
-- RLS POLICIES: USERS
-- ============================================

-- Anyone can view user summaries (for campaign pages)
create policy "Users can view public profiles"
  on public.users for select
  using (true);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================
-- RLS POLICIES: PROFILES
-- ============================================

create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: CATEGORIES
-- ============================================

create policy "Categories are publicly readable"
  on public.categories for select
  using (active = true);

create policy "Admins can manage categories"
  on public.categories for all
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: CAMPAIGNS
-- ============================================

create policy "Active campaigns are publicly readable"
  on public.campaigns for select
  using (
    status = 'active' or
    user_id = auth.uid() or
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Authenticated users can create campaigns"
  on public.campaigns for insert
  with check (auth.uid() = user_id);

create policy "Users can update own campaigns"
  on public.campaigns for update
  using (
    user_id = auth.uid() or
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    user_id = auth.uid() or
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can delete own campaigns"
  on public.campaigns for delete
  using (
    user_id = auth.uid() or
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: DONATIONS
-- ============================================

-- Donations visible to campaign owner, donor, and admins
create policy "Donations readable by authorized parties"
  on public.donations for select
  using (
    user_id = auth.uid() or
    exists (
      select 1 from public.campaigns
      where id = campaign_id and user_id = auth.uid()
    ) or
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Anyone can create a donation (including anonymous/guest)
create policy "Anyone can create donations"
  on public.donations for insert
  with check (true);

-- Only system/admins update donation status
create policy "Donations updatable by system"
  on public.donations for update
  using (
    user_id = auth.uid() or
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: CAMPAIGN UPDATES
-- ============================================

create policy "Campaign updates are publicly readable"
  on public.campaign_updates for select
  using (true);

create policy "Campaign owners can create updates"
  on public.campaign_updates for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.campaigns
      where id = campaign_id and user_id = auth.uid()
    )
  );

create policy "Users can update own updates"
  on public.campaign_updates for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own updates"
  on public.campaign_updates for delete
  using (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: COMMENTS
-- ============================================

create policy "Comments are publicly readable"
  on public.comments for select
  using (true);

create policy "Authenticated users can create comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update own comments"
  on public.comments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: LIKES
-- ============================================

create policy "Likes are publicly readable"
  on public.likes for select
  using (true);

create policy "Authenticated users can create likes"
  on public.likes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own likes"
  on public.likes for delete
  using (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: NOTIFICATIONS
-- ============================================

create policy "Users can read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "System can create notifications"
  on public.notifications for insert
  with check (true);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: WITHDRAWALS
-- ============================================

create policy "Users can view own withdrawals"
  on public.withdrawals for select
  using (
    user_id = auth.uid() or
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can create own withdrawals"
  on public.withdrawals for insert
  with check (auth.uid() = user_id);

create policy "Admins can manage withdrawals"
  on public.withdrawals for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: PAYMENT TRANSACTIONS
-- ============================================

create policy "Transaction readable by campaign owner or donor"
  on public.payment_transactions for select
  using (
    exists (
      select 1 from public.donations d
      where d.id = donation_id and d.user_id = auth.uid()
    ) or
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id and c.user_id = auth.uid()
    ) or
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "System can create transactions"
  on public.payment_transactions for insert
  with check (true);

create policy "System can update transactions"
  on public.payment_transactions for update
  using (true);

-- ============================================
-- RLS POLICIES: REPORTS
-- ============================================

create policy "Users can create reports"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

create policy "Users can view own reports"
  on public.reports for select
  using (
    reporter_id = auth.uid() or
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can manage reports"
  on public.reports for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: SETTINGS
-- ============================================

create policy "Settings are publicly readable"
  on public.settings for select
  using (true);

create policy "Admins can manage settings"
  on public.settings for all
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: FAQs
-- ============================================

create policy "Active FAQs are publicly readable"
  on public.faqs for select
  using (active = true);

create policy "Admins can manage FAQs"
  on public.faqs for all
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: TESTIMONIALS
-- ============================================

create policy "Active testimonials are publicly readable"
  on public.testimonials for select
  using (active = true);

create policy "Admins can manage testimonials"
  on public.testimonials for all
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: MESSAGES
-- ============================================

create policy "Users can read own messages"
  on public.messages for select
  using (
    auth.uid() = sender_id or auth.uid() = receiver_id
  );

create policy "Authenticated users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Users can update own received messages"
  on public.messages for update
  using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id);
