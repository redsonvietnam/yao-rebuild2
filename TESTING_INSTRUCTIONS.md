# Theme System Testing Instructions

## Quick Start

The dev server is running at: **http://localhost:3000**

## Testing Steps

### 1. Initial Load
- [ ] Open http://localhost:3000 in your browser
- [ ] Check browser console (F12) - should have NO errors
- [ ] Verify the application loads without errors
- [ ] Look for the sun/moon icon in the top-right header

### 2. Theme Toggle
- [ ] Click the sun/moon icon in the header
- [ ] Verify the theme switches smoothly
- [ ] Check that ALL UI elements update colors:
  - Header background
  - Main editor area
  - Footer status bar
  - All buttons and controls
  - Text colors

### 3. Light Theme Verification
When in light theme, verify:
- [ ] Background is white/light gray
- [ ] Text is dark (readable)
- [ ] Buttons are visible
- [ ] Borders are visible
- [ ] All icons are visible
- [ ] No text is hard to read

### 4. Dark Theme Verification
When in dark theme, verify:
- [ ] Background is dark
- [ ] Text is light (readable)
- [ ] Buttons are visible
- [ ] Borders are visible
- [ ] All icons are visible
- [ ] No text is hard to read

### 5. Component Testing

#### Header & Navigation
- [ ] Logo and title visible in both themes
- [ ] Mode toggle (Horizontal/Vertical) works
- [ ] Grid toggle works
- [ ] IME toggle works
- [ ] Template button works
- [ ] Layout button works
- [ ] Export menu works
- [ ] Theme toggle works

#### Editor Area
- [ ] Editor background displays correctly
- [ ] Page display is visible
- [ ] Grid overlay (if enabled) is visible
- [ ] Text is readable

#### Modals & Dropdowns
- [ ] Export menu dropdown displays correctly
- [ ] Template modal displays correctly
- [ ] Layout modal displays correctly
- [ ] All text in modals is readable

#### Dictionary Panel
- [ ] Dictionary toggle button works
- [ ] Dictionary panel slides in/out smoothly
- [ ] All tabs are visible and clickable
- [ ] Text in dictionary is readable

#### Notifications
- [ ] Notification cards display correctly
- [ ] Colors match theme
- [ ] Text is readable
- [ ] Close button works

#### Footer
- [ ] Status bar displays correctly
- [ ] Save status indicator is visible
- [ ] Engine status is visible
- [ ] Dictionary entry count is visible

### 6. Persistence Testing
- [ ] Switch to light theme
- [ ] Refresh the page (F5)
- [ ] Verify light theme is still active
- [ ] Switch to dark theme
- [ ] Refresh the page
- [ ] Verify dark theme is still active

### 7. System Preference Testing
- [ ] Clear browser localStorage (DevTools → Application → Storage → Clear All)
- [ ] Refresh the page
- [ ] Check if theme matches your system preference
  - Windows: Settings → Personalization → Colors
  - macOS: System Preferences → General → Appearance
  - Linux: Depends on desktop environment

### 8. Accessibility Testing
- [ ] Use Tab key to navigate through all interactive elements
- [ ] Verify focus states are visible in both themes
- [ ] Check text contrast is sufficient (WCAG AA standard)
- [ ] Test with screen reader if available

### 9. Performance Testing
- [ ] Theme switching should be instant (no lag)
- [ ] No page flicker when switching themes
- [ ] No console errors or warnings
- [ ] Application should remain responsive

## Expected Behavior

### Theme Toggle
- Clicking the sun/moon icon should instantly switch themes
- All UI elements should update colors smoothly
- No page reload should occur
- Transition should take ~200ms

### Persistence
- Theme preference should be saved to localStorage
- Theme should persist across page reloads
- Theme should persist across browser sessions

### System Preference
- On first visit, theme should match system preference
- If system preference is dark, app should load in dark theme
- If system preference is light, app should load in light theme

## Troubleshooting

### Theme toggle button not visible
- [ ] Check browser console for errors
- [ ] Verify header is rendering
- [ ] Check if sun/moon icon is hidden behind other elements
- [ ] Try zooming out (Ctrl+Minus) to see if it's off-screen

### Theme not switching
- [ ] Check browser console for errors
- [ ] Verify localStorage is enabled
- [ ] Try clearing localStorage and refreshing
- [ ] Check if JavaScript is enabled

### Theme not persisting
- [ ] Check if localStorage is enabled
- [ ] Check browser privacy settings
- [ ] Try a different browser
- [ ] Check if cookies/storage are being cleared on exit

### Text not readable
- [ ] Check browser zoom level
- [ ] Try a different browser
- [ ] Check if custom CSS is interfering
- [ ] Verify color contrast in DevTools

### Colors look wrong
- [ ] Check if browser has color management enabled
- [ ] Try a different monitor/display
- [ ] Check if browser extensions are interfering
- [ ] Verify CSS variables are loaded correctly

## Browser DevTools Tips

### Check Theme State
1. Open DevTools (F12)
2. Go to Console tab
3. Type: `document.documentElement.classList.contains('light')`
4. Should return `true` or `false`

### Check localStorage
1. Open DevTools (F12)
2. Go to Application tab
3. Click Storage → Local Storage → http://localhost:3000
4. Look for key `theme` with value `light` or `dark`

### Check CSS Variables
1. Open DevTools (F12)
2. Go to Elements tab
3. Select the `<html>` element
4. Check Styles panel for CSS variables
5. Look for `--color-bg-primary`, `--color-text-primary`, etc.

## Performance Metrics

Expected performance:
- Theme toggle: < 50ms
- Page load: < 2s
- No memory leaks
- No console errors

## Success Criteria

✅ All tests pass
✅ No console errors
✅ Theme switches smoothly
✅ Theme persists across reloads
✅ All components display correctly in both themes
✅ Text is readable in both themes
✅ No performance issues

## Reporting Issues

If you find any issues:
1. Note the exact steps to reproduce
2. Check browser console for errors
3. Take a screenshot
4. Check localStorage state
5. Try in a different browser
6. Report with as much detail as possible

## Contact

For questions or issues, refer to:
- `THEME_SYSTEM_UPDATE.md` - Technical details
- `LIGHT_THEME_GUIDE.md` - User guide
- `IMPLEMENTATION_COMPLETE.md` - Full documentation
- `THEME_FIX.md` - Bug fix details
