# Design System: Responsive Sports Analytics Layout & Data Grid Specification

This design system establishes the framework for scaling mobile analytics into fully responsive web screens, introducing rigorous component tokens for high-density datagrids and statistical tables.

---

## 1. Responsive Layout Strategy

To adapt the compact, vertical mobile layout into standard desktop formats, the system transitions from a single-column sequence to an asymmetrical, fluid multi-column grid layout.

### Breakpoint Matrix
* **Small (xs/sm)**
    * **Range:** 0px – 767px
    * **Content Configuration:** Single-column stack (Mobile-native view)
    * **Max Container Width:** Fluid (100%)
    * **Outer Gutter:** 16px
* **Medium (md)**
    * **Range:** 768px – 1023px
    * **Content Configuration:** 2-Column Grid (Left: Court/Charts, Right: Statistics)
    * **Max Container Width:** 720px
    * **Outer Gutter:** 24px
* **Large (lg)**
    * **Range:** 1024px – 1439px
    * **Content Configuration:** 3-Column Dashboard Layout (Left: Summary, Center: Performance Grid, Right: Visualizations)
    * **Max Container Width:** 960px
    * **Outer Gutter:** 32px
* **Extra Large (xl)**
    * **Range:** 1440px+
    * **Content Configuration:** Full Panoramic Analytics view with pinning
    * **Max Container Width:** 1320px
    * **Outer Gutter:** 40px

---

## 2. Global Design Tokens (Responsive Extensions)

### Visual Tokens
* **Background Colors**
    * Main App Background (`color-bg-main`): #0A0A0A
    * Surface / Container (`color-bg-surface`): #141414
    * Elevated Surface (`color-bg-surface-elevated`): #1C1C1E
* **Text Colors**
    * Primary (`color-text-primary`): #FFFFFF
    * Secondary (`color-text-secondary`): #8E8E93
    * Muted (`color-text-muted`): #48484A
* **Semantic Colors**
    * Positive Trend / Action (`color-semantic-positive`): #30D158
    * Negative Trend / Action (`color-semantic-negative`): #FF453A
    * Accent / Highlight (`color-semantic-accent`): #FFD60A
* **Border Radii**
    * Small (`radius-sm`): 4px
    * Medium (`radius-md`): 8px
    * Large (`radius-lg`): 16px

### Layout Typography
* **Font Family:** "Sansation", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
    * Source: Google Fonts (`family=Sansation`)
    * Weights used: 300 (Light), 400 (Regular), 700 (Bold) — all with italic variants
    * Load strategy: `display=swap` for progressive rendering; preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`
* **Hero Stat Size:** Mobile: 36px | Desktop: 48px | Weight: 700
* **H2 Header Size:** Mobile: 16px | Desktop: 20px | Weight: 700
* **Body Text Size:** Mobile: 13px | Desktop: 14px | Weight: 400
* **Table Header Size:** Global: 11px | Weight: 600 | Case: Uppercase
* **Table Cell Size:** Global: 13px | Weight: 400 | Variant: Tabular Numbers (`tabular-nums`)

---

## 3. Data Grid & Statistical Table Components

High-density analytics require datagrids with tabular alignments, consistent vertical spacing, and explicit visual hierarchies.

### Component Structure Overview
The grid layout reserves the top zone for control parameters, anchoring standard row heights directly below to maintain uniform processing lines for text, status indicators, and metrics.

### Data Grid Tokens
* **Header Height (`grid-header-height`):** 36px
* **Row Height (`grid-row-height`):** 44px
* **Horizontal Cell Padding (`grid-cell-padding-x`):** 16px
* **Vertical Cell Padding (`grid-cell-padding-y`):** 12px
* **Row Border Width (`grid-border-width`):** 1px
* **Row Border Color (`grid-border-color`):** #1C1C1E (`color-bg-surface-elevated`)
* **Header Background (`grid-header-bg`):** Transparent (Enforces minimal structural framework)
* **Row Hover Background (`grid-row-hover-bg`):** rgba(28, 28, 30, 0.4)

### Column Alignment Rules
* **Text & Label Fields:** Left-aligned (`text-align: left`) to accommodate dynamic name variations and category labels cleanly.
* **Numeric Data & Quantities:** Right-aligned (`text-align: right`) using fixed character tracking to maintain precise alignment across multiple rows of numeric inputs.
* **Status Badges / Action Assets:** Centered (`text-align: center`) within designated block widths.

### Tabular Formatting Guidelines
1.  **Font Feature Properties:** Force proportional character spacing on numeric cells via CSS to eliminate sizing distortion caused by varying string layouts:
    * `font-variant-numeric: tabular-nums;`
    * `font-feature-settings: "tnum";`
2.  **Text Truncation:** Apply clear termination logic when compressed viewport states force label compression:
    * `overflow: hidden;`
    * `text-overflow: ellipsis;`
    * `white-space: nowrap;`
3.  **Sticky Column Footprints:** Desktop viewports must fix column parameters to the viewport crown during prolonged vertical scrolling:
    * `position: sticky;`
    * `top: 0;`
    * `background-color: var(--color-bg-main);`
    * `z-index: 2;`