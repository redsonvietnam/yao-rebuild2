# UI Reorganization - Design Document

## 📋 Metadata
- **Feature**: UI Layout Reorganization
- **Status**: Planning
- **Priority**: High
- **Complexity**: Medium
- **Estimated Effort**: 4-6 hours
- **Created**: 2026-05-31

---

## 🎯 Objective

Tổ chức lại giao diện người dùng để tối ưu hóa không gian soạn thảo và nhóm các controls theo chức năng logic hơn.

### Current Problems
1. **Header quá đông đúc** - Chứa quá nhiều controls (8+ buttons)
2. **Toolbar bị lãng phí** - Chỉ có ruler, không có controls nào khác
3. **Không gian editor bị thu hẹp** - Dictionary panel chiếm 320px bên phải
4. **OCR panel che khuất** - Floating ở góc dưới phải, có thể che nội dung
5. **Phân loại không logic** - Editing controls và utility tools trộn lẫn

### Goals
1. ✅ Tăng không gian soạn thảo (loại bỏ side panels)
2. ✅ Tập trung editing controls vào toolbar
3. ✅ Đưa utility tools (OCR, Dict) lên header
4. ✅ Tạo hierarchy rõ ràng: Header (navigation) → Toolbar (editing) → Editor (content)
5. ✅ Giữ nguyên functionality, chỉ thay đổi layout

---

## 🎨 Design Proposal

### 1. Header Layout (Top Bar)

**Purpose**: Navigation, branding, và utility tools

```
┌────────────────────────────────────────────────────────────────┐
│ [Logo] YAO EDITOR V2    [OCR] [DICT]    [THEME]               │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

**Components**:
- **Left Section**:
  - Logo (gradient icon)
  - Title "YAO EDITOR"
  - Version badge "V2"

- **Center Section**:
  - **[OCR Button]** - Opens OCR panel (modal/dropdown)
  - **[DICT Button]** - Opens Dictionary panel (modal/dropdown)

- **Right Section**:
  - **[Theme Toggle]** - Dark/Light theme switch

**Changes**:
- ❌ Remove: ModeToggle, Template, Layout, Export buttons
- ✅ Add: OCR, Dictionary buttons
- ✅ Keep: Logo, Title, Theme toggle

---

### 2. Toolbar Layout (Below Header)

**Purpose**: Editing controls và document operations

```
┌────────────────────────────────────────────────────────────────┐
│ [NGANG/DỌC] [BẬT LƯỚI Ô] [HÁN-DAO MODE]  │  [MẪU] [BỐ CỤC] [XUẤT] │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

**Components**:

**Left Section - Editor Controls**:
1. **Writing Mode Toggle** - [NGANG] / [DỌC]
   - Horizontal vs Vertical writing
   - Segmented control style

2. **Grid Toggle** - [BẬT LƯỚI Ô] / [TẮT LƯỚI Ô]
   - Show/hide grid overlay
   - Icon + text

3. **IME Mode Toggle** - [HÁN-DAO MODE] / [ASCII MODE]
   - Input method switch
   - Prominent button with indicator dot

**Right Section - Document Operations**:
4. **Template Button** - [MẪU]
   - Opens template selection modal
   - Icon + text

5. **Layout Button** - [BỐ CỤC]
   - Opens page layout modal
   - Icon + text

6. **Export Menu** - [XUẤT]
   - Dropdown with PDF/DOCX/PNG options
   - Icon + text + dropdown arrow

**Visual Design**:
- Background: `var(--color-bg-toolbar)`
- Border: Bottom border with `var(--color-border)`
- Height: 48px (slightly taller than current)
- Padding: 12px horizontal
- Gap between sections: Flexible spacer
- Button style: Consistent with current design

---

### 3. OCR Panel Redesign

**Current**: Floating panel bottom-right (400x520px)

**Proposed Options**:

#### Option A: Modal Dialog (Recommended)
- Opens as centered modal overlay
- Size: 500x600px
- Better focus, không che editor
- Backdrop blur effect

#### Option B: Dropdown from Header
- Drops down from OCR button
- Size: 400x500px
- Attached to header
- Similar to Export menu style

#### Option C: Slide-in from Right
- Slides from right edge
- Size: 400x full-height
- Similar to current Dict panel
- Can coexist with Dict

**Recommendation**: **Option A (Modal)** 
- Lý do: OCR cần focus, không dùng thường xuyên, modal phù hợp hơn

---

### 4. Dictionary Panel Redesign

