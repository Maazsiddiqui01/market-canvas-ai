## Plan: Full Error Check & Verification

1. Run TypeScript check across the project (`tsc --noEmit`) to surface any type errors.
2. Run the linter (`eslint`) to catch code-quality issues.
3. Scan dependencies for high/critical vulnerabilities.
4. Check Supabase linter for DB/RLS issues.
5. Review recent runtime errors and console logs from the preview.
6. Report findings grouped by severity. If any blocking errors exist, fix them in-place (TS/lint fixes only — no feature changes). If everything passes, confirm clean build.

No feature or UI changes will be made unless an error requires it.