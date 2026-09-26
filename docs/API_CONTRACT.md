# HACKB4 Frontend ↔ Backend API Contract

The frontend currently runs on mock data. To connect the real backend, set in `.env.local`:

```
VITE_API_BASE_URL=https://api.hackb4.com/v1
VITE_USE_MOCKS=false
```

No component changes are needed — every call goes through `src/lib/api/index.ts`.
TypeScript types for every payload live in `src/lib/api/types.ts` (field names are snake_case, matching the DB schema).

All endpoints are JSON. Errors should return a non-2xx status with `{ "message": "Human readable error" }` —
the message is shown to the user in forms.

| Method | Path                       | Query / Body                                          | Response                                                                       |
| ------ | -------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------ |
| GET    | `/events`                  | `?category=hackathon\|placement\|workshop` (optional) | `Event[]`                                                                      |
| GET    | `/events/:slug`            | —                                                     | `Event` (404 if not found)                                                     |
| GET    | `/services`                | —                                                     | `Service[]`                                                                    |
| GET    | `/team`                    | —                                                     | `TeamMember[]`                                                                 |
| GET    | `/ad-campaigns/active`     | `?page=/events`                                       | `AdCampaign` or `null`                                                         |
| POST   | `/service-inquiries`       | `ServiceInquiry`                                      | `{ success: boolean, message?: string }`                                       |
| POST   | `/contact`                 | `{ name, email, message }`                            | `{ success: boolean, message?: string }`                                       |
| POST   | `/notifications/subscribe` | `{ token }`                                           | `{ success: boolean }`                                                         |
| POST   | `/newsletter/subscribe`    | `{ email, source? }`                                  | `{ success: boolean, message?: string }` — repeat sign-ups should also succeed |
| GET    | `/stats`                   | —                                                     | `PlatformStats` (`{ builders, hackathons, projects, countries, submissions }`) |
| GET    | `/projects`                | `?featured=true`                                      | `Project[]`                                                                    |
| GET    | `/builders`                | `?featured=true`                                      | `Builder[]`                                                                    |
| GET    | `/team-openings`           | `?limit=3`                                            | `TeamOpening[]`                                                                |
| GET    | `/activity`                | `?limit=10` (newest first)                            | `ActivityItem[]`                                                               |
| POST   | `/events/:id/conversions`  | `{ source, medium, campaign? }`                       | `204` (fire-and-forget)                                                        |

## Notes

- **New optional `Event` fields** for hackathon listings: `tags`, `duration_hours`, `team_size_min`, `team_size_max`,
  `participants_count`, `prize_pool_inr` (integer rupees). Cards hide any that are missing, so they can ship gradually.
  Event status (active / upcoming / completed) is derived on the frontend from `start_date` / `end_date`.

- `Event.event_type` is one of `virtual | in_person | hybrid | pan_india`. The spec PDF's DDL comment says `onsite` —
  the frontend expects `in_person`. Store `in_person` (or map it in the API response).
- Only published events (`is_published = true`) should be returned. `/events` must include past (completed) events too:
  the home page shows Active / Upcoming / Completed tabs.
- `ServiceInquiry.service_type` is the service **title** (e.g. `"Startup Incubation"`), not its id. The forms currently send
  `client_name`, `email`, `organization_name`, `service_type` and optional `message`; the other fields are reserved.
- Newsletter `source` is `"footer"` or `"early_access:<projects|builders|teams|account>"` (interest in upcoming features).
- Conversions are sent with `{ source: "platform", medium: "events_page", campaign: "hackathon_2026" }` — the same UTM
  values appended to the Devnovate registration URL.
- Full handover notes (every file and flow explained) live in `handover/`.
- `Service.icon` must be one of the names in `ServiceIconName` (see `types.ts`); unknown names fall back to a help icon.
- Dates are ISO 8601 strings (UTC). The frontend formats them in the visitor's locale.
- CORS must allow the site origin for GET/POST with `Content-Type: application/json`.
- Requests time out after 15 s on the client.
