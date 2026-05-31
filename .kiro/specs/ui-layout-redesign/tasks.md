# Implementation Plan: UI Layout Redesign

## Overview

This implementation plan transforms the current single-header layout into a 2-tier layout (Header + Toolbar), converts floating OCR and Dictionary panels into modals, and improves the overall organization and accessibility of the interface. The implementation follows a phased approach: create the new Toolbar component, simplify the Header, convert panels to modals, and polish the final result.

## Tasks

- [ ] 1. Create Toolbar component and infrastructure
  - [ ] 1.1 Create Toolbar component with layout structure
    - Create `src/components/layout/Toolbar.tsx` with left/right sections and dividers
    - Implement responsive layout with flexbox
    - Add CSS variables for theming support
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 1.2 Create reusable HeaderButton component
    - Create `src/components/common/HeaderButton.tsx` for consistent button styling
    - Support icon, label, onClick, aria-label, and loading states
    - Implement hover, active, and focus states with proper transitions
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [ ] 1.3 Add CSS variables for toolbar theming
    - Add `--color-bg-toolbar` variable to theme system
    - Add `--color-border` and `--color-border-light` variables
    - Ensure variables work in both dark and light themes
    - _Requirements: 13.1, 13.2, 13.3_

- [ ] 2. Move editor controls to Toolbar
  - [ ] 2.1 Move WritingMode toggle to Toolbar
    - Extract WritingMode toggle from Header
    - Add to Toolbar left section
    - Maintain existing functionality and state management
    - _Requirements: 3.1, 3.2_

  - [ ] 2.2 Move Grid toggle to Toolbar
    - Extract Grid toggle from Header
    - Add to Toolbar left section after WritingMode
    - Maintain existing functionality
    - _Requirements: 3.1, 3.2_

  - [ ] 2.3 Add visual divider and move IME toggle
    - Add divider component between Grid and IME controls
    - Move IME mode toggle to Toolbar left section after divider
    - Style divider with `--color-border`
    - _Requirements: 3.2, 3.4_

  - [ ] 2.4 Move Template, Layout, and Export to Toolbar right section
    - Extract Template, Layout, and Export buttons from Header
    - Add to Toolbar right section with proper spacing
    - Maintain existing functionality for all buttons
    - _Requirements: 3.1, 3.3_

  - [ ]* 2.5 Write unit tests for Toolbar component
    - Test rendering of all sections and controls
    - Test responsive behavior at different breakpoints
    - Test theme switching
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 3. Checkpoint - Verify Toolbar integration
  - Ensure all tests pass, verify Toolbar displays correctly in both themes, ask the user if questions arise.

- [ ] 4. Simplify Header and add modal trigger buttons
  - [ ] 4.1 Remove editor controls from Header
    - Remove WritingMode, Grid, IME, Template, Layout, and Export from Header
    - Keep only Logo, Title, and ThemeToggle
    - Adjust Header spacing and alignment
    - _Requirements: 2.1, 2.2_

  - [ ] 4.2 Add OCR button to Header
    - Add OCR button to Header right section using HeaderButton component
    - Add camera icon and "OCR" label
    - Implement click handler to open OCR modal (placeholder for now)
    - Add keyboard shortcut Ctrl+Shift+O
    - _Requirements: 2.2, 4.1, 4.6, 7.5_

  - [ ] 4.3 Add Dictionary button to Header
    - Add Dictionary button to Header right section using HeaderButton component
    - Add book icon and "TỪ ĐIỂN" label
    - Implement click handler to open Dictionary modal (placeholder for now)
    - Maintain existing Ctrl+D keyboard shortcut
    - _Requirements: 2.2, 5.1, 5.6, 7.4_

  - [ ] 4.4 Update Header styling and layout
    - Adjust Header height to 64px
    - Update background and border styling
    - Ensure proper spacing between elements
    - _Requirements: 1.1, 2.3, 2.4, 2.5_

  - [ ]* 4.5 Write unit tests for updated Header
    - Test rendering of new button layout
    - Test keyboard shortcuts
    - Test theme support
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 5. Create modal infrastructure
  - [ ] 5.1 Create Modal base component
    - Create `src/components/modals/Modal.tsx` with overlay and content
    - Implement backdrop blur and semi-transparent overlay
    - Add close on Escape key and click outside
    - Implement focus trap mechanism
    - _Requirements: 6.1, 6.2, 6.3, 7.3, 8.3_

  - [ ]* 5.2 Write property test for Modal Escape Key Closure
    - **Property 1: Modal Escape Key Closure**
    - **Validates: Requirements 7.3, 8.2**
    - Test that pressing Escape closes any open modal and returns focus to trigger element
    - _Requirements: 7.3, 8.2_

  - [ ]* 5.3 Write property test for Modal Focus Trap
    - **Property 2: Modal Focus Trap**
    - **Validates: Requirements 8.3, 8.5**
    - Test that Tab cycles focus only within modal and wraps from last to first element
    - _Requirements: 8.3, 8.5_

  - [ ]* 5.4 Write property test for Modal Focus Initialization
    - **Property 3: Modal Focus Initialization**
    - **Validates: Requirements 8.1**
    - Test that focus automatically moves to first input when modal opens
    - _Requirements: 8.1_

  - [ ] 5.5 Add modal animations with Framer Motion
    - Implement entry animation (opacity 0→1, scale 0.95→1, y 20→0)
    - Implement exit animation (opacity 1→0, scale 1→0.95, y 0→20)
    - Use spring physics with stiffness 300 and damping 30
    - _Requirements: 6.4, 6.5, 6.6_

  - [ ]* 5.6 Write property test for Focus Indicator Visibility
    - **Property 4: Focus Indicator Visibility**
    - **Validates: Requirements 8.4**
    - Test that all interactive elements display visible focus indicators
    - _Requirements: 8.4_

  - [ ]* 5.7 Write property test for Button Keyboard Activation
    - **Property 5: Button Keyboard Activation**
    - **Validates: Requirements 7.2**
    - Test that Enter or Space activates focused buttons
    - _Requirements: 7.2_

