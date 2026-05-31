# UI Layout Redesign - Design Document

## 1. Overview

### Current Problems
- **Header quá đông**: Logo, title, mode controls, theme toggle, template, layout, export buttons tất cả trên 1 hàng
- **Không gian lãng phí**: OCR và Dictionary là floating panels che khuất editor
- **Thiếu tổ chức**: Các controls không được nhóm logic
- **Khó truy cập**: Phải click vào floating buttons để mở panels

### Proposed Solution
Tái cấu trúc UI thành **2-tier layout**:
- **Tier 1 (Header)**: Branding + Quick Access (OCR, Dictionary, Theme)
- **Tier 2 (Toolbar)**: Editor Controls (Mode, Grid, IME, Template, Layout, Export)

---

## 2. Design Goals

### Primary Goals
1. **Clarity**: Tách biệt rõ ràng giữa app-level actions và editor-level actions
2. **Accessibility**: OCR và Dictionary luôn visible, không cần toggle
3. **Space Efficiency**: Tận dụng không gian header thay vì floating panels
4. **Visual Hierarchy**: Header = global, Toolbar = contextual

### Secondary Goals
- Maintain premium aesthetic
- Smooth animations
- Responsive to different screen sizes
- Support both dark and light themes

---

## 3. Layout Structure

### 3.1 New Header (Tier 1)
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] YAO EDITOR V2    [OCR] [Dictionary] [Theme Toggle]      │
└─────────────────────────────────────────────────────────────────┘
```

**Components:**
- **Left Section**: Logo + Title (unchanged)
- **Right Section**: 
  - OCR button (opens dropdown/modal)
  - Dictionary button (opens dropdown/modal)
  - Theme toggle (unchanged)

**Height**: 64px (same as current)

### 3.2 New Toolbar (Tier 2)
```
┌─────────────────────────────────────────────────────────────────┐
│ [Ngang/Dọc] [Bật Lưới Ô] | [Hán-Dao Mode] | [Mẫu] [Bố Cục] [Xuất] │
└─────────────────────────────────────────────────────────────────┘
```

**Components:**
- **Left Section**: Writing mode + Grid toggle + IME mode
- **Right Section**: Template + Layout + Export
- **Dividers**: Visual separators between groups

**Height**: 48px (new)

### 3.3 Total Header Height
- Current: 64px (header only)
- New: 112px (64px header + 48px toolbar)
- Trade-off: +48px vertical space, but removes floating panels

---

## 4. Component Specifications

### 4.1 OCR Button (Header)

**Visual Design:**
```tsx
<button>
  <CameraIcon />
  <span>OCR</span>
</button>
```

**Behavior:**
- Click → Opens OCR modal (centered overlay)
- Modal size: 480px × 600px
- Contains: Image upload, language selector, recognition results
- Close: Click outside, ESC key, or X button

**States:**
- Default: Subtle background
- Hover: Highlight
- Active: Primary color accent
- Processing: Loading spinner

### 4.2 Dictionary Button (Header)

**Visual Design:**
```tsx
<button>
  <BookIcon />
  <span>TỪ ĐIỂN</span>
</button>
```

**Behavior:**
- Click → Opens Dictionary modal (centered overlay)
- Modal size: 600px × 700px
- Contains: Search, tabs (Search, History, Details, Handwriting, Override)
- Close: Click outside, ESC key, or X button

**States:**
- Default: Subtle background
- Hover: Highlight
- Active: Primary color accent
- Has results: Badge indicator

### 4.3 Toolbar Layout

**Left Group: Editor Modes**
```
[Ngang/Dọc] [Bật Lưới Ô] | [Hán-Dao Mode]
```
- Writing mode toggle (2 buttons)
- Grid toggle (single button)
- Divider
- IME mode toggle (single button)

**Right Group: Document Actions**
```
[Mẫu] [Bố Cục] [Xuất]
```
- Template selector
- Layout configurator
- Export menu

---

## 5. Modal Design Patterns

### 5.1 OCR Modal

**Layout:**
```
┌─────────────────────────────────┐
│ ✕  NHẬN DẠNG KÝ TỰ (OCR)       │
├─────────────────────────────────┤
│ [Language: CHỮ HÁN ▼]          │
├─────────────────────────────────┤
│                                 │
│   [Drop zone / Image preview]   │
│                                 │
├─────────────────────────────────┤
│ [Progress bar] (if processing)  │
│                                 │
│ [Results] (if complete)         │
│   - Confidence: 95%             │
│   - Text: ...                   │
│   [Copy] [New Image]            │
└─────────────────────────────────┘
```

**Features:**
- Drag & drop support
- Paste from clipboard (Ctrl+V)
- Language selector (CHỮ HÁN, TIẾNG VIỆT, TIẾNG ANH)
- Progress indicator
- Confidence meter
- Copy to clipboard
- Cache results (Dexie)

### 5.2 Dictionary Modal

**Layout:**
```
┌─────────────────────────────────────┐
│ ✕  TỪ ĐIỂN                         │
├─────────────────────────────────────┤
│ [Tra cứu][Lịch sử][Chi tiết][...]  │
├─────────────────────────────────────┤
│ [Search input]              [🔍]   │
├─────────────────────────────────────┤
│                                     │
│   [Search results / Content]        │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Features:**
- Tabs: Search, History, Details, Handwriting, Override
- Search with autocomplete
- Character details with AI explanation
- Handwriting recognition
- Personal dictionary management
- Search history

