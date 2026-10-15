-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  education_level text,
  course text,
  field_of_study text,
  academic_year int,
  institution text,
  region text,
  country text default 'India',
  academic_score numeric,
  annual_family_income numeric,
  social_category text,
  interests text[] not null default '{}',
  preferred_opportunity_types text[] not null default '{}',
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles select" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

-- Opportunities
create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  provider text,
  category text not null default 'other',
  description text,
  eligibility_criteria jsonb not null default '{}'::jsonb,
  eligibility_text text[] not null default '{}',
  benefits text,
  location_or_region text,
  application_open_date date,
  deadline date,
  required_documents text[] not null default '{}',
  application_steps text[] not null default '{}',
  application_instructions text,
  official_source_url text,
  official_application_url text,
  source_excerpt text,
  source_last_published_at timestamptz,
  last_checked_at timestamptz,
  verification_status text not null default 'pending',
  application_status text not null default 'unknown',
  missing_fields text[] not null default '{}',
  is_demo boolean not null default false,
  normalized_key text unique,
  discovered_by uuid,
  discovery_job_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index opp_status_idx on public.opportunities(verification_status);
create index opp_deadline_idx on public.opportunities(deadline);
create index opp_category_idx on public.opportunities(category);
grant select on public.opportunities to anon;
grant select, insert, update, delete on public.opportunities to authenticated;
grant all on public.opportunities to service_role;
alter table public.opportunities enable row level security;
create policy "public reads approved" on public.opportunities for select to anon, authenticated
  using (verification_status in ('verified','demo'));
create policy "discoverer reads own candidates" on public.opportunities for select to authenticated
  using (discovered_by = auth.uid());
create policy "admin reads all" on public.opportunities for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin insert" on public.opportunities for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update" on public.opportunities for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete" on public.opportunities for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  saved_at timestamptz not null default now(),
  unique (user_id, opportunity_id)
);
grant select, insert, delete on public.saved_opportunities to authenticated;
grant all on public.saved_opportunities to service_role;
alter table public.saved_opportunities enable row level security;
create policy "own saved" on public.saved_opportunities for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  status text not null default 'not_started',
  notes text,
  applied_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, opportunity_id)
);
grant select, insert, update, delete on public.applications to authenticated;
grant all on public.applications to service_role;
alter table public.applications enable row level security;
create policy "own applications" on public.applications for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.document_checklist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  document_name text not null,
  is_suggested boolean not null default false,
  is_completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, opportunity_id, document_name)
);
grant select, insert, update, delete on public.document_checklist to authenticated;
grant all on public.document_checklist to service_role;
alter table public.document_checklist enable row level security;
create policy "own checklist" on public.document_checklist for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.discovery_jobs (
  id uuid primary key default gen_random_uuid(),
  requested_by uuid not null,
  search_query text not null,
  category text,
  region text,
  status text not null default 'queued',
  stage text not null default 'queued',
  events jsonb not null default '[]'::jsonb,
  candidates jsonb not null default '[]'::jsonb,
  opportunity_ids uuid[] not null default '{}',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  results_count int not null default 0,
  error_summary text
);
create index jobs_user_idx on public.discovery_jobs(requested_by, started_at desc);
grant select on public.discovery_jobs to authenticated;
grant all on public.discovery_jobs to service_role;
alter table public.discovery_jobs enable row level security;
create policy "own jobs" on public.discovery_jobs for select to authenticated using (auth.uid() = requested_by or public.has_role(auth.uid(),'admin'));

create table public.source_verification_history (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  source_url text,
  checked_at timestamptz not null default now(),
  previous_deadline date,
  observed_deadline date,
  verification_result text not null,
  notes text
);
grant select, insert on public.source_verification_history to authenticated;
grant all on public.source_verification_history to service_role;
alter table public.source_verification_history enable row level security;
create policy "admin history select" on public.source_verification_history for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin history insert" on public.source_verification_history for insert to authenticated with check (public.has_role(auth.uid(),'admin'));

create table public.issue_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  opportunity_id uuid references public.opportunities(id) on delete cascade,
  message text not null check (char_length(message) between 3 and 1000),
  created_at timestamptz not null default now()
);
grant select, insert on public.issue_reports to authenticated;
grant all on public.issue_reports to service_role;
alter table public.issue_reports enable row level security;
create policy "report insert" on public.issue_reports for insert to authenticated with check (auth.uid() = user_id);
create policy "report select" on public.issue_reports for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));