- [ ] 6. Checkpoint - Verify modal infrastructure
  - Ensure all tests pass, verify modal animations and focus management work correctly, ask the user if questions arise.

- [ ] 7. Convert OCR panel to modal
  - [ ] 7.1 Create OCRModal component
    - Create `src/components/modals/OCRModal.tsx` using Modal base component
    - Set dimensions to 480px × 600px
    - Add modal title "NHẬN DẠNG KÝ TỰ (OCR)"
    - _Requirements: 4.2, 4.3_

  - [ ] 7.2 Migrate OCR functionality to modal
    - Copy image upload, language selector, and recognition logic from OCRPanel
    - Implement drag & drop support
    - Implement paste from clipboard (Ctrl+V)
    - Add progress indicator and confidence meter
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ] 7.3 Add OCR results display and actions
    - Display recognition results with confidence percentage
    - Add "Copy to clipboard" button
    - Add "New Image" button to reset
    - Maintain Dexie caching for results
    - _Requirements: 15.5, 15.6_

  - [ ] 7.4 Implement lazy loading for Tesseract.js
    - Load Tesseract.js only when OCR modal opens
    - Show loading indicator during library initialization
    - Handle loading errors gracefully
    - _Requirements: 17.2_

  - [ ]* 7.5 Write property test for ARIA Label Completeness
    - **Property 6: ARIA Label Completeness**
    - **Validates: Requirements 9.1**
    - Test that all buttons have aria-label attributes
    - _Requirements: 9.1_

  - [ ]* 7.6 Write property test for Modal ARIA Attributes
    - **Property 7: Modal ARIA Attributes**
    - **Validates: Requirements 9.2**
    - Test that modals have role="dialog" and aria-modal="true"
    - _Requirements: 9.2_

  - [ ]* 7.7 Write unit tests for OCRModal
    - Test image upload and drag & drop
    - Test language selection
    - Test OCR processing workflow
    - Test copy to clipboard functionality
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

- [ ] 8. Convert Dictionary panel to modal
  - [ ] 8.1 Create DictionaryModal component
    - Create `src/components/modals/DictionaryModal.tsx` using Modal base component
    - Set dimensions to 600px × 700px
    - Add modal title "TỪ ĐIỂN"
    - _Requirements: 5.2, 5.3_

  - [ ] 8.2 Migrate Dictionary tabs to modal
    - Copy all tabs (Search, History, Details, Handwriting, Override) from DictionaryPanel
    - Maintain tab navigation and state management
    - Ensure all existing functionality is preserved
    - _Requirements: 5.3, 16.1_

  - [ ] 8.3 Implement Dictionary search functionality
    - Add search input with autocomplete
    - Display matching results
    - Show character details with AI explanations
    - _Requirements: 16.2, 16.3, 16.4_

  - [ ] 8.4 Add search history management
    - Maintain search history limited to 20 items
    - Display history in History tab
    - Allow clearing history
    - _Requirements: 16.5_

  - [ ] 8.5 Implement handwriting recognition tab
    - Lazy load handwriting recognition library on tab switch
    - Maintain existing handwriting canvas functionality
    - _Requirements: 16.6, 17.4_

  - [ ]* 8.6 Write property test for Modal Screen Reader Announcements
    - **Property 8: Modal Screen Reader Announcements**
    - **Validates: Requirements 9.3, 9.4**
    - Test that opening/closing modals announces to screen readers
    - _Requirements: 9.3, 9.4_

  - [ ]* 8.7 Write property test for Toggle Button State Announcements
    - **Property 9: Toggle Button State Announcements**
    - **Validates: Requirements 9.5**
    - Test that toggle button state changes are announced to screen readers
    - _Requirements: 9.5_

  - [ ]* 8.8 Write property test for Dictionary Search Results
    - **Property 17: Dictionary Search Results**
    - **Validates: Requirements 16.3**
    - Test that character searches return and display matching results
    - _Requirements: 16.3_

  - [ ]* 8.9 Write unit tests for DictionaryModal
    - Test all tabs render correctly
    - Test search functionality
    - Test history management
    - Test handwriting recognition
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_