---

## 6. Responsive Behavior

### 6.1 Desktop (≥1280px)
- Full layout as described
- All buttons show text labels
- Modals: centered, max-width

### 6.2 Tablet (768px - 1279px)
- Toolbar buttons: icon only (hide text)
- Modals: 90% width
- Maintain 2-tier structure

### 6.3 Mobile (<768px)
- Header: Logo + hamburger menu
- Toolbar: Horizontal scroll
- Modals: Full screen

---

## 7. Animation & Transitions

### 7.1 Modal Animations
```tsx
// Entry
initial: { opacity: 0, scale: 0.95, y: 20 }
animate: { opacity: 1, scale: 1, y: 0 }
transition: { type: 'spring', stiffness: 300, damping: 30 }

// Exit
exit: { opacity: 0, scale: 0.95, y: 20 }
```

### 7.2 Button Interactions
- Hover: 150ms ease-out
- Active: scale(0.98)
- Focus: ring animation

### 7.3 Toolbar Slide
- Initial load: slide down from top
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

---

## 8. Theme Support

### 8.1 Color Variables
All components use CSS variables:
- `--color-bg-primary` / `--color-bg-secondary` / `--color-bg-tertiary`
- `--color-text-primary` / `--color-text-secondary` / `--color-text-tertiary`
- `--color-border` / `--color-border-light`
- `--color-primary` / `--color-primary-light`

### 8.2 Dark Theme (Default)
- Header: `rgba(0,0,0,0.1)` gradient
- Toolbar: `var(--color-bg-toolbar)`
- Modals: `var(--color-bg-secondary)` with backdrop blur

### 8.3 Light Theme
- Header: `rgba(255,255,255,0.9)` gradient
- Toolbar: `var(--color-bg-toolbar)` (light variant)
- Modals: `var(--color-bg-secondary)` (light variant)

---

## 9. Accessibility

### 9.1 Keyboard Navigation
- **Tab**: Navigate between buttons
- **Enter/Space**: Activate button
- **Escape**: Close modal
- **Ctrl+D**: Open Dictionary (existing)
- **Ctrl+Shift+O**: Open OCR (new)

### 9.2 Screen Readers
- All buttons have `aria-label`
- Modals have `role="dialog"` and `aria-modal="true"`
- Focus trap within modals
- Announce state changes

### 9.3 Focus Management
- Focus first input when modal opens
- Return focus to trigger button when modal closes
- Visible focus indicators (outline)

---

## 10. Performance Considerations

### 10.1 Modal Lazy Loading
- OCR: Load Tesseract.js only when modal opens
- Dictionary: Pre-load dictionary data on app init
- Handwriting: Load recognition library on tab switch

### 10.2 Animation Performance
- Use `transform` and `opacity` (GPU-accelerated)
- Avoid layout thrashing
- Use `will-change` sparingly

### 10.3 Memory Management
- Unmount modal content when closed
- Clear OCR image data after processing
- Limit dictionary search history to 20 items

---

## 11. Implementation Phases

### Phase 1: Toolbar Creation
1. Create new `EditorToolbar` component
2. Move mode controls from Header to Toolbar
3. Add visual separators
4. Test responsive behavior

### Phase 2: Header Simplification
1. Remove mode controls from Header
2. Add OCR button to Header
3. Add Dictionary button to Header
4. Adjust spacing and alignment

### Phase 3: OCR Modal
1. Convert OCRPanel to modal
2. Update trigger button
3. Add keyboard shortcut
4. Test all features

### Phase 4: Dictionary Modal
1. Convert DictionaryPanel to modal
2. Update trigger button
3. Maintain all tabs and features
4. Test search and navigation

