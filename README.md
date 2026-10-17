# Academic Pathways Ai

SCHOLARSCOUT — FINAL MASTER WEBSITE DEVELOPMENT PROMPT

1. Project Overview

Build a complete, functional, modern, responsive, AI-powered web application called ScholarScout.

Brand tagline: Discover Opportunities. Unlock Your Future.

Core mission: Help students discover relevant scholarships, grants, internships, hackathons, and competitions from reliable sources, understand their eligibility, prepare the required documents, and track their applications without missing important deadlines.

Problem Statement

Students often miss valuable scholarships and competitions because information is scattered across multiple websites. Finding trustworthy opportunities, checking eligibility, identifying required documents, and tracking deadlines can be time-consuming and confusing.

Proposed Solution

ScholarScout uses AI and the mandatory TinyFish live-web integration to discover opportunities, retrieve information from official websites, extract eligibility requirements, compare them against student profiles, and present personalized recommendations with deadlines, benefits, documents, verification status, and official application links.

Important: Build a real, working application with a connected backend, database, and functional TinyFish integration. Do not create only a static landing page, a UI mockup, or non-functional buttons.

2. Official Branding and Website Theme

Use the uploaded ScholarScout logo as the official brand identity.

Design requirements

Use the provided logo asset without redesigning, distorting, cropping important content, or changing its proportions.

Primary color: deep navy blue, approximately #071B53.

Main background: white, #FFFFFF.

Secondary colors: light blue and subtle lavender for highlights and AI-related features.

Text: dark navy or charcoal for headings and readable body text.

Cards: white backgrounds with subtle borders, restrained shadows, and rounded corners.

Buttons: navy-blue primary buttons with white text; secondary buttons should use light backgrounds and navy text.

Use a clean, modern sans-serif font such as Inter.

Use consistent spacing, professional icons, clear typography, and accessible contrast.

Avoid excessive gradients, neon colors, unnecessary animations, and cluttered layouts.

Use the logo consistently in the navbar, login and signup pages, dashboard sidebar, and footer.

Make the entire website responsive on desktop, tablet, and mobile devices.

The website should feel trustworthy, professional, student-friendly, and suitable for a modern education technology startup.

Suggested design elements

Navy-blue navigation bar or white navbar with navy branding.

Hero section with a bold headline, short description, and prominent opportunity search.

Opportunity cards showing benefits, deadlines, eligibility status, and source verification.

Dashboard sidebar with clean icons.

Subtle lavender or blue highlights for AI-generated explanations.

Loading skeletons, informative empty states, clear error messages, and confirmation feedback.

3. Technology Stack

Use the following technology stack unless the development environment requires a compatible alternative.

Frontend

React with TypeScript.

Tailwind CSS.

A reusable component library such as shadcn/ui, if supported.

Lucide icons.

React Router or an equivalent routing solution.

Responsive layouts and reusable components.

Backend

Server-side API endpoints using the framework's supported backend functionality.

TypeScript where possible.

Secure server-side integrations with TinyFish and the selected AI provider.

Database and authentication

Use Supabase with PostgreSQL for:

User authentication.

Student profiles.

Opportunities.

Bookmarks.

Application tracking.

Document checklist status.

Source verification history.

Admin permissions.

Use Row Level Security (RLS) to ensure users can access only their own private data and authorized administrators can manage opportunity records.

AI

Use an LLM API for:

Summarizing official notifications.

Explaining eligibility.

Answering questions about opportunities.

Converting complex requirements into simple language.

Identifying missing information from extracted content.

AI-generated answers must be grounded in retrieved source content.

Live-web discovery

TinyFish integration is mandatory.

Integrate TinyFish Search and Fetch APIs into the actual backend workflow. Use the Web Agent when a dynamic or multi-step website requires it and the available API supports the task.

Deployment

Use Vercel or another compatible hosting platform for deployment.

Keep all private API keys in server-side environment variables. Never expose secrets in client-side code.

4. Website Pages

Build all the following pages with consistent branding and working navigation.

Page 1: Landing Page

Create an attractive homepage containing:

Navbar with ScholarScout logo.

