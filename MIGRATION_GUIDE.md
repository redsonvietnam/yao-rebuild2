# Migration Guide - UI Layout Update

## What Changed?

We've reorganized the interface to make it cleaner and easier to use. Here's what you need to know:

---

## Quick Summary

### ✨ What's New
- **New Toolbar**: Editor controls now have their own dedicated toolbar below the header
- **Header Buttons**: OCR and Dictionary are now always visible in the header (no more hunting for floating buttons!)
- **Cleaner Editor**: No more floating buttons cluttering your workspace

### 🔄 What Moved
- **OCR**: From floating button (bottom-right) → Header button (top-right)
- **Dictionary**: From floating button (right sidebar) → Header button (top-right)
- **Mode Controls**: From header → New toolbar (Ngang/Dọc, Grid, IME)
- **Document Actions**: From header → New toolbar (Mẫu, Bố Cục, Xuất)

---

## Visual Guide

### Before
```
┌─────────────────────────────────────────────────────┐
│ [Logo] [Mode] [Grid] [IME] [Theme] [Mẫu] [Bố cục] [Xuất] │
└─────────────────────────────────────────────────────┘
│                                                     │
│                  Editor                             │
│                                        [Dict] ←─────┤
│                                        [OCR]  ←─────┤
```

### After
```
┌─────────────────────────────────────────────────────┐
│ [Logo] YAO EDITOR V2        [OCR] [Dictionary] [Theme] │
├─────────────────────────────────────────────────────┤
│ [Ngang/Dọc] [Grid] | [IME]     [Mẫu] [Bố cục] [Xuất] │
└─────────────────────────────────────────────────────┘
│                                                     │
│                  Editor                             │
│                  (Clean!)                           │
│                                                     │
```

---

## How to Use New Features

### Opening OCR (Image Text Recognition)

**Old Way**:
1. Look for floating button in bottom-right corner
2. Click it

**New Way** (Choose one):
- Click **"OCR"** button in header (top-right)
- Press **Ctrl+Shift+O** (new keyboard shortcut!)

### Opening Dictionary

**Old Way**:
1. Look for floating button on right edge
2. Click it
3. OR press Ctrl+D

**New Way** (Choose one):
- Click **"TỪ ĐIỂN"** button in header (top-right)
- Press **Ctrl+D** (same as before)

### Changing Writing Mode (Ngang/Dọc)

**Old Way**:
- Click buttons in header

**New Way**:
- Click buttons in **toolbar** (second row, left side)

### Using Grid Toggle

**Old Way**:
- Click button in header

**New Way**:
- Click button in **toolbar** (second row, left side)

### Switching IME Mode (Hán-Dao)

**Old Way**:
- Click button in header

**New Way**:
- Click button in **toolbar** (second row, left side)

### Selecting Template (Mẫu)

**Old Way**:
- Click button in header

**New Way**:
- Click button in **toolbar** (second row, right side)

### Changing Layout (Bố Cục)

**Old Way**:
- Click button in header
- OR press Ctrl+Shift+L

**New Way**:
- Click button in **toolbar** (second row, right side)
- OR press **Ctrl+Shift+L** (same as before)

### Exporting Document (Xuất)

**Old Way**:
- Click button in header

**New Way**:
- Click button in **toolbar** (second row, right side)

---

## Keyboard Shortcuts

### New Shortcuts
| Action | Shortcut | Notes |
|--------|----------|-------|
| Open OCR | **Ctrl+Shift+O** | NEW! Quick access to OCR |

### Existing Shortcuts (Unchanged)
| Action | Shortcut | Notes |
|--------|----------|-------|
| Open Dictionary | **Ctrl+D** | Same as before |
| Open Layout | **Ctrl+Shift+L** | Same as before |

---

## Benefits of New Layout

### 1. Easier to Find Features
- **OCR** and **Dictionary** are now always visible in the header
- No need to remember where floating buttons are
- Clear visual hierarchy

### 2. Cleaner Workspace
- No floating buttons blocking your view
- More space for writing
- Less visual clutter

### 3. Better Organization
- **Header**: Global actions (OCR, Dictionary, Theme)
- **Toolbar**: Editor-specific controls (Mode, Grid, IME, Document actions)
- Logical grouping makes features easier to find

### 4. More Accessible
- All buttons have keyboard shortcuts
- Better tab navigation order
- Clear visual feedback (active states)

---

## Tips & Tricks

### 1. Active State Indicators
When OCR or Dictionary panel is open, the button in the header will be **highlighted** so you know it's active.

### 2. Keyboard Navigation
Press **Tab** to navigate through buttons:
1. Header buttons (OCR, Dictionary, Theme)
2. Toolbar buttons (Mode, Grid, IME, Template, Layout, Export)
3. Editor content

### 3. Quick Access
Most-used features:
- **Ctrl+D**: Dictionary (quick character lookup)
- **Ctrl+Shift+O**: OCR (quick image recognition)
- **Ctrl+Shift+L**: Layout (quick page setup)

### 4. Visual Grouping
- **Left side of toolbar**: Writing controls (Mode, Grid, IME)
- **Right side of toolbar**: Document actions (Template, Layout, Export)

---

## Troubleshooting

### "I can't find the OCR button"
**Solution**: Look in the **header** (top row), on the **right side**, next to "TỪ ĐIỂN" and theme toggle.

### "I can't find the Dictionary button"
**Solution**: Look in the **header** (top row), on the **right side**, labeled "TỪ ĐIỂN".

### "Where did the mode controls go?"
**Solution**: They moved to the **toolbar** (second row), on the **left side**.

### "The toolbar takes up space"
**Answer**: Yes, but we removed the floating buttons, so you actually have **more editor space** overall (+32px).

### "I prefer the old layout"
**Answer**: The new layout is more organized and easier to use. Give it a few days - most users find it much better after getting used to it!

---

## What Stayed the Same

### ✅ All Features Work Exactly the Same
- OCR still recognizes text from images
- Dictionary still looks up characters
- Mode controls still change writing direction
- Grid still shows/hides the grid overlay
- IME still switches between Hán-Dao and ASCII
- Template still applies document templates
- Layout still configures page settings
- Export still exports to PDF/DOCX/TXT

### ✅ All Data is Preserved
- Your documents are safe
- Your dictionary history is intact
- Your personal dictionary entries are unchanged
- Your preferences are maintained

### ✅ Theme Support
- Dark theme still works
- Light theme still works
- Smooth transitions between themes

---

## Feedback

If you have any questions or feedback about the new layout:

1. **Check this guide** for common questions
2. **Try keyboard shortcuts** for faster access
3. **Give it a few days** - new layouts take time to get used to
4. **Report issues** if something doesn't work as expected

---

## Summary

### What You Need to Remember

1. **OCR button** is now in the **header** (top-right)
2. **Dictionary button** is now in the **header** (top-right)
3. **Mode controls** are now in the **toolbar** (second row)
4. **Document actions** are now in the **toolbar** (second row)
5. **Keyboard shortcuts** make everything faster:
   - Ctrl+Shift+O for OCR
   - Ctrl+D for Dictionary
   - Ctrl+Shift+L for Layout

### Why This is Better

- ✅ Cleaner interface (no floating buttons)
- ✅ Easier to find features (always visible)
- ✅ Better organization (logical grouping)
- ✅ More editor space (no clutter)
- ✅ Same functionality (nothing removed)

---

**Welcome to the new YAO Editor V2 layout!** 🎉

We hope you enjoy the cleaner, more organized interface. Happy writing!

---

**Version**: YAO Editor V2.1  
**Update Date**: 2026-05-31  
**Status**: ✅ Live
