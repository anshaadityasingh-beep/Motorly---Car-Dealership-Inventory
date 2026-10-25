# 10 — README, Test Report & Submission Checklist

Read `00_master_context.md` first. Prerequisite: deployment done.

## Goal
Produce the documentation the assignment requires. Be factual: only describe what actually exists in the repo.

## README.md must contain
1. **Project overview:** what it is, features, tech stack with a short "why" for key choices, architecture diagram (Mermaid or ASCII) of routes → controllers → services → models and the React structure.
2. **Live demo links** (frontend + backend health URL) and demo admin/user credentials for reviewers (use a dedicated demo admin, never real credentials).
3. **Local setup:** prerequisites, clone, backend install/env/run, frontend install/env/run, seeding the admin, running tests — exact commands for each.
4. **API documentation:** table of every endpoint with method, auth/role, request body, example response, and status codes.
5. **Testing:** how to run backend and frontend tests, coverage commands, and a **Test Report** section with the real console output / coverage summary tables (run the commands and paste actual results; screenshot the coverage HTML if possible).
6. **TDD approach:** explain the Red-Green-Refactor flow and point to example commit hashes that show it.
7. **Screenshots** section with placeholders `docs/screenshots/*.png` for: login, dashboard, search results, sold-out card, admin panel, mobile view. (I will capture and add the images.)
8. **My AI Usage** section — create the heading and structure with placeholders only; **I will write the content myself** covering: tools used, how I used them, and my honest reflection on workflow impact. Do not invent or fabricate this.
9. Project structure tree, known limitations, future improvements.

## Other deliverables
- Create `PROMPTS.md` at the repo root with a header and a note explaining that it holds raw, unedited chat logs/links. Do NOT generate summaries or fabricate chat content; I will paste/export the real logs.
- Verify `.gitignore`, `.env.example` files, no secrets in history, and that every commit involving AI has the co-author trailer (print a `git log` audit command I can run).
- Final submission checklist: public repo, README complete, screenshots added, test report included, PROMPTS.md filled, live URLs working.
