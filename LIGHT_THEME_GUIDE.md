# Light Theme Implementation Guide

## Overview
The Yao Editor v2 now features a complete light/dark theme system with seamless switching and persistent preferences.

## Theme Toggle Location
**Header Top-Right**: Look for the sun/moon icon button next to the mode toggle

## Color Schemes

### Dark Theme (Default)
```
Background: Deep slate (#030712 → #0f172a)
Text: Light gray (#f9fafb)
Accents: Indigo (#4f46e5)
Borders: Dark gray (#1f2937)
```

### Light Theme
```
Background: White (#ffffff → #f9fafb)
Text: Dark gray (#111827)
Accents: Indigo (#4f46e5)
Borders: Light gray (#e5e7eb)
```

## Components with Light Theme Support

### Header & Navigation
- ✅ Logo and title
- ✅ Mode toggle (Horizontal/Vertical)
- ✅ Grid toggle
- ✅ IME toggle
- ✅ Template button
- ✅ Layout button
- ✅ Export menu
- ✅ Theme toggle

### Editor Area
- ✅ Main editor background
- ✅ Page display
- ✅ Grid overlay
- ✅ Candidate bar (IME suggestions)

### Panels & Modals
- ✅ Dictionary panel (right sidebar)
- ✅ Layout modal
- ✅ Template modal
- ✅ Export progress overlay
- ✅ Notification cards

### Footer
- ✅ Status bar
- ✅ Save status indicator
- ✅ Engine status
- ✅ Dictionary entry count

## CSS Implementation Pattern

All components use Tailwind's theme-aware classes:

```tsx
// Example: Button with light theme support
<button className="
  bg-gray-800 dark:bg-gray-800 light:bg-gray-200
  text-gray-300 dark:text-gray-300 light:text-gray-700
  border-gray-700 dark:border-gray-700 light:border-gray-400
  hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-300
  transition-colors
">
  Click me
</button>
```

## CSS Variables

Global CSS variables provide additional theming support:

```css
:root {
  /* Light theme */
  --color-bg-primary: #ffffff;
  --color-text-primary: #111827;
  --color-border: #e5e7eb;
}

.light {
  /* Override for light theme */
  --color-bg-primary: #ffffff;
  --color-text-primary: #111827;
}
```

## Theme Persistence

- Theme preference is saved to `localStorage` under key `theme`
- On first visit, system preference is detected via `prefers-color-scheme`
- Theme persists across page reloads and browser sessions

## Smooth Transitions

All theme changes include smooth CSS transitions:
- Duration: 200ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Properties: background-color, color, border-color

## Testing the Theme

### Manual Testing Steps

1. **Initial Load**
   - Open the application
   - Verify theme matches system preference
   - Check all UI elements are visible and readable

2. **Theme Toggle**
   - Click the sun/moon icon in the header
   - Verify smooth transition to opposite theme
   - Check all components update correctly

3. **Persistence**
   - Toggle to light theme
   - Refresh the page (F5)
   - Verify light theme is still active

4. **Component Verification**
   - Test each component in both themes:
     - Buttons and interactive elements
     - Text readability
     - Border visibility
     - Icon visibility
     - Modal overlays
     - Dropdown menus

5. **Accessibility**
   - Verify text contrast in both themes
   - Check focus states are visible
   - Test keyboard navigation

## Troubleshooting

### Theme not persisting
- Check browser localStorage is enabled
- Clear localStorage and try again
- Check browser console for errors

### Components not updating
- Verify component has `dark:` and `light:` classes
- Check CSS variables are defined
- Inspect element in browser DevTools

### Transitions not smooth
- Check CSS transitions are not disabled
- Verify `transition-colors` class is present
- Check for conflicting CSS

## Future Enhancements

- [ ] Add theme selector (more than 2 options)
- [ ] Add custom color picker
- [ ] Add theme preview before applying
- [ ] Add keyboard shortcut for theme toggle
- [ ] Add theme scheduling (auto-switch at sunset)
- [ ] Add per-component theme overrides

## Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Notes

- Theme switching is instant (no page reload)
- CSS transitions are GPU-accelerated
- localStorage operations are minimal
- No additional network requests

## Related Files

- `src/contexts/ThemeContext.tsx` - Theme state management
- `src/components/common/ThemeToggle.tsx` - Toggle button
- `src/index.css` - Global styles and variables
- `src/App.tsx` - Main app layout with theme classes
- `src/main.tsx` - Theme provider wrapper
