# Learnyfi Educational Ludo — replacement files

Copy these files into the matching locations in your Next.js project:

- `src/games/edu-ludo/EduLudoGame.tsx`
- `src/app/student/(student)/games/edu-ludo/page.tsx`

The game component is intentionally self-contained so it does not depend on older versions of `GameLobby.tsx`, `LudoBoard.tsx`, `QuestionModal.tsx`, or `WalletPanel.tsx`.

## Important implementation notes

- Solo mode is a local playable prototype. Question data is a small sample bank in `EduLudoGame.tsx`; connect the full approved question bank before production.
- Wallet deduction and CBT Points are local UI state only. Do not treat them as real transactions. Add server-side wallet checks, idempotent question-fee charges, persistent rewards and match state when the backend is connected.
- Friends, Classroom and Tournament are explicitly marked as coming soon.
- Bot strategy and question-answering are simulations.
- The board uses a 15×15 CSS grid and approximate track coordinates. Review/test the board geometry and rules thoroughly before production release.

## Dependencies

Assumes your project already has `next`, `react`, `lucide-react`, Tailwind CSS and the `@/` alias configured.
