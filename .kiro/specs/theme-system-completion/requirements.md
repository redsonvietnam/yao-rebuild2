# Requirements: Theme System Completion

## 1. Functional Requirements

### 1.1 CSS Variables Extension

**Description**: Mở rộng hệ thống CSS variables để hỗ trợ tất cả các component types

**Acceptance Criteria**:
- CSS variables mới được thêm vào `:root` cho dark theme
- CSS variables mới được thêm vào `html.light` cho light theme
- Tất cả variables tuân theo naming convention `--color-{category}-{variant}`
- Variables bao gồm: modal backgrounds, dropdown backgrounds, panel backgrounds, ruler-specific colors
- Không có variables nào bị xóa hoặc thay đổi giá trị hiện tại

**Priority**: High

### 1.2 ExportMenu Theme Support

**Description**: Cập nhật ExportMenu component để sử dụng CSS variables

**Acceptance Criteria**:
- Tất cả hardcoded Tailwind color classes được thay thế bằng CSS variables
- Dropdown menu background sử dụng `var(--color-dropdown-bg)`
- Text colors sử dụng `var(--color-text-*)` variables
- Hover states được implement bằng event handlers
- Export progress overlay sử dụng `var(--color-modal-backdrop)`
- Component render đúng trong cả dark và light theme
- Transitions mượt mà (200ms) khi chuyển theme

**Priority**: High

### 1.3 LayoutModal Theme Support

**Description**: Cập nhật LayoutModal component để sử dụng CSS variables

**Acceptance Criteria**:
- Modal backdrop sử dụng `var(--color-modal-backdrop)`
- Modal background sử dụng `var(--color-modal-bg)`
- Tất cả borders sử dụng `var(--color-border)`
- Input fields sử dụng `var(--color-bg-tertiary)` cho background
- Text colors phân biệt rõ ràng giữa primary, secondary, tertiary
- Preview section colors update theo theme
- Buttons có hover states với CSS variables
- Component render đúng trong cả dark và light theme

**Priority**: High

### 1.4 ModeToggle Theme Support

**Description**: Cập nhật ModeToggle component để sử dụng CSS variables

**Acceptance Criteria**:
- Toggle container background sử dụng `var(--color-bg-secondary)`
- Active button sử dụng `var(--color-bg-active)`
- Inactive button text sử dụng `var(--color-text-tertiary)`
- Hover states được implement với event handlers
- Grid toggle button colors update theo theme
- IME toggle button colors update theo theme
- Component render đúng trong cả dark và light theme

**Priority**: High

### 1.5 CandidateBar Theme Support

**Description**: Cập nhật CandidateBar component để sử dụng CSS variables

**Acceptance Criteria**:
- Candidate bar background sử dụng `var(--color-dropdown-bg)`
- Header background sử dụng `var(--color-bg-hover)`
- Selected candidate sử dụng `var(--color-primary)` cho background
- Unselected candidates có hover state với `var(--color-bg-hover)`
- Text colors có contrast tốt trong cả hai theme
- Footer border sử dụng `var(--color-border)`
- Component render đúng trong cả dark và light theme

**Priority**: High

### 1.6 Ruler Theme Support

**Description**: Cập nhật Ruler component để sử dụng CSS variables

**Acceptance Criteria**:
- Ruler background sử dụng `var(--color-ruler-bg)`
- Ruler border sử dụng `var(--color-ruler-border)`
- Tick marks sử dụng `var(--color-ruler-tick)`
- Major ticks (5cm intervals) sử dụng `var(--color-ruler-tick-major)`
- Tick labels sử dụng `var(--color-ruler-text)`
- Margin overlays sử dụng `var(--color-ruler-overlay)`
- Drag handles update colors theo theme
- Component render đúng trong cả dark và light theme

**Priority**: Medium

### 1.7 DictionaryPanel Theme Support

**Description**: Cập nhật DictionaryPanel component để sử dụng CSS variables

**Acceptance Criteria**:
- Panel background sử dụng `var(--color-panel-bg)`
- All borders sử dụng `var(--color-border)`
- Tab active state sử dụng `var(--color-primary)`
- Search input background sử dụng `var(--color-bg-secondary)`
- Result items có hover state với `var(--color-bg-hover)`
- Text colors phân biệt rõ ràng (primary, secondary, tertiary)
- AI explanation section colors update theo theme
- Component render đúng trong cả dark và light theme

**Priority**: Medium

### 1.8 OCRPanel Theme Support

**Description**: Cập nhật OCRPanel component để sử dụng CSS variables

**Acceptance Criteria**:
- Panel background sử dụng `var(--color-panel-bg)`
- All borders sử dụng `var(--color-border)`
- Buttons sử dụng appropriate CSS variables
- Text colors có contrast tốt
- Component render đúng trong cả dark và light theme

**Priority**: Medium