**Current**: Slide-in panel from right (320px width, full height)

**Proposed Options**:

#### Option A: Modal Dialog
- Opens as centered modal
- Size: 600x700px
- More space for content
- Better for detailed view

#### Option B: Dropdown from Header (Recommended)
- Drops down from DICT button
- Size: 400x600px
- Quick access
- Doesn't block editor

#### Option C: Bottom Sheet
- Slides up from bottom
- Full width, 400px height
- Mobile-friendly pattern
- Good for quick lookups

**Recommendation**: **Option B (Dropdown)**
- Lý do: Quick access, không che editor, consistent với Export menu

---

## 🔄 User Flow Changes

### Before
```
User wants to:
1. Change writing mode → Look at header → Click button
2. Toggle grid → Look at header → Click button  
3. Use OCR → Look at bottom-right → Click floating button
4. Search dictionary → Look at right edge → Click edge button
5. Export document → Look at header → Click button
```

### After
```
User wants to:
1. Change writing mode → Look at toolbar → Click button
2. Toggle grid → Look at toolbar → Click button
3. Use OCR → Look at header → Click button → Modal opens
4. Search dictionary → Look at header → Click button → Dropdown opens
5. Export document → Look at toolbar → Click button → Dropdown opens
```

**Benefits**:
- ✅ Editing controls grouped together (toolbar)
- ✅ Utility tools grouped together (header)
- ✅ More predictable locations
- ✅ Less visual clutter

---

## 📐 Layout Specifications

### Header
- **Height**: 64px (unchanged)
- **Background**: `linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.05))`
- **Border**: Bottom border `var(--color-border)`
- **Padding**: 0 32px
- **Z-index**: 100

### Toolbar
- **Height**: 48px (new)
- **Background**: `var(--color-bg-toolbar)`
- **Border**: Bottom border `var(--color-border)`
- **Padding**: 0 32px
- **Z-index**: 95
- **Position**: Sticky top (below header)

### Editor Area
- **Height**: `calc(100vh - 64px - 48px - 40px)` (viewport - header - toolbar - footer)
- **Width**: 100% (no side panels)
- **Background**: Current gradient background
- **Padding**: 40px (increased from 20px)

### OCR Modal
- **Size**: 500x600px
- **Position**: Fixed center
- **Background**: `var(--color-bg-secondary)` with backdrop blur
- **Border**: `var(--color-border)`
- **Border-radius**: 16px
- **Z-index**: 200

### Dictionary Dropdown
- **Size**: 400x600px
- **Position**: Absolute, anchored to DICT button
- **Background**: `var(--color-bg-secondary)` with backdrop blur
- **Border**: `var(--color-border)`
- **Border-radius**: 12px
- **Z-index**: 150

---

## 🎨 Visual Design

### Color Scheme
All components use existing CSS variables:
- Backgrounds: `--color-bg-primary`, `--color-bg-secondary`, `--color-bg-toolbar`
- Text: `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`
- Borders: `--color-border`, `--color-border-light`
- Accents: `--color-primary`, `--color-primary-light`

### Button Styles

#### Toolbar Buttons (Editing Controls)
```css
- Background: var(--color-bg-toolbar)
- Border: 1px solid var(--color-border)
- Padding: 8px 16px
- Border-radius: 8px
- Font-size: 11px
- Font-weight: 700
- Transition: all 150ms

Hover:
- Border-color: var(--color-border-light)
- Color: var(--color-text-primary)

Active:
- Background: var(--color-primary)
- Color: white
- Border-color: var(--color-primary)
```

#### Header Buttons (Utility Tools)
```css
- Background: transparent
- Border: 1px solid var(--color-border)
- Padding: 8px 16px
- Border-radius: 8px
- Font-size: 11px
- Font-weight: 700

Hover:
- Background: var(--color-bg-hover)
- Border-color: var(--color-border-light)

Active (when panel open):
- Background: var(--color-primary)/20
- Border-color: var(--color-primary)/40
- Color: var(--color-primary-light)
```

### Animations

#### Panel Open/Close
```typescript
// Modal (OCR)
initial: { opacity: 0, scale: 0.95, y: 20 }
animate: { opacity: 1, scale: 1, y: 0 }
exit: { opacity: 0, scale: 0.95, y: 20 }
transition: { type: 'spring', stiffness: 400, damping: 30 }

// Dropdown (Dictionary)
initial: { opacity: 0, y: -10, scale: 0.95 }
animate: { opacity: 1, y: 0, scale: 1 }
exit: { opacity: 0, y: -10, scale: 0.95 }
transition: { duration: 0.2, ease: 'easeOut' }
```