Navigation links: Home, Explore Opportunities, How It Works, About, Login, and Sign Up.

Hero headline: “Find the Right Opportunities. Build Your Future.”

Supporting text explaining how ScholarScout helps students discover scholarships and competitions.

Search bar with placeholder: “Search scholarships, grants, internships, or competitions...”

Primary CTA: “Find My Opportunities”.

Secondary CTA: “Explore Opportunities”.

Featured opportunity cards populated from the database.

A How It Works section:

Create your student profile.

Discover opportunities using live-web research.

Check eligibility.

Track applications and deadlines.

Feature highlights for AI matching, TinyFish live discovery, deadline tracking, and source verification.

Trust and transparency section explaining official sources and verification.

Footer with About, Contact, Privacy Policy, Terms, and relevant links.

Do not display invented platform statistics, fabricated testimonials, or fake partner logos.

Page 2: Authentication

Create:

Sign-up page.

Login page.

Password reset flow.

Appropriate form validation and error states.

Secure session handling.

Allow students to access their personalized dashboard after signing in.

Page 3: Student Profile Setup

Create an onboarding form that collects only information relevant to opportunity matching.

Fields may include:

Education level.

Course or degree.

Academic year.

Institution.

State or region.

Academic marks or CGPA, where relevant.

Field of study and interests.

Opportunity types of interest.

Relevant income or category criteria, only when needed for particular opportunities.

Allow students to skip optional fields and update their profile later.

Explain why sensitive eligibility information is requested. Do not require unnecessary personal information, identity documents, passwords, or financial account information.

Page 4: Explore Opportunities

Build a searchable, filterable opportunity discovery page.

Opportunity categories:

Scholarships.

Grants and fellowships.

Internships.

Hackathons.

Academic and innovation competitions.

Other verified student opportunities.

Include:

Search by title, provider, keyword, or field of study.

Filters by opportunity type, location, deadline, eligibility, and benefits.

Sort by relevance, deadline, or recently verified.

Clear filter and reset options.

Pagination or incremental loading.

Loading, error, and empty states.

Each opportunity card should show:

Opportunity title.

Provider or organizer.

Category.

Short description.

Benefits or award amount, when stated.

Application deadline.

Eligibility status, when a student is signed in.

Verification status.

Last-verified date.

“View Details” button.

“Save” button.

Never display an invented deadline, benefit, eligibility requirement, or official link.

Page 5: Opportunity Details

Every opportunity must have a dedicated detail page containing:

Opportunity title and provider.

Full description.

Eligibility requirements.

Academic requirements.

Location or eligible regions.

Benefits and funding details.

Application opening and closing dates, if available.

Required documents.

Application steps.

Official source URL.

Official application URL, when available.

Last-verified timestamp.

Source verification status.

Eligibility analysis for the signed-in student.

Save opportunity and track application buttons.

Clearly distinguish the original source page from the actual application link.

If a field cannot be verified, display “Not stated” or “Needs verification” rather than generating a value.

Page 6: Student Dashboard

Create a personalized dashboard with:

Welcome message.

Profile completeness indicator.

Recommended opportunities.

Saved opportunities.

Upcoming deadlines.

Recently discovered opportunities.

Application status summary.

Required document checklist.

Quick action to discover new opportunities.

Quick action to update profile.

Allow students to track applications using statuses such as:

Not Started.

In Progress.

Applied.

Completed.

Closed or No Longer Pursuing.

Let students update statuses manually. Do not claim an application was submitted unless a verified submission mechanism exists.

Page 7: Live Opportunity Discovery

This is a core feature and must use the real TinyFish APIs.

Build a dedicated discovery interface with:

Topic or keyword input.

Region selection.

Opportunity category selection.

Optional student-profile-based search.

“Discover Opportunities” button.

Search progress indicator.

Search results.

Source URLs.

Extraction status.

Verification status.

Retry controls for failed operations.

Example search:

“Find current scholarships for first-year engineering students in India.”

Display useful progress states such as:

Searching the live web.

Identifying relevant official sources.

Retrieving source content.

Extracting opportunity details.

Validating records.

Matching opportunities to the student profile.

