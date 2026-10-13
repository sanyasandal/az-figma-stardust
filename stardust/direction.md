# Direction — One AZ v3.2 Login & Registration (replica)

**Flow:** replica (keep the design), hands-off.
**Source:** Figma `rsZQmpVzuyn0KhCDA3WN60`, node `13496:19403`, read with the excatfigma MCP.
**Scope:** 23 states, each with desktop, tablet and mobile frames. Every state is one DA page; the tablet and mobile frames are handled by responsive CSS.

## Design system
- Colours: interaction `#d0006f`, heading `#830051`, text `#3c4242`, muted surface `#e3ecec` / `#eef2f2`.
- Type: Inter (variable, self-hosted) for body and UI. Lexia for headings and nav falls back to Georgia because Lexia is not licensed in this repo.
- Buttons: primary is solid pink, secondary is a pink outline. The radius is 2px.

## Blocks
- `auth-form`: one shared form block. Each row is label | type | placeholder/options/style | side link. Variants are `two-column` and `wide`. When placed in a `login-card` section, the actions stack.
- `loader`: two pulsing dots, used for Waiting Confirmation.
- `header`: utility bar plus the main nav. The `minimal` mode (page metadata `Header Style: minimal`) shows only the logo.
- `footer`: three columns and a bottom row with social icons and the job code.

## Assumptions
- No auth backend exists. Forms validate on the client, then show a "not connected" status, so nothing is sent.
- Toggles on Channel Consent are not enforced as required.
- The active language is EN; Figma shows DE.
- Hrefs not specified in Figma are inferred (see `replica/inconsistency-register.md`).