---

## 🔧 Technical Implementation

### Component Structure Changes

#### 1. App.tsx
```typescript
<div className="app">
  <Header>
    <Logo />
    <Title />
    <OCRButton onClick={() => setOCROpen(true)} />
    <DictButton onClick={() => setDictOpen(true)} />
    <ThemeToggle />
  </Header>
  
  <EditorToolbar>
    <ModeToggle />
    <GridToggle />
    <IMEToggle />
    <Spacer />
    <TemplateButton />
    <LayoutButton />
    <ExportMenu />
  </EditorToolbar>
  
  <EditorArea>
    <YaoEditor />
    <CandidateBar />
  </EditorArea>
  
  <Footer />
  
  {/* Modals/Dropdowns */}
  <OCRModal isOpen={ocrOpen} onClose={() => setOCROpen(false)} />
  <DictDropdown isOpen={dictOpen} onClose={() => setDictOpen(false)} />
  <TemplateModal />
  <LayoutModal />
  <NotificationList />
</div>
```

#### 2. New Components

**EditorToolbar.tsx** (New)
- Combines ModeToggle, Grid toggle, IME toggle
- Adds Template, Layout, Export buttons
- Horizontal layout with left/right sections

**OCRModal.tsx** (Refactor from OCRPanel)
- Change from floating panel to modal
- Center positioning
- Backdrop overlay

**DictDropdown.tsx** (Refactor from DictionaryPanel)
- Change from slide-in panel to dropdown
- Anchored to header button
- Compact layout

#### 3. Modified Components

**Header.tsx** (Modified)
- Remove: ModeToggle, Template, Layout, Export
- Add: OCR button, Dictionary button
- Simplified layout

**ModeToggle.tsx** (Modified)
- Extract individual toggles
- Remove wrapper div
- Direct integration into toolbar

---

## 📱 Responsive Considerations

### Desktop (>1200px)
- Full layout as described
- All buttons visible
- Toolbar in single row

### Tablet (768px - 1200px)
- Toolbar may wrap to 2 rows
- Button text may be shortened
- Panels may be smaller

### Mobile (<768px)
- Header: Logo + hamburger menu
- Toolbar: Icon-only buttons
- OCR/Dict: Full-screen modals
- *Note: Mobile not priority for V2*

---

## ♿ Accessibility

### Keyboard Navigation
- Tab order: Header → Toolbar → Editor → Footer
- Escape key closes modals/dropdowns
- Arrow keys navigate within dropdowns
- Enter/Space activates buttons

### Screen Readers
- Proper ARIA labels for all buttons
- Role="toolbar" for toolbar section
- Role="dialog" for modals
- Announce state changes (grid on/off, mode change)

### Focus Management
- Focus trap in modals
- Return focus to trigger button on close
- Visible focus indicators
- Skip to content link

---

## 🧪 Testing Strategy

### Visual Testing
- [ ] Header layout correct in both themes
- [ ] Toolbar layout correct in both themes
- [ ] OCR modal centers properly
- [ ] Dict dropdown positions correctly
- [ ] No layout shifts on panel open/close
- [ ] Responsive breakpoints work

### Functional Testing
- [ ] All buttons trigger correct actions
- [ ] Modals/dropdowns open and close
- [ ] Keyboard shortcuts still work
- [ ] State persists (grid, mode, theme)
- [ ] No regressions in existing features

### User Testing
- [ ] Users can find controls easily
- [ ] Workflow feels natural
- [ ] No confusion about new layout
- [ ] Improved or same efficiency

---

## 📊 Success Metrics

### Quantitative
- Editor viewport width: +320px (from removing side panel)
- Header button count: -5 buttons (from 8 to 3)
- Toolbar button count: +6 buttons (from 0 to 6)
- Click depth to OCR: Same (1 click)
- Click depth to Dict: Same (1 click)

### Qualitative
- ✅ More organized visual hierarchy
- ✅ Clearer separation of concerns
- ✅ Less visual clutter
- ✅ More spacious editing area
- ✅ Consistent with modern editor UIs

---

## 🚀 Implementation Plan

### Phase 1: Preparation (30 min)
1. Create new component files
2. Set up state management
3. Define shared types/interfaces

### Phase 2: Toolbar (1.5 hours)
1. Create EditorToolbar component
2. Move ModeToggle components
3. Move Template, Layout, Export buttons
4. Style and position toolbar
5. Test all toolbar functions

