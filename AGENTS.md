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
- Waitlist writes and stats go through server routes under src/routes/api/public (logic in src/lib/waitlist.server.ts) using the service role; tables have RLS with no public policies, so the browser never touches the database directly.
- All page copy lives in src/lib/dict.ts (en/es) so both languages stay in sync.
