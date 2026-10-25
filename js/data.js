/*
 * Curriculum data for The Society Lecture Portal.
 *
 * To add / edit a lesson, just change this file:
 *   - id:    unique, never change it once students have progress (progress is keyed by id)
 *   - title: name shown in the sidebar and on the lesson page
 *   - url:   YouTube (youtu.be / youtube.com / playlist) or Loom (loom.com/share/...) link
 *   - desc:  optional short description shown under the title
 *   - setup: optional, renders the "indicator setup" page instead of a single video
 *
 * Module flags:
 *   - num:   number shown in the sidebar badge (null = un-numbered intro module)
 *   - gold:  true highlights the module in gold (TTP model)
 *   - badge: small pill next to the title (e.g. "PLAYLIST")
 *   - group: "intro" | "core" | "extra"  (a divider is drawn between groups)
 */
window.SITE = {
  brandTop: "THE SOCIETY",
  brandBottom: "Lecture Portal",
  mainSiteUrl: "#", // <- put your main website URL here
  title: "The Society Curriculum",
  subtitle: "Watch each lecture in order to understand my model completely. Enjoy.",
};

window.CURRICULUM = [
  {
    id: "new-to-trading", num: null, group: "intro", icon: "📘", title: "New-to-Trading",
    lessons: [
      { id: "tradingview", title: "TradingView", url: "https://youtu.be/8ejiEBCBtSQ" },
      { id: "what-is-a-candlestick", title: "What is a Candlestick", url: "https://youtu.be/qdGvZRxr2BQ" },
    ],
  },
  {
    id: "trading-rules", num: null, group: "intro", icon: "📏", title: "Trading-Rules",
    lessons: [
      { id: "trading-rules", title: "Trading Rules", url: "https://youtu.be/flMv6BPZuf8" },
    ],
  },

  {
    id: "macros", num: 1, group: "core", icon: "📊", title: "Macros",
    lessons: [
      { id: "macro-lecture", title: "MACRO LECTURE (IMPORTANT WATCH)", url: "https://youtu.be/7QZNpX8vynU" },
      {
        id: "macro-indicators",
        title: "Macro indicator and Asia/London open times indicator",
        desc: "Setup lesson: follow the steps below to add both indicators on TradingView.",
        url: "https://www.loom.com/share/f33638f280204581a246222004000e49",
        thumb: "indicators",
        setup: [
          {
            label: "Indicator 1",
            name: "Macro indicator",
            blurb: "Install it in 3 quick steps. Takes about 2 minutes.",
            video: "https://www.loom.com/share/f33638f280204581a246222004000e49",
            code: "macros",
            file: "evans-macros.pine",
          },
          {
            label: "Indicator 2",
            name: "Asia/London open times indicator",
            blurb: "Evan's Killzones & Sessions: opening times plus Asia and London session highs/lows. Install it in 3 quick steps.",
            video: "https://www.loom.com/share/d8773a4a10a748cda1424d799c3588ba",
            code: "killzones",
            file: "evans-killzones-sessions.pine",
          },
        ],
      },
    ],
  },
  {
    id: "dol", num: 2, group: "core", icon: "🎯", title: "DOL (Draw On Liquidity)",
    lessons: [
      { id: "draw-on-liquidity", title: "Draw On Liquidity", url: "https://youtu.be/WQmC9U57HPI" },
      { id: "highs-and-lows", title: "Highs & Lows", url: "https://youtu.be/Fkgoc1tCcOE" },
      { id: "highs-and-lows-old", title: "Highs & Lows (old lecture, still good)", url: "https://www.loom.com/share/7593f39b0d8a4afc936522056e266ccb" },
    ],
  },
  {
    id: "fvg", num: 3, group: "core", icon: "〰️", title: "FVG (Fair Value Gaps)",
    lessons: [
      { id: "fair-value-gaps", title: "Fair Value Gaps (FVGs)", url: "https://youtu.be/kgcjDCxRhWk" },
    ],
  },
  {
    id: "manipulation", num: 4, group: "core", icon: "🧲", title: "Manipulation",
    lessons: [
      { id: "turtle-soup-vs-sweeps", title: "Understanding the difference between turtle soup and liquidity sweeps", url: "https://youtu.be/-J6bMceNWxU" },
      { id: "smt", title: "SMT", url: "https://youtu.be/O6LRGwrLkG0" },
      { id: "forms-of-manipulation", title: "Forms of Manipulation (TS, SMT, Liquidity Sweep)", url: "https://www.loom.com/share/6bb58c80f26a4436adac5a928e3d2b2c" },
    ],
  },
  {
    id: "displacement", num: 5, group: "core", icon: "📈", title: "Displacement",
    lessons: [
      { id: "displacement", title: "Displacement", url: "https://youtu.be/tfsk7Za5KPo" },
    ],
  },
  {
    id: "ifvg", num: 6, group: "core", icon: "🔁", title: "BISI-SIBI-Disrespect (IFVG)",
    lessons: [
      { id: "bisi-sibi-disrespect", title: "BISI/SIBI Disrespect (IFVG)", url: "https://youtu.be/KTiONOMGoK8" },
    ],
  },
  {
    id: "internal-external", num: 7, group: "core", icon: "♾️", title: "Internal/External Highs & Lows",
    lessons: [
      { id: "internal-external", title: "Internal/External", url: "https://www.loom.com/share/9d2551bb6ae24a3ebc70d971eb768910" },
    ],
  },
  {
    id: "rebalance", num: 8, group: "core", icon: "⚖️", title: "Rebalance",
    lessons: [
      { id: "rebalance", title: "Rebalance", url: "https://www.loom.com/share/be7651439e8e4548afa84c1c593cc370" },
    ],
  },
  {
    id: "orderblock", num: 9, group: "core", icon: "🧱", title: "Orderblock",
    lessons: [
      { id: "orderblock", title: "Orderblock", url: "https://youtu.be/StQ6Jlbcejk" },
    ],
  },
  {
    id: "rejection-blocks", num: 10, group: "core", icon: "🔴", title: "Rejection Blocks",
    lessons: [
      { id: "rejection-blocks", title: "Rejection Blocks", url: "https://youtu.be/rrShbJ-_zFU" },
    ],
  },
  {
    id: "invalidation-levels", num: 11, group: "core", icon: "⛔", title: "Invalidation Levels",
    lessons: [
      { id: "invalidation-levels", title: "Invalidation Levels", url: "https://www.loom.com/share/f8ab5bd5d4084b70a39505b1dd8f89eb" },
    ],
  },
  {
    id: "stdv", num: 12, group: "core", icon: "📐", title: "STDV in PDarrays",
    lessons: [
      { id: "stdv-in-pdarrays", title: "STDV In PDarrays", url: "https://youtu.be/3SJhhtb2jGk" },
      { id: "rb-stdv", title: "RB STDV", url: "https://www.loom.com/share/078a36580363459fb30f9a616d2e3e29" },
    ],
  },
  {
    id: "reversals", num: 13, group: "core", icon: "🔻", title: "Reversals",
    lessons: [
      { id: "reversals", title: "Reversals", url: "https://youtu.be/RqcEXJ15lrA" },
    ],
  },
  {
    id: "continuations", num: 14, group: "core", icon: "🔺", title: "Continuations (PXH/PXL)",
    lessons: [
      { id: "continuations", title: "Continuations (PXH/PXL)", url: "https://youtu.be/q809Gve-tMQ" },
      { id: "pxh-pxl-simplified", title: "PXH/PXL Simplified", url: "https://youtu.be/lREm_HFKk34" },
    ],
  },
  {
    id: "protected-sl-tp", num: 15, group: "core", icon: "🛡️", title: "Protected SL/TP",
    lessons: [
      { id: "protected-sl-tp", title: "Protected SL/TP", url: "https://www.loom.com/share/cabb2d8e0eaa43c99aff205fed1efbf3" },
      { id: "breakeven-lecture", title: "Breakeven Lecture", url: "https://youtu.be/z6fhSoxdm-o" },
    ],
  },
  {
    id: "bias", num: 16, group: "core", icon: "🧭", title: "Bias/Narrative",
    lessons: [
      { id: "identify-narrative", title: "Identify Narrative (sauce)", url: "https://www.loom.com/share/dca96a8cf9554c5e97467811c3c97828" },
      { id: "bias-narrative-old", title: "Bias/Narrative (old lecture, still a good watch)", url: "https://www.loom.com/share/9612c334ad5446df877ac1993c276be1" },
    ],
  },
  {
    id: "fib", num: 17, group: "core", icon: "🔥", title: "Fib Prem/Discount",
    lessons: [
      { id: "fib-prem-discount", title: "Fib Prem/Discount", url: "https://www.loom.com/share/cc1ae88fa17349fcb44d63077667a7c1" },
    ],
  },
  {
    id: "mmxm", num: 18, group: "core", icon: "🌀", title: "MMXM",
    lessons: [
      { id: "mmxm", title: "MMXM", url: "https://www.loom.com/share/35ca98ae2548483b828c1dec5bc0a8eb" },
    ],
  },
  {
    id: "opening-times", num: 19, group: "core", icon: "🔔", title: "Opening Times",
    lessons: [
      { id: "opening-times", title: "Opening Times", url: "https://www.loom.com/share/6e5ec20af2214b68a6051888626aab43" },
    ],
  },
  {
    id: "short-long", num: 20, group: "core", icon: "⚔️", title: "Short/Long Entries",
    lessons: [
      { id: "where-short-long", title: "Where to go SHORT and where to go LONG", url: "https://www.loom.com/share/2f87eab6c6704d529cf5e7f25d182281" },
    ],
  },
  {
    id: "how-to-react", num: 21, group: "core", icon: "🧠", title: "How to React",
    lessons: [
      { id: "how-to-react", title: "How to React", url: "https://www.loom.com/share/ab9da01dadf84aa6ab0ce517d3878773" },
    ],
  },
  {
    id: "conditions", num: 22, group: "core", icon: "✅", title: "Conditions",
    lessons: [
      { id: "good-bad-conditions", title: "Identify Good & Bad Conditions Within The Macro", url: "https://youtu.be/JFt_eMbf3lw" },
    ],
  },
  {
    id: "ttp-model", num: 23, group: "core", icon: "💎", title: "TTP Model (Time Then Price)", gold: true,
    lessons: [
      { id: "ttp-final-lecture", title: "THE TTP MODEL FINAL LECTURE", url: "https://www.loom.com/share/dce2a8e1f5144910b1fb62060ef0515a", desc: "The complete Time Then Price model. Everything in the curriculum leads here." },
    ],
  },

  {
    id: "backtesting", num: 24, group: "extra", icon: "🗂️", title: "Backtesting",
    lessons: [
      { id: "backtesting-1", title: "Backtesting 1", url: "https://www.loom.com/share/f053f76192e2498886fb241ffaf9a31b" },
      { id: "backtesting-2", title: "Backtesting 2", url: "https://www.loom.com/share/15dd15c7c1aa4fe683474f630fa59f81" },
      { id: "backtesting-3", title: "Backtesting 3", url: "https://www.loom.com/share/ba1781807d7342c3a2c5bb5e77c8e192" },
      { id: "backtesting-4", title: "Backtesting 4", url: "https://www.loom.com/share/1031a256d54341c1904dbd7aa543cc70" },
      { id: "backtesting-5", title: "Backtesting 5", url: "https://www.loom.com/share/2660104add634c6aa4fba9ed4aad619f" },
      { id: "backtesting-6", title: "Backtesting 6", url: "https://www.loom.com/share/629541d338924ccc83789a99a9960faa" },
      { id: "backtesting-reversals", title: "Backtesting lecture (focusing on reversals)", url: "https://youtu.be/dfU3WIeYaYc" },
      { id: "ttp-94-wr-backtest", title: "94% WR TTP model backtest", url: "https://youtu.be/--ZKgwXPxRw" },
    ],
  },
  {
    id: "psychology", num: 25, group: "extra", icon: "🧘", title: "Psychology", badge: "Playlist",
    lessons: [
      // NOTE: the playlist ID in the PDF looks cut off — paste the full link here if it doesn't load.
      { id: "psychology-playlist", title: "Psychology Playlist", url: "https://www.youtube.com/playlist?list=PLT7Sa1IAajnE" },
    ],
  },
];