### 1.9 NotificationCard Theme Support

**Description**: Cập nhật NotificationCard component để sử dụng CSS variables

**Acceptance Criteria**:
- Notification backgrounds update theo theme
- Text colors có contrast tốt trong cả hai theme
- Icon colors remain vibrant và distinguishable
- Progress bar colors update theo theme
- Gradient backgrounds work trong cả hai theme
- Component render đúng trong cả dark và light theme

**Priority**: Low

### 1.10 Header Theme Support

**Description**: Implement Header component với theme support từ đầu

**Acceptance Criteria**:
- Component sử dụng CSS variables cho tất cả colors
- Không có hardcoded Tailwind color classes
- Component render đúng trong cả dark và light theme
- Tuân thủ design system guidelines

**Priority**: Low (component chưa được implement)

### 1.11 HandwritingCanvas Theme Support

**Description**: Cập nhật HandwritingCanvas component để sử dụng CSS variables

**Acceptance Criteria**:
- Canvas background sử dụng appropriate CSS variable
- Stroke colors có contrast tốt với background
- Control buttons sử dụng CSS variables
- Component render đúng trong cả dark và light theme

**Priority**: Low

### 1.12 OverrideManager Theme Support

**Description**: Cập nhật OverrideManager component để sử dụng CSS variables

**Acceptance Criteria**:
- All backgrounds sử dụng CSS variables
- Text colors có contrast tốt
- Buttons và inputs sử dụng CSS variables
- Component render đúng trong cả dark và light theme

**Priority**: Low

### 1.13 TemplateModal Theme Support

**Description**: Cập nhật TemplateModal component để sử dụng CSS variables

**Acceptance Criteria**:
- Modal backdrop sử dụng `var(--color-modal-backdrop)`
- Modal background sử dụng `var(--color-modal-bg)`
- All borders và text colors sử dụng CSS variables
- Component render đúng trong cả dark và light theme

**Priority**: Low

## 2. Non-Functional Requirements

### 2.1 Performance

**Description**: Theme toggle phải nhanh và mượt mà

**Acceptance Criteria**:
- Theme toggle completes trong < 100ms
- Transitions mượt mà với 200ms duration
- Không có layout shifts khi toggle theme
- Không có flickering hoặc visual glitches
- Memory usage không tăng đáng kể

**Priority**: High

### 2.2 Accessibility (WCAG AA Compliance)

**Description**: Tất cả text/background pairs phải có contrast ratio đủ

**Acceptance Criteria**:
- Normal text (< 18pt): contrast ratio ≥ 4.5:1
- Large text (≥ 18pt): contrast ratio ≥ 3:1
- Interactive elements có visible focus indicators
- Color không phải là cách duy nhất để convey information
- Screen readers announce theme changes
- Keyboard navigation works trong cả hai theme

**Priority**: High

### 2.3 Browser Compatibility

**Description**: Theme system hoạt động trên tất cả modern browsers

**Acceptance Criteria**:
- Chrome 49+ fully supported
- Firefox 31+ fully supported
- Safari 9.1+ fully supported
- Edge 15+ fully supported
- CSS variables render correctly
- Transitions work smoothly
- No browser-specific bugs

**Priority**: High

### 2.4 Maintainability

**Description**: Code dễ maintain và extend

**Acceptance Criteria**:
- Tất cả components follow consistent pattern
- CSS variables có naming convention rõ ràng
- Không có code duplication
- Comments giải thích complex logic
- TypeScript types cho theme-related code
- Documentation đầy đủ

**Priority**: Medium

### 2.5 Theme Persistence

**Description**: Theme preference được lưu và restore

**Acceptance Criteria**:
- Theme preference lưu vào localStorage
- Theme restore khi page reload
- Fallback to system preference nếu không có saved theme
- Handle localStorage errors gracefully
- No console errors khi localStorage unavailable

**Priority**: Medium

## 3. Technical Requirements

### 3.1 CSS Variables Structure

**Description**: CSS variables phải được organize tốt

**Acceptance Criteria**:
- Variables grouped by category (bg, text, border, etc.)
- Naming convention: `--color-{category}-{variant}`
- All variables documented với comments
- Dark theme trong `:root`
- Light theme trong `html.light`
- No unused variables

**Priority**: High

### 3.2 Component Refactoring Pattern

**Description**: Tất cả components follow same refactoring pattern

**Acceptance Criteria**:
- Replace hardcoded classes với inline styles
- Use CSS variables via `var(--color-*)`
- Add `transition-colors` class
- Implement hover handlers với event listeners
- Remove all `dark:` và `light:` Tailwind prefixes
- Consistent code style

**Priority**: High

### 3.3 TypeScript Type Safety

**Description**: Theme-related code có proper TypeScript types

**Acceptance Criteria**:
- Theme type: `'light' | 'dark'`
- CSS variable names có type definitions (for documentation)
- Component props properly typed
- No `any` types
- Strict mode enabled

