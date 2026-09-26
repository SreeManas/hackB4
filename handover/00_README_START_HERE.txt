================================================================================
 HACKB4 FRONTEND  -  BACKEND HANDOVER PACKAGE
 Start here.
================================================================================

Prepared: 25 Sep 2026
Project:  HACKB4 website (hackb4.com) - frontend is complete and runs on mock data.
For:      Backend team building the REST API + database.


--------------------------------------------------------------------------------
1. WHAT THIS PACKAGE IS
--------------------------------------------------------------------------------

The frontend (React single-page app) is finished. Every piece of data it shows
and every form it submits already goes through ONE file:

    src/lib/api/index.ts

Right now that file answers with fake ("mock") data. When your API is live, the
frontend team changes two environment variables and the site talks to your
server instead. NO component code needs to change - as long as your API returns
exactly the JSON shapes described in these files.

So your job is: build the 15 endpoints in 04_API_ENDPOINTS_SPEC.txt, returning
the shapes in 05_DATA_MODELS_AND_DATABASE.txt.


--------------------------------------------------------------------------------
2. FILES IN THIS FOLDER (read in this order)
--------------------------------------------------------------------------------

  00_README_START_HERE.txt              This file. Overview + quick start.

  01_PROJECT_SETUP_AND_TOOLING.txt      How to install, run, build and deploy the
                                        frontend. Tech stack. Env variables.
                                        How to point the frontend at your API.

  02_ARCHITECTURE_AND_FOLDER_STRUCTURE.txt
                                        Every folder and every file in src/
                                        explained in plain words.

  03_API_LAYER_EXPLAINED.txt            How the frontend calls the backend:
                                        fetch wrapper, timeouts, error handling,
                                        caching, mock vs real switch.

  04_API_ENDPOINTS_SPEC.txt             *** THE MOST IMPORTANT FILE ***
                                        All 15 endpoints: method, path, query,
                                        request body, response, example JSON,
                                        error rules, which screen uses it.

  05_DATA_MODELS_AND_DATABASE.txt       Every data type field-by-field, and a
                                        suggested PostgreSQL schema. Lists the
                                        differences from the original spec PDF.

  06_PAGES_AND_FEATURES_WALKTHROUGH.txt Every page/route of the site, what it
                                        shows, and which API calls it makes.

  07_FORMS_AND_USER_FLOWS.txt           Every form and interactive flow step by
                                        step (contact, service inquiry,
                                        newsletter, early access, push opt-in,
                                        event registration + conversion
                                        tracking, ad popup).

  08_BACKEND_CHECKLIST_AND_OPEN_ITEMS.txt
                                        What you must build, known gaps, open
                                        questions, and how to test the
                                        integration end to end.

Also in the repo:
  docs/API_CONTRACT.md                  Short-form version of the API contract
                                        (one table). The .txt files here are the
                                        long-form explanation of it.
  src/lib/api/types.ts                  The TypeScript source of truth for every
                                        JSON shape. If a .txt file and types.ts
                                        ever disagree, types.ts wins.
  Website Architecture & Technical Specification.pdf
                                        The original product spec (database DDL,
                                        sprint plan). See file 05 for where the
                                        built frontend differs from it.


--------------------------------------------------------------------------------
3. THE SITE IN ONE PARAGRAPH
--------------------------------------------------------------------------------

HACKB4 is a builder community that runs hackathons, placement drives and
workshops, and sells 11 services to colleges, companies and sponsors. The site
has 6 public pages: Home, Events (list), Event detail, Services, Our Team,
Contact. Users do NOT register for events on this site - the "Register" button
sends them to the external Devnovate portal (with UTM tracking). The site
collects leads (contact form, service inquiries), newsletter emails, push
notification tokens and click conversions. Accounts / login, builder profiles,
project pages and the team finder are "coming soon": the buttons open an
"early access" modal that collects an email.


--------------------------------------------------------------------------------
4. QUICK SUMMARY OF WHAT THE BACKEND MUST PROVIDE
--------------------------------------------------------------------------------

  READ endpoints (GET)                        WRITE endpoints (POST)
  ---------------------------------------     -----------------------------------
  /events            list, category filter    /contact                 contact form
  /events/:slug      one event                /service-inquiries       lead capture
  /services          the 11 services          /newsletter/subscribe    email list
  /team              team members             /notifications/subscribe push token
  /ad-campaigns/active  popup ad per page     /events/:id/conversions  click tracking
  /stats             platform totals
  /projects?featured=true
  /builders?featured=true
  /team-openings?limit=3
  /activity?limit=10

  Rules that apply to ALL endpoints:
   - JSON in, JSON out. Field names are snake_case.
   - Dates are ISO 8601 strings in UTC, e.g. "2026-10-08T09:00:00.000Z".
   - Errors: any non-2xx status with body { "message": "Readable text" }.
     That message is shown to the user as-is in forms, so write it for humans.
   - CORS must allow the site origin (https://hackb4.com, plus preview/local
     origins) for GET and POST with Content-Type: application/json.
   - The browser gives up after 15 seconds.
   - No authentication is needed for any current endpoint (all public).


--------------------------------------------------------------------------------
5. QUICK START (see file 01 for detail)
--------------------------------------------------------------------------------

  npm install
  npm run dev                 -> http://localhost:5173 (uses mock data)

  To use your API instead, create a file named .env.local in the project root:

      VITE_API_BASE_URL=http://localhost:4000/v1
      VITE_USE_MOCKS=false

  then restart `npm run dev`.


--------------------------------------------------------------------------------
6. STATE OF THE CODE AT HANDOVER
--------------------------------------------------------------------------------

  - TypeScript typecheck: passes
  - ESLint:               passes
  - Prettier formatting:  passes
  - Production build:     passes (one harmless size warning for the 3D
                          library chunk - it is lazy and cached separately)

  Changes made during handover preparation:
  1. Event detail page: if the backend ever sends a malformed
     devnovate_registration_url, the page no longer crashes - the link is used
     as-is instead of having UTM params added.
  2. Conversion tracking now also sends campaign: "hackathon_2026", matching
     the UTM values on the outbound link.
  3. Newsletter sign-ups now send a "source" field so you can tell footer
     sign-ups from "early access" interest (e.g. "early_access:teams").
  4. Hackathon cards: participants_count / prize_pool_inr sent as null no
     longer crash the card - null and "missing" are treated the same.
  5. docs/API_CONTRACT.md updated with these points and the spec mismatches.
