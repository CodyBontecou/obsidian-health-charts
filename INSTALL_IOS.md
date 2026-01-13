# Installing Health Charts Plugin on iOS

This guide will help you install the Obsidian Health Charts plugin on your iPhone or iPad.

## Prerequisites

- Obsidian mobile app installed on your iOS device
- Your Obsidian vault synced to your iOS device (via iCloud, Obsidian Sync, or another method)
- Access to the plugin files (`main.js`, `manifest.json`, `styles.css`)

## Installation Methods

### Method 1: Using iCloud Drive (Recommended)

This is the easiest method if your vault is stored in iCloud Drive.

#### Step 1: Prepare Plugin Files on Your Computer

1. Build the plugin:
   ```bash
   cd obsidian-health-charts-plugin
   npm install
   npm run build
   ```

2. The build creates three files you need:
   - `main.js` (22KB)
   - `manifest.json` (344B)
   - `styles.css` (8.3KB)

#### Step 2: Copy Files to Your Vault

1. On your Mac/PC, navigate to your Obsidian vault in Finder/Explorer
2. Create the plugin folder structure:
   ```
   YourVault/
   └── .obsidian/
       └── plugins/
           └── health-charts/
               ├── main.js
               ├── manifest.json
               └── styles.css
   ```

3. Copy the three built files into the `health-charts` folder

4. Wait for iCloud to sync (you'll see the cloud icon in Finder)

#### Step 3: Enable on iOS

1. Open Obsidian on your iOS device
2. Wait for the vault to fully sync
3. Go to **Settings** (gear icon) → **Community plugins**
4. Scroll down to **Installed plugins**
5. Find **Health Charts** and toggle it **ON**
6. Close settings

The plugin is now active! Open any health data file to see your beautiful charts.

---

### Method 2: Using Obsidian Sync

If you use Obsidian's official sync service:

1. Follow **Step 1** from Method 1 to build the plugin
2. Copy the files to your vault's plugin folder on your computer
3. Open Obsidian desktop and ensure Obsidian Sync is enabled
4. The plugin files will automatically sync to your iOS device
5. On iOS: Settings → Community plugins → Enable "Health Charts"

---

### Method 3: Using Working Copy (Git on iOS)

For advanced users who manage their vault with Git:

1. Push the built plugin files to your vault's Git repository
2. On iOS, open **Working Copy** app
3. Pull the latest changes to your vault
4. Open Obsidian and enable the plugin in settings

---

### Method 4: Direct File Transfer

If you don't use cloud sync:

1. Build the plugin on your computer
2. Use **AirDrop** to send the three files to your iOS device
3. Save them to **Files** app
4. Navigate to your vault location in Files app
5. Create folders: `.obsidian/plugins/health-charts/`
6. Move the three files into that folder
7. Open Obsidian and enable the plugin

---

## Verifying Installation

To confirm the plugin is working:

1. Open an existing health data file (with `type: health-data` in frontmatter)
2. You should see beautiful charts render automatically:
   - Activity rings at the top
   - Sleep, Vitals, and Body metric cards
   - Workout summaries at the bottom

If you don't see charts:
- Check that the plugin is enabled in Settings → Community plugins
- Verify the three files are in the correct folder
- Try restarting the Obsidian app
- Check the developer console for errors (Settings → About → View debug info)

---

## Testing with Sample Data

Create a test file with this content to verify the plugin works:

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
- **Flights Climbed:** 12
- **Distance:** 8.5 km

## Vitals

- **Resting HR:** 62 bpm
- **HRV:** 45.3 ms
- **Respiratory Rate:** 14.2 breaths/min
- **SpO2:** 98%

## Body

- **Weight:** 75.2 kg
- **Body Fat:** 18.5%

## Workouts

### 1. Running

- **Time:** 06:45
- **Duration:** 45m
- **Distance:** 7.2 km
- **Calories:** 620 kcal
```

Save this as `test-health.md` in your vault and open it. You should see beautiful activity rings, sleep charts, vitals, and workout cards!

---

## Troubleshooting

### Plugin doesn't appear in Community Plugins list

- Ensure the folder name is exactly `health-charts` (lowercase, with hyphen)
- Check that all three files are present: `main.js`, `manifest.json`, `styles.css`
- Restart the Obsidian app
- Verify the `.obsidian/plugins/` folder exists

### Charts don't render

- Confirm your health data file has `type: health-data` in the frontmatter
- Check the file follows the correct markdown format (see test data above)
- Try creating a manual chart with a code block (see main README)
- Enable debug mode: Settings → About → View debug info

### Sync issues

- For iCloud: Check that both devices are signed into the same Apple ID
- For Obsidian Sync: Verify sync is enabled and connected
- Wait a few minutes for large vaults to fully sync
- Check available storage on your iOS device

### Performance on iOS

The plugin is optimized for mobile, but very large datasets may render slowly:
- Activity rings: SVG-based, renders quickly
- Multiple workout cards: May take 1-2 seconds with 10+ workouts
- If slow, consider using specific chart types instead of full overview

---

## Updating the Plugin

To update the plugin on iOS:

1. Build the latest version on your computer
2. Replace the three files in your vault's plugin folder
3. Wait for sync to complete
4. On iOS: Go to Settings → Community plugins → Reload plugins
5. Or simply restart the Obsidian app

---

## Uninstalling

To remove the plugin from iOS:

1. In Obsidian: Settings → Community plugins → Disable "Health Charts"
2. Optional: Delete the entire `health-charts` folder from `.obsidian/plugins/`

---

## Notes

- **File sizes**: The plugin is lightweight (~31KB total)
- **Performance**: Optimized for mobile with smooth animations
- **Battery**: Minimal impact - charts render on demand
- **Offline**: Works completely offline once installed
- **Dark mode**: Automatically adapts to your theme

---

## Need Help?

- Check the main [README.md](README.md) for usage examples
- Report issues on [GitHub Issues](https://github.com/CodyBontecou/obsidian-health-charts/issues)
- Join discussions on [GitHub Discussions](https://github.com/CodyBontecou/obsidian-health-charts/discussions)

---

Enjoy your beautiful health charts on iOS! 📱✨