### Phase 5: Polish & Testing
1. Animation refinement
2. Theme testing (dark/light)
3. Responsive testing
4. Accessibility audit
5. Performance optimization

---

## 12. Migration Strategy

### 12.1 Backward Compatibility
- Keep existing components during migration
- Feature flag for new layout
- A/B testing capability

### 12.2 User Communication
- Changelog entry
- In-app notification about new layout
- Quick tour/tooltip on first use

### 12.3 Rollback Plan
- Keep old components in codebase
- Environment variable to toggle layouts
- Monitor user feedback

---

## 13. Success Metrics

### 13.1 Quantitative
- Header height: 64px → 112px (+75%)
- Floating panels removed: 2 → 0
- Click depth to OCR/Dictionary: 1 (same)
- Modal open time: <200ms

### 13.2 Qualitative
- User feedback: "easier to find features"
- Visual clarity: "cleaner interface"
- Workflow: "less distraction"

---

## 14. Visual Mockups

### 14.1 Before (Current)
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] YAO V2  [Ngang/Dọc][Grid][IME] [Theme][Mẫu][Bố cục][Xuất] │
└─────────────────────────────────────────────────────────────┘
│                                                             │
│                    [Editor Area]                            │
│                                                             │
│                                              [Dict Button]  │
│                                              [OCR Button]   │
```

### 14.2 After (Proposed)
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] YAO EDITOR V2              [OCR][Dictionary][Theme] │
├─────────────────────────────────────────────────────────────┤
│ [Ngang/Dọc][Grid] | [IME]           [Mẫu][Bố cục][Xuất]   │
└─────────────────────────────────────────────────────────────┘
│                                                             │
│                    [Editor Area]                            │
│                                                             │
│                                                             │
```

---

## 15. Technical Specifications

### 15.1 Component Structure
```
App.tsx
├── Header (Tier 1)
│   ├── Logo
│   ├── Title
│   ├── OCRButton → OCRModal
│   ├── DictionaryButton → DictionaryModal
│   └── ThemeToggle
├── Toolbar (Tier 2)
│   ├── WritingModeToggle
│   ├── GridToggle
│   ├── Divider
│   ├── IMEToggle
│   ├── Spacer
│   ├── TemplateButton
│   ├── LayoutButton
│   └── ExportMenu
├── EditorArea
│   └── YaoEditor
└── Footer
```

### 15.2 New Components
- `components/layout/Toolbar.tsx` - New toolbar component
- `components/modals/OCRModal.tsx` - OCR modal (refactored from OCRPanel)
- `components/modals/DictionaryModal.tsx` - Dictionary modal (refactored from DictionaryPanel)
- `components/header/HeaderButton.tsx` - Reusable header button

### 15.3 Modified Components
- `App.tsx` - Add Toolbar, update Header
- `components/editor/ModeToggle.tsx` - Move to Toolbar
- `components/common/ThemeToggle.tsx` - Stay in Header

### 15.4 Removed Components
- `components/ocr/OCRPanel.tsx` - Replaced by OCRModal
- `components/dictionary/DictionaryPanel.tsx` - Replaced by DictionaryModal

---

## 16. CSS Architecture

### 16.1 Toolbar Styles
```css
.toolbar {
  height: 48px;
  background: var(--color-bg-toolbar);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  gap: 1rem;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
}
```

### 16.2 Modal Styles
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 200;
}

