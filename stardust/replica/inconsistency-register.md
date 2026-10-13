# Inconsistency register — Login & Registration

| # | Where | Figma | Shipped | Why |
|---|-------|-------|---------|-----|
| 1 | Registration | "First name" used twice | Kept verbatim | Placeholder copy, not ours to correct |
| 2 | Registration | "Privicy Policy" | Kept verbatim | Same |
| 3 | Several | "Your email adress" | Kept verbatim | Same |
| 4 | Headings, nav | Lexia | Georgia fallback | Font not licensed in this repo |
| 5 | All forms | Submit goes to a backend | "Not connected" status message | No auth service exists |
| 6 | Registration selects | Options not specified | Placeholder option only | Unknown values |
| 7 | Header, footer | Link targets not specified | Inferred paths (/contact-us, /privacy-notice, /de/ …), many return 404 | Missing from the design |
| 8 | Header dropdowns | Contents not specified | "All products", "All therapeutic areas" | Placeholders |
| 9 | Language switcher | DE active | EN active | Content is English |
| 10 | Channel Consent | Toggles marked required | Not enforced | Forcing marketing consent is legally dubious |
| 11 | Tablet and mobile frames | Separate frames | Responsive CSS | One page per state |
| 12 | Email Verification | Button styles ambiguous | Resend is primary, Back is secondary | Assumed |
