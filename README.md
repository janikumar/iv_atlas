# IV Atlas

A focused Pokémon GO PvP search experience for comparing the best IV spreads across Little, Great, Ultra, and Master League evolutions.

## Run locally

The project uses Vite + React + TypeScript:

```bash
npm install
npm run dev
```

## Deploy to Vercel

This project includes [`vercel.json`](./vercel.json) for Vite. From the project folder, connect the repository to Vercel and deploy with:

```bash
npx vercel
npx vercel --prod
```

Alternatively, import the repository in the Vercel dashboard. Vercel will detect Vite, run `npm run build`, and publish the `dist` directory.

### GitHub → Vercel setup

1. Install Node.js LTS and Git, then open a terminal in this folder:

```bash
cd /home/kumar/Documents/VsCodeFiles/PROJECTS/pvp_iv_app
npm install
npm run build
```

2. Create a new empty repository on GitHub. Do not initialize it with another README or `.gitignore`.

3. Initialize and push this project:

```bash
git init
git branch -M main
git add .
git commit -m "Initial IV Atlas app"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your GitHub account and repository name. GitHub may ask you to sign in or use a personal access token.

4. Open Vercel, choose **Add New → Project**, connect GitHub, select the repository, and click **Deploy**. Use these settings if Vercel asks:

```text
Framework Preset: Vite
Root Directory: .
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

After the first deployment, every push to the connected production branch creates a new deployment automatically. Pull requests and other branches receive preview deployments.

## Data integration

The app now loads the live PvPoke repository data directly from GitHub in [`src/pvpokeData.ts`](./src/pvpokeData.ts):

- `src/data/gamemaster.json` for Pokémon names, base stats, dex numbers, and evolution links.
- `src/data/rankings/all/overall/rankings-500.json` for Little Cup.
- `src/data/rankings/all/overall/rankings-1500.json` for Great League.
- `src/data/rankings/all/overall/rankings-2500.json` for Ultra League.
- `src/data/rankings/all/overall/rankings-10000.json` for Master League.

The ranking files provide the PvPoke league context. The Game Master makes every species searchable, including Pokémon that are not in the current top 100. When a Pokémon is searched, the app evaluates all 4,096 IV combinations and legal half-levels for each of the four league caps, sorts them by stat product, and displays the top 100 IV spreads in one comparison table. A second table repeats the same 100-row comparison for every available member of the evolution family.

The comparison table has one row per IV rank and one column each for Little, Great, Ultra, and Master League. Each league cell shows the IV spread, CP, and level. Tables open with all 100 rows visible; the “Show top 10” control is only a compact view option.

## IV candidate ranking

The search page also includes an IV candidate selector. Add as many Attack / Defense / Stamina combinations as you want. The exact-ranking table above the top-100 tables then shows each candidate for the searched Pokémon and every evolution in the family, including its rank out of all 4,096 possible IV combinations, CP, level, and league.

Each IV selector uses a quick-access 1 × 16 horizontal button row for values 0–15 instead of a dropdown. On mobile, each row remains one line and scrolls horizontally when needed.

This keeps the data current with the upstream repository, but the browser needs network access to GitHub. PvPoke is an MIT-licensed open-source project; this app consumes its public data files and is not a replacement for its battle simulation engine.

### Does the database update automatically?

Yes. The deployed app fetches the current PvPoke Game Master and ranking JSON files in the browser each time it loads, so upstream ranking and Pokémon data changes are picked up without redeploying this app. A redeploy is only needed when the application code or calculation logic changes. The app does require the user’s browser to have access to GitHub’s raw content URLs.

## Feature parity with PvP IVs

The app now includes functional equivalents of the public tools on pvpivs.com:

- Single Pokémon IV rankings: top 100 spreads in Little, Great, Ultra, and Master League columns.
- A separate evolution-family section with the same top-100-per-league tables.
- Beta multi-form ranking view.
- League-wide top-100 rankings for Little, Great, Ultra, and Master.
- League view defaults to Top 100 Master League and supports Top 100, Top 250, Top 500, or all available rankings. It also filters by Pokémon type, with rank, type, IVs, CP, level, and tier visible.
- Search-string builder with copy-to-clipboard.
- IV calculator with level and IV sliders.
- Type weakness chart and a type quiz.
- Dark mode, settings panel, family-evolution toggle controls, and reset settings.
- About page and mobile-friendly navigation.

The visual theme uses a high-contrast black/white system with bright red accents. Light and dark modes explicitly set surface, text, muted text, border, table, input, and button colors so content remains readable in either mode.

The implementation is intentionally built on PvPoke’s public Game Master and ranking files rather than scraping pvpivs.com. PvP IVs’ public pages expose the same broad tool areas—rankings, search strings, calculator, typing chart, quiz, and advanced controls—but their private implementation/data should not be copied.