**Priority**: Medium

### 3.4 Testing Infrastructure

**Description**: Adequate testing cho theme system

**Acceptance Criteria**:
- Unit tests cho ThemeContext
- Visual regression tests cho components
- Accessibility tests (contrast ratios)
- Performance tests (toggle speed)
- Browser compatibility tests

**Priority**: Medium

## 4. Constraints

### 4.1 No Breaking Changes

**Description**: Theme updates không được break existing functionality

**Acceptance Criteria**:
- All existing features continue to work
- No visual regressions
- No performance degradation
- Backward compatible với existing code

**Priority**: Critical

### 4.2 No External Dependencies

**Description**: Không thêm external libraries cho theme system

**Acceptance Criteria**:
- Use existing React, Framer Motion, Tailwind
- No new npm packages
- Pure CSS variables approach
- No CSS-in-JS libraries

**Priority**: High

### 4.3 Incremental Migration

**Description**: Components có thể được migrate từng cái một

**Acceptance Criteria**:
- CSS variables không break existing components
- Partially migrated state is acceptable
- Can test each component independently
- Rollback individual components if needed

**Priority**: High

## 5. Success Metrics

### 5.1 Code Quality Metrics

- **Zero** hardcoded Tailwind color classes in migrated components
- **100%** of components use CSS variables
- **Zero** console errors or warnings
- **< 5%** increase in bundle size

### 5.2 Performance Metrics

- Theme toggle: **< 100ms**
- Transition duration: **200ms** (consistent)
- No layout shifts: **CLS = 0**
- Memory usage: **< 5% increase**

### 5.3 Accessibility Metrics

- Contrast ratio: **≥ 4.5:1** for all text
- Keyboard navigation: **100%** functional
- Screen reader: **100%** compatible
- WCAG AA: **Full compliance**

### 5.4 User Experience Metrics

- Theme toggle: **Smooth and instant**
- Visual consistency: **100%** across components
- No flickering: **Zero instances**
- User satisfaction: **Positive feedback**

## 6. Out of Scope

The following are explicitly **NOT** included in this spec:

- ❌ Adding new themes beyond dark/light (e.g., high contrast, custom themes)
- ❌ User-customizable color schemes
- ❌ Automatic theme switching based on time of day
- ❌ Theme animations beyond simple transitions
- ❌ Refactoring non-color-related Tailwind classes
- ❌ Redesigning component layouts or structures
- ❌ Adding new features to components
- ❌ Changing component behavior or logic

## 7. Dependencies

### 7.1 Internal Dependencies

- ThemeContext (existing)
- ThemeToggle component (existing)
- CSS variables in index.css (existing, will be extended)

### 7.2 External Dependencies

- React ^18.x
- Framer Motion ^10.x
- Tailwind CSS ^3.x
- TypeScript ^5.x

### 7.3 Development Dependencies

- ESLint (for code quality)
- Prettier (for formatting)
- Testing libraries (for verification)

## 8. Risks and Mitigation

### 8.1 Risk: Visual Regressions

**Probability**: Medium  
**Impact**: High  
**Mitigation**: 
- Thorough visual testing before/after
- Screenshot comparisons
- Incremental rollout
- Easy rollback strategy

### 8.2 Risk: Performance Degradation

**Probability**: Low  
**Impact**: Medium  
**Mitigation**:
- Performance testing before/after
- Monitor theme toggle speed
- Optimize transitions
- Use GPU-accelerated properties

### 8.3 Risk: Accessibility Issues

**Probability**: Medium  
**Impact**: High  
**Mitigation**:
- Contrast ratio testing
- Screen reader testing
- Keyboard navigation testing
- WCAG compliance verification

### 8.4 Risk: Browser Compatibility Issues

**Probability**: Low  
**Impact**: Medium  
**Mitigation**:
- Test on all target browsers
- Use well-supported CSS features
- Provide fallbacks if needed
- Monitor browser console for errors

## 9. Acceptance Criteria Summary

The theme system completion is considered **COMPLETE** when:

✅ All 13 components use CSS variables  
✅ Zero hardcoded Tailwind color classes remain  
✅ WCAG AA contrast compliance verified  
✅ Theme toggle < 100ms  
✅ Smooth transitions (200ms)  
✅ No visual regressions  
✅ All tests pass  
✅ Documentation complete  
✅ Code review approved  
✅ User acceptance testing passed  

## 10. Timeline Estimate

- **Week 1**: Foundation + Core Components (ModeToggle, ExportMenu, LayoutModal)
- **Week 2**: High Priority Components (CandidateBar, Ruler)
- **Week 3**: Medium Priority Components (DictionaryPanel, OCRPanel)
- **Week 4**: Low Priority Components + Testing + Polish

**Total Estimated Time**: 4 weeks