- [ ] 9. Checkpoint - Verify modal conversions
  - Ensure all tests pass, verify OCR and Dictionary modals work correctly with all features, ask the user if questions arise.

- [ ] 10. Implement theme support for new components
  - [ ] 10.1 Add CSS variables for all new components
    - Ensure Header, Toolbar, and modals use CSS variables for colors
    - Add variables for modal overlay, borders, and backgrounds
    - Document all new CSS variables
    - _Requirements: 13.1_

  - [ ]* 10.2 Write property test for CSS Variable Color Usage
    - **Property 10: CSS Variable Color Usage**
    - **Validates: Requirements 13.1**
    - Test that all components use CSS variables instead of hardcoded colors
    - _Requirements: 13.1_

  - [ ] 10.3 Test dark theme styling
    - Verify Header gradient and transparency
    - Verify Toolbar background color
    - Verify modal backdrop and content styling
    - _Requirements: 13.2_

  - [ ] 10.4 Test light theme styling
    - Verify Header light theme colors
    - Verify Toolbar light theme colors
    - Verify modal light theme styling
    - _Requirements: 13.3_

  - [ ]* 10.5 Write property test for Theme Color Application
    - **Property 11: Theme Color Application**
    - **Validates: Requirements 13.2, 13.3, 13.5**
    - Test that theme changes update all components without page reload
    - _Requirements: 13.2, 13.3, 13.5_

- [ ] 11. Implement responsive behavior
  - [ ] 11.1 Add desktop responsive styles (≥1280px)
    - Display all button text labels
    - Center modals with specified dimensions
    - Maintain full 2-tier layout
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ] 11.2 Add tablet responsive styles (768px - 1279px)
    - Show toolbar buttons with icons only
    - Set modal width to 90% of viewport
    - Maintain 2-tier structure
    - _Requirements: 11.1, 11.2, 11.3_

  - [ ] 11.3 Add mobile responsive styles (<768px)
    - Add hamburger menu to Header
    - Enable horizontal scrolling for Toolbar
    - Display modals in full-screen mode
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ]* 11.4 Write unit tests for responsive behavior
    - Test desktop breakpoint rendering
    - Test tablet breakpoint rendering
    - Test mobile breakpoint rendering
    - _Requirements: 10.1, 10.2, 10.3, 11.1, 11.2, 11.3, 12.1, 12.2, 12.3_

- [ ] 12. Implement performance optimizations
  - [ ] 12.1 Optimize modal animations
    - Use GPU-accelerated properties (transform, opacity)
    - Avoid layout thrashing
    - Apply will-change only during active animations
    - _Requirements: 18.1, 18.2, 18.3_

  - [ ]* 12.2 Write property test for Modal Opening Performance
    - **Property 18: Modal Opening Performance**
    - **Validates: Requirements 17.1**
    - Test that modals open within 200ms
    - _Requirements: 17.1_

  - [ ]* 12.3 Write property test for GPU-Accelerated Animation Properties
    - **Property 20: GPU-Accelerated Animation Properties**
    - **Validates: Requirements 18.1**
    - Test that animations use only transform and opacity
    - _Requirements: 18.1_

  - [ ]* 12.4 Write property test for Will-Change Property Usage
    - **Property 21: Will-Change Property Usage**
    - **Validates: Requirements 18.3**
    - Test that will-change is only applied to actively animating elements
    - _Requirements: 18.3_

  - [ ] 12.5 Implement memory management
    - Unmount modal content when closed
    - Clear OCR image data after processing
    - Limit dictionary history to 20 items
    - Release event listeners for unused modals
    - _Requirements: 17.5, 19.1, 19.2, 19.3, 19.4, 19.5_

  - [ ]* 12.6 Write property test for Modal Content Unmounting
    - **Property 19: Modal Content Unmounting**
    - **Validates: Requirements 17.5, 19.1**
    - Test that modal content is unmounted when closed
    - _Requirements: 17.5, 19.1_

  - [ ]* 12.7 Write property test for Button Hover Timing
    - **Property 12: Button Hover Timing**
    - **Validates: Requirements 14.1**
    - Test that hover styles apply within 150ms
    - _Requirements: 14.1_

  - [ ]* 12.8 Write property test for Button Hover Transition Timing
    - **Property 22: Button Hover Transition Timing**
    - **Validates: Requirements 18.5**
    - Test that hover transitions complete within 150ms
    - _Requirements: 18.5_