These states must reflect actual backend progress. Do not simulate successful API calls or display fake live search results.

Page 8: AI Eligibility Checker

Create an eligibility analysis section on each opportunity page.

The checker should compare explicit eligibility requirements against the student's profile.

For every criterion, display one of:

Meets requirement.

Does not meet requirement.

Information missing.

Needs manual verification.

Show:

Requirements satisfied.

Requirements not satisfied.

Missing profile information.

Explanation of the decision.

Relevant supporting source excerpts or citations.

Suggested next steps.

Do not use an arbitrary AI-generated percentage as a substitute for eligibility checking.

If you show a match score, clearly label it as a relevance score, not a guarantee of eligibility or selection.

Use deterministic rule-based checks for explicit requirements. Use AI to explain the result, not to override the verified rules.

Page 9: AI Assistant

Build an AI assistant that answers questions about the student's opportunities.

Example questions:

Which scholarships are relevant to my profile?

Why does this opportunity match me?

Which eligibility requirements have I not satisfied?

What documents do I need?

Explain this scholarship notification in simple language.

Which of my saved opportunities have approaching deadlines?

The assistant should retrieve relevant records and official source content before answering.

It must not invent facts, deadlines, links, eligibility requirements, or benefits. If reliable evidence is unavailable, it should clearly say so.

Do not expose API keys, internal prompts, private student records, or another user's data.

Page 10: Application Tracker and Document Checklist

For each saved opportunity, allow students to:

Track application status.

Review required documents.

Mark checklist items as complete.

Add personal notes.

View the application deadline.

Open the official application page.

Record the date they applied.

Checklist items must be based on the opportunity's official requirements. Clearly label any suggested documents that are not explicitly required.

Provide deadline reminders for saved opportunities through an appropriate notification mechanism.

Page 11: Admin Dashboard

Create an admin-only dashboard with:

Add opportunity.

Edit opportunity.

Review discovered opportunities.

Approve or reject extracted records.

Verify source URLs.

Check for duplicate records.

Review missing or inconsistent data.

Update opportunity status.

Mark expired opportunities.

View source verification history.

Review failed discovery jobs.

Newly discovered opportunities should not automatically become trusted, verified listings without appropriate validation.

Protect admin routes and database operations using server-side authorization and Supabase RLS.

Page 12: About and Trust

Explain:

The ScholarScout mission.

How live-web discovery works.

How TinyFish supports website research.

How AI eligibility matching works.

How official sources are verified.

What the platform can and cannot guarantee.

How users can report incorrect or expired information.

State clearly that ScholarScout helps students discover and assess opportunities but does not guarantee eligibility, awards, or selection.

5. Mandatory TinyFish Integration

TinyFish must perform real work in ScholarScout. A placeholder integration or a token mention is not acceptable.

Use the current official TinyFish documentation to verify the endpoint URLs, request payloads, authentication method, response format, usage limits, and available features before implementation.

A. TinyFish Search API

Use the Search API to discover relevant opportunities from the live web.

Example query:

“Official scholarships, grants, internships, and student competitions for undergraduate students in India, current application cycles.”

Search queries should be generated from:

User keywords.

Opportunity type.

Student education level.

Region.

Relevant profile details.

Do not include unnecessary sensitive student information in external search queries.

Search results should be treated as candidate sources, not automatically verified facts.

B. TinyFish Fetch API

For relevant search results, use Fetch to retrieve content from official pages.

Extract available information such as:

Opportunity title.

Provider.

Eligibility criteria.

Academic requirements.

Benefits.

Application opening date.

Application deadline.

Required documents.

Application instructions.

Official application URL.

Source URL.

Use structured extraction and validate the returned data before saving it.

Preserve source references and relevant excerpts so users and administrators can check the information.

C. TinyFish Web Agent

Where needed, use the Web Agent for multi-step research on dynamic websites, such as navigating a portal to locate a published notification.

Use this only when the available API and the website's access rules permit the workflow. Do not use it to bypass authentication, CAPTCHAs, access restrictions, or other security controls.

D. End-to-end workflow

Implement this complete backend flow:

Receive a discovery request from the frontend.

Validate the request.

Call TinyFish Search using the appropriate query.

