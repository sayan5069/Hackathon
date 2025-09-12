# Smart Community Health — Dashboard

A clean, responsive web dashboard for a "Smart Community Health Monitoring and Early Warning System".  
Built with React + Vite + TypeScript + Tailwind CSS. Includes pages for Dashboard, Symptom Reports, and Map View (Northeast India embed).

## Features
- Dashboard: top navbar, key stats, real-time charts (pH, turbidity, temp), sensor readings table, alerts panel  
- Symptom Reports: villager report form (name, village, symptoms, date) + persisted table  
- Map View: embedded Northeast India map and list of places with color-coded risk levels (Safe / Warning / Outbreak)  
- Mobile-responsive, modern health + water theme (soft greens/blues)  
- Dummy/placeholder data included so the UI is populated out of the box

## Quick start (local)
1. Clone repository
2. Install:
   - pnpm: https://pnpm.io/
   - then run: pnpm install
3. Development: pnpm dev
4. Build: pnpm build
5. Start production build: pnpm start
6. Run tests: pnpm test
7. Type checking: pnpm typecheck
Notes: the project defaults to pnpm in package.json; adapt if you prefer npm/yarn.

## Project layout (important files)
- client/App.tsx — router + layout wrapper  
- client/pages/Index.tsx — Dashboard page  
- client/pages/SymptomReports.tsx — Reports page + form + table (localStorage)  
- client/pages/MapView.tsx — Map view (Google Maps embed + place list)  
- client/components/Layout.tsx — top navbar + shared layout  
- client/global.css + tailwind.config.ts — theme tokens, colors, layout  
- server/* — express endpoints (demo routes if needed)  
- shared/* — shared types

## Map & places
- The Map View uses an embedded Google Maps iframe (no API key required for the simple embed).  
- Clicking a place focuses the iframe on that coordinates. For more advanced interactivity (pan/zoom, geo features, markers, clustering), consider adding react-leaflet (OpenStreetMap) or Mapbox (requires API key).

## Environment & configuration
- No secrets are required for the basic embed. If you add Mapbox or other provider, add keys via environment variables and ensure they're kept out of git (.env, CI secret store).  
- To change theme colors, edit client/global.css variables (HSL format) and tailwind.config.ts extension tokens.

## Recommended MCP integrations
Connect useful integrations via the MCP popover for deployment, data, and tooling:
- [Connect to Neon](#open-mcp-popover) — serverless Postgres (DB)  
- [Connect to Netlify](#open-mcp-popover) — continuous deployment & hosting  
- [Connect to Zapier](#open-mcp-popover) — automation & workflows  
- [Connect to Figma](#open-mcp-popover) — design import (use Builder.io plugin link in MCP)  
- [Connect to Supabase](#open-mcp-popover) — DB + auth + realtime services  
- [Connect to Builder.io](#open-mcp-popover) — CMS & content management  
- [Connect to Linear](#open-mcp-popover) — project management & issues  
- [Connect to Notion](#open-mcp-popover) — documentation storage  
- [Connect to Sentry](#open-mcp-popover) — error monitoring & reporting  
- [Connect to Context7](#open-mcp-popover) — library docs and references  
- [Connect to Semgrep](#open-mcp-popover) — security scanning / SAST  
- [Connect to Prisma Postgres](#open-mcp-popover) — ORM for Postgres

(You can open the MCP popover from the Builder environment UI to connect any of the above.)

## Deployment
- Quick: connect the repo to Netlify or Vercel (MCP) and enable automatic deploys.  
- Netlify: (MCP) recommended — builds the source server-side; no local build required prior to linking.  
- Vercel: (MCP) recommended — automatic for frontend + serverless functions.

## Extending
- Replace embedded map with react-leaflet for richer map controls and markers.  
- Wire symptom reports to a persistent DB (Neon / Supabase) and add basic auth for reporting.  
- Add realtime sensor feeds via WebSocket / server-sent events to push new alerts.

## Contributing
- Branch off main, make changes, run pnpm test and pnpm typecheck before PR.  
- Follow existing file and component patterns (small, reusable UI components under client/components/ui).

## Troubleshooting
- If UI looks off: confirm tailwind built and that client/global.css variables are HSL strings (tailwind uses hsl(var(--...))).  
- If map embed is blocked: check CSP and embedding policy for Google Maps, or switch to leaflet + OSM.



---

If you’d like, I can:
- Create this README.md file in the repo for you, or
- Open a PR with README plus brief CONTRIBUTING and ISSUE_TEMPLATE files. Which would you prefer?