-- updated_at trigger
create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;
create trigger t_profiles before update on public.profiles for each row execute function public.touch_updated_at();
create trigger t_opps before update on public.opportunities for each row execute function public.touch_updated_at();
create trigger t_apps before update on public.applications for each row execute function public.touch_updated_at();
create trigger t_docs before update on public.document_checklist for each row execute function public.touch_updated_at();

-- New user: profile + first user becomes admin
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'));
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Clearly labeled demo data (example.org links, not real opportunities)
insert into public.opportunities (title, provider, category, description, eligibility_criteria, eligibility_text, benefits, location_or_region, application_open_date, deadline, required_documents, application_steps, official_source_url, official_application_url, source_excerpt, last_checked_at, verification_status, application_status, is_demo, normalized_key) values
('[Demo] Merit Scholarship for Undergraduate Engineers', 'Demo Education Foundation', 'scholarship', 'Sample record for testing. A merit-based scholarship supporting undergraduate engineering students.', '{"education_levels":["undergraduate"],"fields":["engineering"],"min_score":75,"max_income":800000}', array['Undergraduate engineering student','Minimum 75% in previous exam','Family income below ₹8,00,000 per year'], '₹50,000 per year (demo value)', 'India', current_date - 10, current_date + 40, array['Previous year marksheet','Income certificate','Bonafide certificate'], array['Create account on portal','Fill application form','Upload documents','Submit before deadline'], 'https://example.org/demo-merit-scholarship', 'https://example.org/demo-merit-scholarship/apply', 'Demo excerpt: Applicants must be pursuing an undergraduate engineering degree with at least 75% marks.', now(), 'demo', 'open', true, 'demo-merit-eng'),
('[Demo] Women in STEM Research Fellowship', 'Demo Science Trust', 'grant', 'Sample record for testing. A fellowship for women pursuing STEM degrees.', '{"education_levels":["undergraduate","postgraduate"],"fields":["science","engineering","technology","mathematics"],"min_score":70}', array['Undergraduate or postgraduate STEM student','Minimum 70% aggregate'], 'Research stipend (demo value)', 'India', null, current_date + 20, array['Statement of purpose','Recommendation letter','Transcript'], array['Submit online form','Upload SOP'], 'https://example.org/demo-stem-fellowship', null, 'Demo excerpt: open to women students in STEM disciplines.', now(), 'demo', 'open', true, 'demo-stem-fellow'),
('[Demo] National Student Hackathon', 'Demo Innovation Council', 'hackathon', 'Sample record for testing. A 36-hour hackathon for college students.', '{"education_levels":["undergraduate","postgraduate"]}', array['Currently enrolled college student','Teams of 2–4'], 'Prize pool (demo value)', 'Online', current_date - 5, current_date + 12, array['College ID'], array['Register team','Submit idea abstract'], 'https://example.org/demo-hackathon', 'https://example.org/demo-hackathon/register', 'Demo excerpt: open to all enrolled students.', now(), 'demo', 'open', true, 'demo-hackathon'),
('[Demo] Summer Software Internship', 'Demo Tech Labs', 'internship', 'Sample record for testing. Eight-week paid internship.', '{"education_levels":["undergraduate"],"fields":["computer science","engineering"],"academic_years":[2,3]}', array['2nd or 3rd year undergraduate','Computer science or related field'], 'Monthly stipend (demo value)', 'Bengaluru, India', null, current_date + 30, array['Resume','Transcript'], array['Apply with resume','Online assessment','Interview'], 'https://example.org/demo-internship', null, 'Demo excerpt: second and third year students may apply.', now(), 'demo', 'open', true, 'demo-internship'),
('[Demo] Inter-College Innovation Challenge', 'Demo University Network', 'competition', 'Sample record for testing. Pitch an innovative solution to a social problem.', '{}', array['Any enrolled student'], 'Not stated', 'India', null, null, array[]::text[], array['Submit pitch deck'], 'https://example.org/demo-innovation', null, null, now(), 'demo', 'unknown', true, 'demo-innovation');
