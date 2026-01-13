# Health Charts for Obsidian

Beautiful, Apple Health-inspired visualizations for your health data in Obsidian. Turn exported Apple Health data into stunning interactive charts with activity rings, sleep analysis, vital signs, and workout summaries.

![Health Charts Demo](https://via.placeholder.com/800x400/667eea/ffffff?text=Beautiful+Health+Charts)

## Features

### Activity Rings
- **Apple Watch-style activity rings** showing Move (calories), Exercise (minutes), and Stand (steps) progress
- Interactive goal tracking with customizable targets
- Prominent step counter in the center
- Smooth animations and gradient effects

### Sleep Analysis
- **Total sleep duration** prominently displayed
- Sleep stage breakdown (Deep, REM, Core)
- Visual sleep bar showing stage distribution
- Beautiful gradient colors for each stage

### Vitals Monitoring
- **Heart health metrics**: Resting Heart Rate & HRV
- **Respiratory Rate** tracking
- **Blood Oxygen (SpO₂)** percentage
- Health status indicators (normal range highlighting)

### Workout Summaries
- **Beautiful workout cards** with type-specific icons
- Duration, distance, and calorie tracking
- Multiple workout types supported (Running, Cycling, Yoga, HIIT, etc.)
- Color-coded by activity type

### Design Philosophy
Inspired by Apple Health and Apple Fitness apps:
- SF Pro font aesthetic (system fonts)
- Smooth gradients and glass morphism effects
- Card-based layouts with subtle shadows
- Vibrant, meaningful color palette
- Minimalist typography
- Responsive design for all screen sizes
- Dark and light mode optimized

## Installation

### Method 1: Manual Installation

1. Download the latest release from the [Releases page](https://github.com/yourusername/obsidian-health-charts/releases)
2. Extract the files to your Obsidian vault's plugins folder:
   ```
   YourVault/.obsidian/plugins/health-charts/
   ```
3. Reload Obsidian
4. Enable the plugin in Settings → Community Plugins

### Method 2: Build from Source

```bash
# Clone the repository
cd /path/to/obsidian-health-charts-plugin

# Install dependencies
npm install

# Build the plugin
npm run build

# Copy to your vault
cp main.js manifest.json styles.css /path/to/your/vault/.obsidian/plugins/health-charts/
```

## Usage

### Automatic Detection

The plugin automatically detects health data files with the following frontmatter:

```markdown
---
date: 2026-01-13
type: health-data
---

# Health Data — 2026-01-13

## Sleep
...
```

When you open a health data file, charts are rendered automatically!

### Manual Chart Insertion

You can also manually insert specific charts using code blocks:

#### Full Dashboard

````markdown
```health-chart
{
  "file": "Health/2026-01-13.md"
}
```
````

#### Activity Rings Only

````markdown
```health-chart
{
  "type": "activity-rings",
  "file": "Health/2026-01-13.md",
  "options": {
    "stepGoal": 12000,
    "calorieGoal": 600,
    "exerciseGoal": 45
  }
}
```
````

#### Sleep Chart Only

````markdown
```health-chart
{
  "type": "sleep",
  "file": "Health/2026-01-13.md"
}
```
````

#### Vitals Chart Only

````markdown
```health-chart
{
  "type": "vitals",
  "file": "Health/2026-01-13.md"
}
```
````

#### Workouts Only

````markdown
```health-chart
{
  "type": "workouts",
  "file": "Health/2026-01-13.md"
}
```
````

### Chart Types

- `overview` - Complete dashboard (default)
- `activity-rings` - Activity rings with goals
- `sleep` - Sleep analysis
- `vitals` - Vital signs monitoring
- `workouts` - Workout summaries

### Configuration Options

```json
{
  "file": "path/to/health-data.md",
  "type": "activity-rings",
  "options": {
    "stepGoal": 10000,
    "calorieGoal": 500,
    "exerciseGoal": 30,
    "theme": "auto"
  }
}
```

## Supported Data Formats

This plugin works with data exported from the [Health to Obsidian App](https://github.com/yourusername/health-exporter):

### Markdown Format
```markdown
---
date: 2026-01-13
type: health-data
---

# Health Data — 2026-01-13

## Sleep
- **Total:** 8h 30m
- **Deep:** 2h 15m
- **REM:** 1h 45m
- **Core:** 4h 30m

## Activity
- **Steps:** 10,245
- **Active Calories:** 520 kcal
- **Exercise:** 45 min
...
```

### JSON Format
The plugin can also parse JSON exports:

```json
{
  "date": "2026-01-13",
  "type": "health-data",
  "sleep": {
    "totalDuration": 30600,
    "deepSleep": 8100,
    ...
  },
  ...
}
```

## Customization

### Custom Goals

Set your own activity goals in the chart options:

```json
{
  "type": "activity-rings",
  "options": {
    "stepGoal": 15000,      // Default: 10000
    "calorieGoal": 750,     // Default: 500
    "exerciseGoal": 60      // Default: 30
  }
}
```

### Custom Styling

The plugin uses CSS variables that respect your Obsidian theme. You can customize further with CSS snippets:

```css
/* Custom accent color for activity rings */
.activity-rings-container {
  --move-color: #FF006E;
  --exercise-color: #00F5D4;
  --stand-color: #3A86FF;
}

/* Adjust card styling */
.health-card {
  border-radius: 24px;
  background: var(--my-custom-background);
}
```

## Development

### Project Structure

```
obsidian-health-charts-plugin/
├── main.ts                 # Plugin entry point
├── src/
│   ├── types.ts           # TypeScript interfaces
│   ├── parser.ts          # Data parsing logic
│   ├── renderer.ts        # Main rendering orchestrator
│   ├── components/
│   │   └── stats-card.ts  # Reusable card component
│   └── charts/
│       ├── activity-rings.ts   # Activity rings chart
│       ├── sleep-chart.ts      # Sleep analysis chart
│       ├── vitals-chart.ts     # Vitals monitoring chart
│       └── workouts-chart.ts   # Workout summary chart
├── styles.css             # Apple-inspired styling
├── manifest.json          # Plugin manifest
└── package.json           # Dependencies
```

### Build Commands

```bash
npm run dev      # Development mode with file watching
npm run build    # Production build
```

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Compatibility

- **Obsidian Version**: 0.15.0+
- **Platforms**: Desktop and Mobile
- **Themes**: Works with all Obsidian themes (light and dark mode)

## Credits

- Inspired by Apple Health and Apple Fitness apps
- Built for the [Health to Obsidian App](https://github.com/yourusername/health-exporter)
- Icon designs inspired by SF Symbols

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- Report issues on [GitHub Issues](https://github.com/yourusername/obsidian-health-charts/issues)
- Discussions on [GitHub Discussions](https://github.com/yourusername/obsidian-health-charts/discussions)

## Roadmap

- [ ] Trend analysis across multiple days
- [ ] Weekly/monthly summary views
- [ ] Interactive data editing
- [ ] Export charts as images
- [ ] Comparison with previous periods
- [ ] Goal setting interface
- [ ] Integration with other health data sources

---

Made with ❤️ for the Obsidian community