- [ ] 13. Checkpoint - Verify performance and responsiveness
  - Ensure all tests pass, verify animations are smooth, verify responsive behavior at all breakpoints, ask the user if questions arise.

- [ ] 14. Polish and final integration
  - [ ] 14.1 Update App.tsx to integrate new layout
    - Add Toolbar component below Header
    - Wire up modal state management
    - Remove old floating panel components
    - Update layout calculations for new header height (112px)
    - _Requirements: 1.1, 1.5, 20.5_

  - [ ] 14.2 Implement button interaction states
    - Add hover transitions (150ms ease-out)
    - Add click scale transformation (0.98)
    - Add focus ring animations
    - Add loading spinner states
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [ ]* 14.3 Write property test for Button Click Scale Transform
    - **Property 13: Button Click Scale Transform**
    - **Validates: Requirements 14.2**
    - Test that clicking applies scale(0.98) transformation
    - _Requirements: 14.2_

  - [ ]* 14.4 Write property test for Button Focus Ring Display
    - **Property 14: Button Focus Ring Display**
    - **Validates: Requirements 14.3**
    - Test that focused buttons display focus ring
    - _Requirements: 14.3_

  - [ ]* 14.5 Write property test for Button Active State Styling
    - **Property 15: Button Active State Styling**
    - **Validates: Requirements 14.4**
    - Test that active buttons apply primary color accent
    - _Requirements: 14.4_

  - [ ]* 14.6 Write property test for Button Loading State Indicator
    - **Property 16: Button Loading State Indicator**
    - **Validates: Requirements 14.5**
    - Test that processing buttons display loading spinner
    - _Requirements: 14.5_

  - [ ]* 14.7 Write property test for Modal Resource Cleanup
    - **Property 23: Modal Resource Cleanup**
    - **Validates: Requirements 19.4, 19.5**
    - Test that unused modals release resources and event listeners
    - _Requirements: 19.4, 19.5_

  - [ ] 14.8 Remove old floating panel components
    - Delete `src/components/ocr/OCRPanel.tsx`
    - Delete `src/components/dictionary/DictionaryPanel.tsx`
    - Remove floating panel trigger buttons
    - Clean up unused imports and styles
    - _Requirements: 20.5_

  - [ ] 14.9 Add Toolbar slide-down animation
    - Implement slide down from top on initial load
    - Duration: 300ms with cubic-bezier(0.4, 0, 0.2, 1) easing
    - _Requirements: 6.4, 6.5_

  - [ ]* 14.10 Write integration tests for complete layout
    - Test OCR workflow (upload → process → copy)
    - Test Dictionary workflow (search → details → copy)
    - Test theme switching with new layout
    - Test keyboard navigation through entire interface
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 15. Final checkpoint - Complete verification
  - Ensure all tests pass, verify all features work correctly, test in both themes, test at all breakpoints, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript and React with Framer Motion for animations
- All components must support both dark and light themes using CSS variables
- Focus management and keyboard navigation are critical for accessibility
- Performance optimizations ensure smooth animations and efficient memory usage
- The migration removes floating panels and creates a cleaner, more organized interface

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "2.1", "2.2"] },
    { "id": 2, "tasks": ["2.3", "2.4", "2.5"] },
    { "id": 3, "tasks": ["4.1", "4.2", "4.3"] },
    { "id": 4, "tasks": ["4.4", "4.5", "5.1"] },
    { "id": 5, "tasks": ["5.2", "5.3", "5.4", "5.5", "5.6", "5.7"] },
    { "id": 6, "tasks": ["7.1"] },
    { "id": 7, "tasks": ["7.2", "7.3"] },
    { "id": 8, "tasks": ["7.4", "7.5", "7.6", "7.7"] },
    { "id": 9, "tasks": ["8.1"] },
    { "id": 10, "tasks": ["8.2", "8.3"] },
    { "id": 11, "tasks": ["8.4", "8.5", "8.6", "8.7", "8.8", "8.9"] },
    { "id": 12, "tasks": ["10.1", "10.2"] },
    { "id": 13, "tasks": ["10.3", "10.4", "10.5"] },
    { "id": 14, "tasks": ["11.1", "11.2", "11.3", "11.4"] },
    { "id": 15, "tasks": ["12.1", "12.2", "12.3", "12.4"] },
    { "id": 16, "tasks": ["12.5", "12.6", "12.7", "12.8"] },
    { "id": 17, "tasks": ["14.1"] },
    { "id": 18, "tasks": ["14.2", "14.3", "14.4", "14.5", "14.6", "14.7"] },
    { "id": 19, "tasks": ["14.8", "14.9", "14.10"] }
  ]
}
```