Collect candidate URLs and source metadata.

Prioritize relevant official sources.

Call TinyFish Fetch for suitable pages.

Extract structured opportunity records.

Normalize titles, dates, categories, and provider names.

Validate the extracted data.

Detect duplicates.

Compare deadline information and previously stored records.

Save valid candidates with their source and verification status.

Route uncertain or incomplete records to admin review.

Match approved records against student profiles.

Display the results in the frontend.

Handle API failures, rate limits, malformed responses, timeouts, empty results, inaccessible pages, and partial extraction gracefully.

Use retries with sensible limits and backoff where appropriate. Do not create duplicate database records when a retry occurs.

E. TinyFish security and reliability

Store the TinyFish API key in server-side environment variables.

Never expose the key in browser code.

Never commit secrets to version control.

Add request validation and rate limiting.

Keep discovery operations server-side.

Log useful errors without logging secrets or unnecessary personal information.

Track discovery job status and timestamps.

Mark stale information for re-verification.

Follow official website access rules and applicable terms.

F. TinyFish demonstration requirements

Include a functional demonstration where a user enters a search query, the backend calls TinyFish Search, selected official pages are fetched, extracted fields are validated, and the results appear in ScholarScout.

Show source URLs and the status of each stage.

Use a genuine TinyFish API response in the live demonstration. If credentials are missing, display a clear configuration message and allow the UI to be tested with separately labeled demo data. Never pretend that a live search succeeded when it did not.

6. Database Schema

Create the following PostgreSQL tables using Supabase.

profiles

Fields:

id: references the authenticated user.

full_name.

education_level.

course.

academic_year.

institution.

region.

academic_score, where relevant.

interests.

preferred_opportunity_types.

relevant optional eligibility attributes.

created_at.

updated_at.

opportunities

Fields:

id.

title.

provider.

category.

description.

eligibility_criteria.

benefits.

location_or_region.

application_open_date.

deadline.

required_documents.

application_instructions.

official_source_url.

official_application_url.

source_excerpt.

source_last_published_at, if known.

last_checked_at.

verification_status.

application_status.

created_at.

updated_at.

Use appropriate nullable fields for unknown dates or missing details. Do not invent values to fill database columns.

saved_opportunities

Fields:

id.

user_id.

opportunity_id.

saved_at.

Enforce uniqueness on the user and opportunity combination.

applications

Fields:

id.

user_id.

opportunity_id.

status.

notes.

applied_at.

created_at.

updated_at.

document_checklist

Fields:

id.

user_id.

opportunity_id.

document_name.

is_completed.

updated_at.

discovery_jobs

Fields:

id.

requested_by.

search_query.

status.

started_at.

completed_at.

results_count.

error_summary.

source_verification_history

Fields:

id.

opportunity_id.

source_url.

checked_at.

previous_deadline.

observed_deadline.

verification_result.

notes.

Add appropriate foreign keys, indexes, constraints, timestamps, and access policies.

Avoid storing sensitive personal information unless it is genuinely necessary.

7. Eligibility Matching Logic

Build a reusable eligibility-matching service.

Matching process

Retrieve the student profile.

Retrieve the opportunity's validated criteria.

Normalize and compare the relevant fields.

Evaluate explicit hard requirements.

Identify unmet and missing requirements.

Generate a clear explanation.

Store or return the result.

Example:

Opportunity requirements:

Undergraduate engineering students.

Minimum academic score of 75%.

Applicant must meet a specified income threshold.

Student profile:

Undergraduate engineering student.

Academic score of 82%.

Income information not provided.

Expected result:

Course requirement: Meets requirement.

Academic score: Meets requirement.

Income requirement: Information missing.

Overall status: Needs verification.

Do not mark the student as fully eligible while a required condition remains unknown.

Use clear statuses such as:

Eligible based on available criteria.

Potentially eligible.

Ineligible based on a confirmed unmet requirement.

Needs verification.

A final decision should always refer users to the official requirements.

8. Security, Privacy, and Quality

Implement:

Secure authentication.

Server-side authorization.

Supabase Row Level Security.

Input validation.

API rate limiting.

