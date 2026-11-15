# IV Atlas

IV Atlas helps Pokémon GO players find and compare PvP IV combinations across Little, Great, Ultra, and Master League.

## Using the website

### 1. Search for a Pokémon

Open the Rankings page and search for any Pokémon by name. Pokémon from the PvPoke Game Master database are searchable, including Pokémon that are not currently in PvPoke’s top rankings.

The search also detects the Pokémon’s evolution family.

### 2. Add your IV candidates

Use the three horizontal IV selectors:

- Attack
- Defense
- Stamina

Each selector contains buttons from 0 to 15. Select the IV values for one Pokémon and choose **Add IV spread**. Add multiple candidates to compare them together.

### 3. Read the exact ranking table

The first table shows the IV candidates you added. It includes the searched Pokémon and every available evolution in its family.

For each candidate, the table displays:

- Exact IV rank out of all 4,096 combinations
- Little League rank, CP, and level
- Great League rank, CP, and level
- Ultra League rank, CP, and level
- Master League rank, CP, and level

This is the table to use when checking a Pokémon you already own.

### 4. Inspect the top 100 IV spreads

Below the candidate table, IV Atlas displays the top 100 stat-product spreads for the searched Pokémon. Each row represents one IV rank, with all four leagues shown side by side.

The evolution-family section below it provides the same top-100 table for each evolution.

Use **Show top 10** when you only want the strongest ten spreads. Use **Show all 100** to restore the complete table.

### 5. Use the League page

The League page starts with the Top 100 Master League rankings. You can change the league to Little, Great, Ultra, or Master League.

Available display limits:

- Top 100
- Top 250
- Top 500
- All rankings

You can also filter by Pokémon type. Each result shows its rank, type, best IVs, CP, level, and tier.

### 6. Use the other tools

- **Calculator:** Select a Pokémon, level, and IV values to estimate CP and HP.
- **Search strings:** Generate a Pokémon GO search string for an evolution family and copy it to the clipboard.
- **Typing:** Review type weaknesses or open the type quiz.
- **Settings:** Switch between light and dark themes and reset view settings.

## Data and updates

The website loads Pokémon, evolution, base-stat, and ranking data from PvPoke’s public data files. Data is fetched when the site loads, so upstream PvPoke updates are reflected automatically without changing this website’s code.

The browser must have network access to GitHub’s raw content URLs. IV calculations are performed in the browser using all 4,096 IV combinations and the league CP limits.

The calculation engine follows PvPoke’s current rules: exact Game Master CPM values for every half level through level 51, `floor()` CP using the standard Pokémon GO formula, effective attack and defense kept as decimals, and floored HP. Stat product is the raw `attack × defense × HP` value. Equal stat products are ordered by higher CP, then deterministic IV order. This is why values such as Palkia Origin Ultra League `0 / 15 / 10` resolve to CP 2499, level 22.5, and stat product 3,443,589.

## For developers

Install and run locally:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

The project includes [`vercel.json`](./vercel.json) for Vercel deployment. Vercel uses `npm run build` and publishes the `dist` directory.

## Attribution

IV Atlas uses public data from the open-source PvPoke project. Pokémon and Pokémon GO names and artwork belong to their respective owners.
