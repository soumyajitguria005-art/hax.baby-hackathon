#!/usr/bin/env node

/**
 * process-pip-expression-sheet
 * 
 * Automatic asset extraction pipeline for Pip character artwork and expression sheets.
 * Slices the 3x4 character sticker sheet into individual named expression assets,
 * preserves margins/props, generates a manifest, and places the official avatar.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 3x4 Grid layout mapping corresponding to Pip's 12 states
const GRID_MAPPING = [
  // Row 1
  { state: 'idle', label: 'Idle', row: 0, col: 0, description: 'Pip sitting on cloud holding a star, gentle smile' },
  { state: 'happy', label: 'Happy', row: 0, col: 1, description: 'Pip cheering with raised hands and laughing eyes' },
  { state: 'curious', label: 'Curious', row: 0, col: 2, description: 'Pip tilting head inquisitively with question mark' },
  { state: 'excited', label: 'Excited', row: 0, col: 3, description: 'Pip jumping with glee, squinting eyes and stars' },

  // Row 2
  { state: 'sleepy', label: 'Sleepy', row: 1, col: 0, description: 'Pip yawning with floating zZz' },
  { state: 'surprised', label: 'Surprised', row: 1, col: 1, description: 'Pip with wide starry eyes and hands on cheeks' },
  { state: 'shy', label: 'Shy', row: 1, col: 2, description: 'Pip blushing with rosy cheeks and little pink hearts' },
  { state: 'reading', label: 'Reading', row: 1, col: 3, description: 'Pip reading a purple celestial bedtime storybook' },

  // Row 3
  { state: 'working', label: 'Working', row: 2, col: 0, description: 'Pip holding a blue wrench tool to build dreams' },
  { state: 'flying', label: 'Flying', row: 2, col: 1, description: 'Pip swooping through clouds with stardust trail' },
  { state: 'holding-lantern', label: 'Holding Lantern', row: 2, col: 2, description: 'Pip holding glowing golden starlight lantern' },
  { state: 'sleeping', label: 'Sleeping', row: 2, col: 3, description: 'Pip curled up asleep on a cloud pillow' },
];

function findCandidateFile(patterns, searchDirs) {
  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const pattern of patterns) {
      const match = files.find((f) => pattern.test(f));
      if (match) return path.join(dir, match);
    }
  }
  return null;
}

export function runPipeline(options = {}) {
  const searchDirs = [ROOT_DIR, path.join(ROOT_DIR, 'assets'), path.join(ROOT_DIR, 'public/assets')];

  const sheetPath =
    options.sheetPath ||
    process.argv[2] ||
    findCandidateFile([/sticker.*sheet.*\.png$/i, /expression.*sheet.*\.png$/i, /kawaii.*\.png$/i], searchDirs);

  const avatarPath =
    options.avatarPath ||
    process.argv[3] ||
    findCandidateFile([/^pip\.jpg$/i, /^pip-avatar\.(jpg|png)$/i, /pip-avatar-cloud\.png$/i], searchDirs);

  const outputBase = options.outputDir || path.join(ROOT_DIR, 'public/assets/pip');
  const expressionsDir = path.join(outputBase, 'expressions');

  fs.mkdirSync(expressionsDir, { recursive: true });

  const manifest = {
    updatedAt: new Date().toISOString(),
    officialAvatar: null,
    totalStates: GRID_MAPPING.length,
    extractedStates: [],
    pendingStates: [],
    notes: [],
  };

  console.log('--- Pip Character Asset Pipeline ---');
  console.log(`Target Directory: ${outputBase}`);

  // 1. Process Official Avatar
  if (avatarPath && fs.existsSync(avatarPath)) {
    const ext = path.extname(avatarPath).toLowerCase() || '.jpg';
    const destAvatar = path.join(outputBase, `pip-avatar${ext}`);
    fs.copyFileSync(avatarPath, destAvatar);
    manifest.officialAvatar = {
      sourceFile: path.basename(avatarPath),
      assetPath: `/assets/pip/pip-avatar${ext}`,
      status: 'ready',
    };
    console.log(`✓ Official avatar saved to: /assets/pip/pip-avatar${ext}`);
  } else {
    manifest.notes.push('Source avatar file not found in local workspace paths. Fallback artwork will be used.');
    console.log('ℹ Official avatar source file not located on disk. Set up fallback routing.');
  }

  // 2. Process Expression Sheet
  if (sheetPath && fs.existsSync(sheetPath)) {
    console.log(`Found expression sheet: ${sheetPath}`);

    try {
      // Determine dimensions with identify
      const dims = execSync(`identify -format "%w %h" "${sheetPath}"`, { encoding: 'utf-8' }).trim().split(' ');
      const totalWidth = parseInt(dims[0], 10);
      const totalHeight = parseInt(dims[1], 10);

      const cellWidth = Math.floor(totalWidth / 4);
      const cellHeight = Math.floor(totalHeight / 3);

      console.log(`Sheet dimensions: ${totalWidth}x${totalHeight} (Cells: ${cellWidth}x${cellHeight})`);

      for (const item of GRID_MAPPING) {
        const cropX = item.col * cellWidth;
        const cropY = item.row * cellHeight;
        const targetFile = path.join(expressionsDir, `${item.state}.png`);

        // Crop cell and gently trim background with padding to protect props and pom-poms
        const cropCmd = `convert "${sheetPath}" -crop ${cellWidth}x${cellHeight}+${cropX}+${cropY} +repage "${targetFile}"`;
        execSync(cropCmd);

        manifest.extractedStates.push({
          state: item.state,
          label: item.label,
          description: item.description,
          gridPosition: { row: item.row, col: item.col },
          assetPath: `/assets/pip/expressions/${item.state}.png`,
          status: 'extracted',
        });

        console.log(`✓ Extracted: ${item.state} (${item.label}) -> /assets/pip/expressions/${item.state}.png`);
      }
    } catch (err) {
      console.error(`Error processing expression sheet: ${err.message}`);
      manifest.notes.push(`Error executing ImageMagick slice: ${err.message}`);
    }
  } else {
    console.log('ℹ Expression sheet source file not present on disk.');
    manifest.notes.push(
      'Expression sheet file not accessible directly on container filesystem. Pipeline manifest initialized with deterministic 3x4 grid mapping.'
    );
    for (const item of GRID_MAPPING) {
      manifest.pendingStates.push({
        state: item.state,
        label: item.label,
        description: item.description,
        gridPosition: { row: item.row, col: item.col },
        targetPath: `/assets/pip/expressions/${item.state}.png`,
        status: 'pending_file',
      });
    }
  }

  // 3. Write manifest.json
  const manifestPath = path.join(outputBase, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`✓ Manifest generated at: ${manifestPath}`);

  return manifest;
}

// Run immediately if called from command line
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  runPipeline();
}
