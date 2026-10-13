# Journal — az-figma-stardust replica

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## 2026-10-12T12:22:38Z — Login & Registration replicated from Figma to EDS (hands-off)

**Prompt:** Use stardust and the excatfigma MCP to migrate the Figma page "Login & Registration" (node 13496:19403) to EDS in auto mode, without the Figma skill.

**Decisions:**
- Replica flow, hands-off; every state approved by hands-off after visual and interaction checks.
- One shared `auth-form` block for all form states, a new `loader` block, and a re-skinned header and footer.
- Section Metadata `login-card` with a background image for Login.
- `Header Style: minimal` metadata for the flow pages.

**Artifacts touched:**
- blocks/auth-form, blocks/loader, blocks/header, blocks/footer — created or updated
- styles/styles.css, styles/fonts.css, scripts/scripts.js, fonts/, icons/ — updated
- DA: /nav, /footer, /index and the 23 state pages — created and previewed
- stardust/state.json, direction.md, replica/inconsistency-register.md — created

**Findings worth flagging:**
- The backend applies Section Metadata on the server as a class plus `data-background`, so no client parser is needed.
- An `auth-form` row typed `text` renders a text input; use `content` for rich text.

**Open questions:**
- Real link targets, select options, and the auth backend integration.

## Deploy (stardust deploy, hands-off)

- Gates on all 24 pages: exactly one h1, 0 about:error, Title + Description. Added Description metadata to resend-verification-email, forgot-password, reset-password.
- Code: PR #1 merged to main (835bdb5).
- Content: nav, footer, index + 23 state pages previewed and published via da-live-admin MCP (no DA_TOKEN, so deploy-batch.mjs not used).
- Verified live: https://main--az-figma-stardust--sanyasandal.aem.live/login and the other 23 pages pass the gates; auth-form loads.
- Not created: DA /library block library (no stardust skill does this).