Secure secret management.

Appropriate error handling.

Responsive and accessible UI.

Protection against unsafe links and untrusted fetched content.

Safe rendering of extracted webpage content.

Separation between admin and student permissions.

Privacy-conscious handling of profile data.

Treat all webpage content as untrusted data. Never allow fetched pages or extracted instructions to override system rules, reveal secrets, or execute arbitrary code.

Provide a privacy policy and terms page suitable for a prototype, clearly identifying any integrations and the types of data collected.

9. Development and Implementation Plan

Build the application in the following order.

Phase 1: Frontend and branding

Integrate the supplied logo.

Implement the navy-blue and white theme.

Build the landing page and shared layout.

Create authentication screens.

Create profile setup.

Create opportunity cards and detail pages.

Build the dashboard and admin UI.

Use clearly labeled demo data during this phase.

Phase 2: Database and authentication

Set up Supabase.

Create the database schema.

Configure authentication.

Implement RLS policies.

Connect student profiles, bookmarks, opportunities, and applications.

Phase 3: TinyFish integration

Configure the TinyFish API key.

Implement Search API calls.

Implement Fetch API calls.

Normalize and extract opportunity details.

Add error handling and duplicate detection.

Store results with source metadata.

Build the Live Opportunity Discovery page.

Phase 4: Eligibility and AI

Implement deterministic eligibility checks.

Integrate the selected LLM API.

Add grounded explanations.

Add the AI assistant.

Display missing criteria and source evidence.

Phase 5: Tracking and verification

Add application statuses.

Add document checklists.

Add deadline sorting and reminders.

Build the admin verification workflow.

Add source history and stale-record checks.

Phase 6: Testing and deployment

Test all routes and forms.

Test authentication and access permissions.

Test TinyFish with real API credentials.

Test unavailable and expired pages.

Test extraction errors and duplicate results.

Test mobile responsiveness.

Deploy the application.

Document environment variables and setup instructions.

10. Testing Requirements

Verify that:

Every navigation item works.

Forms validate input.

Student data persists after refreshing.

Users cannot access other users' private records.

Admin operations require admin authorization.

Search filters return correct results.

TinyFish Search is called by the backend.

TinyFish Fetch retrieves relevant page content.

Extracted fields are saved correctly.

Missing or uncertain details are clearly labeled.

Duplicate records are not created.

Expired opportunities are flagged.

Eligibility results are consistent with the stored rules.

AI explanations reference source evidence.

Bookmarks and application statuses persist.

Deadline reminders do not claim to have been delivered unless delivery is confirmed.

Errors are handled without crashing the application.

The site works on mobile and desktop.

No private API keys appear in client-side code.

11. Final Deliverables

Produce:

A complete responsive ScholarScout website.

The official logo integrated throughout the application.

Consistent navy-blue, white, light-blue, and lavender styling.

Functional landing page, authentication, profile setup, opportunity explorer, detail pages, dashboard, AI assistant, and admin panel.

Supabase database schema and RLS policies.

Real TinyFish Search and Fetch integrations.

A working opportunity extraction and validation pipeline.

Eligibility matching and AI explanations.

Saved opportunities, application tracking, and document checklists.

Environment-variable template without real secrets.

Setup instructions and README.

Deployment instructions.

A working live-web demonstration using real TinyFish responses.

Clearly labeled demo data for development and fallback testing.

Final instruction

Build the complete application, not merely a design concept.

Prioritize a working end-to-end workflow: a student creates a profile, searches for opportunities, ScholarScout uses TinyFish to discover live web results, Fetch retrieves relevant official information, the backend validates and stores the extracted records, the matching engine evaluates eligibility, and the student receives personalized recommendations with source links and deadlines.

Use reusable components, clean architecture, sensible defaults, and maintainable code. Do not leave the core functionality as TODOs or fake API calls. If credentials or external service access are unavailable, implement the integration code and explain exactly what configuration is required to activate it.

The final product should look professional, feel trustworthy, use the supplied ScholarScout branding, and demonstrate a genuinely useful AI-powered student opportunity discovery platform.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/810a5b61-0b7e-4e09-b02c-9c56723ad48a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
