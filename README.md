# uOttawa Engineering Outcomes Dashboard

A bilingual (English/French) interactive dashboard built for SEG3125 Assignment 5. It presents University of Ottawa Faculty of Engineering data: undergraduate degrees conferred by program (2020–2024) and year-2 retention rates by demographic group.

**Live site:** https://dashboardsite-dusky.vercel.app

## Features

- **Line chart** of degrees conferred per program, with toggles to show or hide individual programs
- **Bar chart** of year-2 retention rates, with a cohort selector and an optional side-by-side cohort comparison
- **English/French toggle** that translates the full interface, including chart axes, legends, and tooltips, with locale-aware number and percentage formatting (`90%` vs `90 %`)
- Accessible by design: keyboard-operable controls, an equivalent data table under each chart, and reduced-motion support

## Tech stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [Recharts](https://recharts.org/) for the charts
- [Tailwind CSS 4](https://tailwindcss.com/) for styling

## Running locally

```bash
npm install
npm run dev
```

`npm run build` outputs a production build to `dist/`.

## Data

Chart data lives in `src/data/engineeringMetrics.json` and is based on uOttawa institutional fact books (see `public/uottawa enrollment details/` for the source documents). Figures are illustrative.
