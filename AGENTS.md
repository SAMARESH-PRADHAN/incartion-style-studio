<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Frontend-only demo: all persistence via zustand `persist` stores in `src/store` (skipHydration, rehydrated once in __root) so SSR markup matches first client render.
- Pricing/coupon/GST logic lives only in `src/lib/pricing.ts` (tested in `src/test/pricing.test.ts`); UI must not re-implement it.
- Product/category/coupon catalog is static mock data in `src/data`; categories.ts is the source of truth for sub-categories.
- tsconfig drops the extra-strict flags (exactOptionalPropertyTypes, noUncheckedIndexedAccess, etc.) to keep mock-data code readable.