.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: var(--shadow-2xl);
}
```

---

## 17. Testing Strategy

### 17.1 Unit Tests
- Toolbar component rendering
- Modal open/close behavior
- Button click handlers
- Keyboard shortcuts

### 17.2 Integration Tests
- OCR workflow (upload → process → copy)
- Dictionary workflow (search → details → copy)
- Theme switching with new layout
- Responsive breakpoints

### 17.3 E2E Tests
- Complete user journey
- Modal interactions
- Keyboard navigation
- Cross-browser compatibility

### 17.4 Visual Regression Tests
- Screenshot comparison
- Dark/light theme variants
- Responsive layouts
- Animation states

---

## 18. Documentation Updates

### 18.1 User Documentation
- Update screenshots
- New keyboard shortcuts
- Feature location changes
- Migration guide

### 18.2 Developer Documentation
- Component API changes
- New component structure
- CSS variable usage
- Testing guidelines

---

## 19. Future Enhancements

### 19.1 Toolbar Customization
- User can reorder buttons
- Show/hide specific tools
- Save preferences

### 19.2 Modal Improvements
- Resizable modals
- Draggable modals
- Multi-modal support (open both OCR and Dictionary)

### 19.3 Quick Actions
- Command palette (Ctrl+K)
- Recent actions
- Favorites

---

## 20. Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Modal Escape Key Closure

*For any* open modal dialog, pressing the Escape key SHALL close that modal and return focus to the triggering element.

**Validates: Requirements 7.3, 8.2**

### Property 2: Modal Focus Trap

*For any* open modal dialog with focusable elements, pressing Tab SHALL cycle focus only within the modal, and pressing Tab on the last element SHALL return focus to the first element.

**Validates: Requirements 8.3, 8.5**

### Property 3: Modal Focus Initialization

*For any* modal dialog that opens, focus SHALL automatically move to the first input element within that modal.

**Validates: Requirements 8.1**

### Property 4: Focus Indicator Visibility

*For any* interactive element that receives keyboard focus, the system SHALL display a visible focus indicator.

**Validates: Requirements 8.4**

### Property 5: Button Keyboard Activation

*For any* button element that has keyboard focus, pressing Enter or Space SHALL activate that button's action.

**Validates: Requirements 7.2**

### Property 6: ARIA Label Completeness

*For all* button elements in the interface, each SHALL have an `aria-label` attribute.

**Validates: Requirements 9.1**

### Property 7: Modal ARIA Attributes

*For all* modal dialog elements, each SHALL have both `role="dialog"` and `aria-modal="true"` attributes.

**Validates: Requirements 9.2**

### Property 8: Modal Screen Reader Announcements

*For any* modal dialog, opening SHALL announce the modal title to screen readers, and closing SHALL announce the closure.

**Validates: Requirements 9.3, 9.4**

### Property 9: Toggle Button State Announcements

*For any* toggle button, changing state SHALL announce the new state to screen readers.

**Validates: Requirements 9.5**

### Property 10: CSS Variable Color Usage

*For all* components in Header, Toolbar, and modals, color values SHALL be defined using CSS variables rather than hardcoded values.

**Validates: Requirements 13.1**

### Property 11: Theme Color Application

*For any* theme change (dark or light), all components SHALL update their colors to match the new theme without requiring a page reload.

**Validates: Requirements 13.2, 13.3, 13.5**

### Property 12: Button Hover Timing

*For any* button element, hover styles SHALL be applied within 150ms of mouse enter.

**Validates: Requirements 14.1**

### Property 13: Button Click Scale Transform

*For any* button element, clicking SHALL apply a scale transformation to 0.98.

**Validates: Requirements 14.2**

### Property 14: Button Focus Ring Display

*For any* button element that receives keyboard focus, a focus ring SHALL be displayed.

**Validates: Requirements 14.3**

### Property 15: Button Active State Styling

*For any* button in an active state, the system SHALL apply primary color accent styling.

**Validates: Requirements 14.4**

### Property 16: Button Loading State Indicator

*For any* button that is processing an action, a loading spinner SHALL be displayed.

**Validates: Requirements 14.5**

### Property 17: Dictionary Search Results

*For any* character search query in the Dictionary modal, the system SHALL return and display matching results.

**Validates: Requirements 16.3**

### Property 18: Modal Opening Performance

*For any* modal dialog, opening SHALL complete and display the modal within 200ms.

**Validates: Requirements 17.1**

### Property 19: Modal Content Unmounting

*For any* modal dialog that closes, the modal content SHALL be unmounted from the DOM to free memory.

**Validates: Requirements 17.5, 19.1**

### Property 20: GPU-Accelerated Animation Properties

*For all* animated elements, animations SHALL use only GPU-accelerated properties (transform and opacity).

**Validates: Requirements 18.1**

### Property 21: Will-Change Property Usage

*For all* elements in the interface, the `will-change` CSS property SHALL only be applied to elements that are actively being animated.

**Validates: Requirements 18.3**

### Property 22: Button Hover Transition Timing

*For any* button element, hover transitions SHALL complete within 150ms.

**Validates: Requirements 18.5**

### Property 23: Modal Resource Cleanup

*For any* modal component that becomes unused, the system SHALL release associated resources including event listeners.

**Validates: Requirements 19.4, 19.5**

---

## 21. Conclusion

This redesign achieves:
- ✅ Clearer visual hierarchy (2-tier structure)
- ✅ Better space utilization (no floating panels)
- ✅ Improved accessibility (always visible buttons)
- ✅ Maintained functionality (all features preserved)
- ✅ Enhanced UX (logical grouping, easier discovery)

**Trade-offs:**
- +48px vertical space for toolbar
- Modals instead of persistent panels
- Slightly more clicks for power users (but better for new users)

**Overall Impact:** Positive - cleaner, more professional, easier to use.
