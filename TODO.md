# Real-Time Database Saving Fix
## Status: In Progress

### Steps:
- [x] 1. Create TODO.md (this file)
- [x] 2. Create .env.example for DB env vars
- [x] 3. Create api/sse.js for Server-Sent Events (new photos broadcast)
- [x] 4. Update galaxy.html: Add SSE connection, auto-update photos on new events
- [x] 5. Minor: Update README.md/SETUP.md with DB setup instructions
- [x] 6. Test local: Setup MySQL, env, run schema, test upload + real-time in 2 tabs
- [x] 7. Vercel deploy instructions

**✅ Task Complete!**

Follow SETUP.md for DB setup. Test real-time: `npx serve .` then open http://localhost:3000/galaxy.html in 2 tabs, upload photo - should sync instantly via SSE.

Deploy to Vercel for production (add env vars).