### Phase 3: Header (1 hour)
1. Simplify Header component
2. Add OCR button
3. Add Dictionary button
4. Update layout and styling
5. Test header interactions

### Phase 4: OCR Modal (1 hour)
1. Refactor OCRPanel to OCRModal
2. Change positioning to modal
3. Add backdrop and animations
4. Update open/close logic
5. Test OCR functionality

### Phase 5: Dictionary Dropdown (1.5 hours)
1. Refactor DictionaryPanel to DictDropdown
2. Change positioning to dropdown
3. Adjust layout for dropdown format
4. Add animations
5. Test dictionary functionality

### Phase 6: Polish & Testing (1 hour)
1. Fix any layout issues
2. Ensure theme support
3. Test keyboard navigation
4. Test all interactions
5. Verify no regressions

**Total Estimated Time**: 6.5 hours

---

## 🎯 Acceptance Criteria

### Must Have
- [x] Toolbar exists below header with all editing controls
- [x] Header contains only Logo, Title, OCR, Dict, Theme
- [x] OCR opens as modal (not floating panel)
- [x] Dictionary opens as dropdown (not side panel)
- [x] Editor area is full width (no side panels)
- [x] All existing functionality works
- [x] Both themes supported
- [x] No visual regressions

### Nice to Have
- [ ] Smooth animations for all transitions
- [ ] Keyboard shortcuts documented
- [ ] Tooltip hints for new layout
- [ ] User preference for panel style (modal vs dropdown)

### Out of Scope
- Mobile responsive design (future)
- Customizable toolbar (future)
- Draggable panels (future)
- Multiple panel layouts (future)

---

## 🔄 Rollback Plan

If issues arise:
1. Keep old components in `components/legacy/`
2. Feature flag: `USE_NEW_LAYOUT`
3. Easy toggle in App.tsx
4. Can revert in <5 minutes

---

## 📚 References

### Similar Patterns
- **VS Code**: Toolbar below menu bar
- **Notion**: Floating panels as modals
- **Google Docs**: Toolbar with grouped controls
- **Figma**: Utility tools in header, editing tools in toolbar

### Design Systems
- Radix UI: Modal and Dropdown patterns
- Headless UI: Accessible components
- Framer Motion: Animation patterns

---

## 💬 Open Questions

1. **OCR Modal vs Dropdown?**
   - Recommendation: Modal (better focus)
   - Alternative: Dropdown (quicker access)
   - Decision: **Modal** ✅

2. **Dictionary Dropdown vs Modal?**
   - Recommendation: Dropdown (quick lookup)
   - Alternative: Modal (more space)
   - Decision: **Dropdown** ✅

3. **Toolbar sticky or static?**
   - Recommendation: Sticky (always visible)
   - Alternative: Static (more space when scrolled)
   - Decision: **Sticky** ✅

4. **Keep ruler in toolbar or separate?**
   - Current: Ruler is in YaoEditor component
   - Recommendation: Keep separate (different purpose)
   - Decision: **Keep separate** ✅

---

## 🎨 Mockups

### Before
```
┌──────────────────────────────────────────────────────────┐
│ [Logo] YAO V2  [Mode][Grid][IME] [Mẫu][Bố cục][Xuất] [T]│ ← 8 buttons
├──────────────────────────────────────────────────────────┤
│ [Ruler]                                                  │
├──────────────────────────────────────────────────────────┤
│ Editor Content                              │ Dictionary │
│                                             │   Panel    │
│                                             │  (320px)   │
│                                      [OCR]  │            │
└──────────────────────────────────────────────────────────┘
```

### After
```
┌──────────────────────────────────────────────────────────┐
│ [Logo] YAO V2              [OCR] [DICT]              [T] │ ← 3 buttons
├──────────────────────────────────────────────────────────┤
│ [Mode][Grid][IME]                    [Mẫu][Bố cục][Xuất]│ ← 6 buttons
├──────────────────────────────────────────────────────────┤
│ [Ruler]                                                  │
├──────────────────────────────────────────────────────────┤
│ Editor Content (Full Width)                              │
│                                                          │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## ✅ Next Steps

1. **Review this design** with team/stakeholders
2. **Get approval** on layout decisions
3. **Create tasks** in tasks.md
4. **Start implementation** following the plan
5. **Iterate** based on feedback

---

*Document Version: 1.0*  
*Last Updated: 2026-05-31*  
*Author: Kiro AI + User*
