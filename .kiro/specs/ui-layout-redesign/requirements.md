# Requirements Document

## Introduction

This document specifies the requirements for the UI Layout Redesign feature, which transforms the current single-header layout into a 2-tier layout (Header + Toolbar), converts floating OCR and Dictionary panels into modals, and improves the overall organization and accessibility of the interface.

## Glossary

- **Header**: The top-level navigation bar containing branding and global actions (Tier 1)
- **Toolbar**: The secondary navigation bar containing editor-specific controls (Tier 2)
- **OCR_Modal**: A centered overlay dialog for optical character recognition functionality
- **Dictionary_Modal**: A centered overlay dialog for dictionary lookup functionality
- **Writing_Mode**: The text direction setting (horizontal or vertical)
- **Grid_Toggle**: Control for enabling/disabling the grid overlay
- **IME_Mode**: Input method editor mode toggle (Hán-Dao)
- **Modal_Overlay**: The semi-transparent backdrop behind modal dialogs
- **Focus_Trap**: Mechanism that keeps keyboard focus within a modal dialog

## Requirements

### Requirement 1: Two-Tier Layout Structure

**User Story:** As a user, I want a clear visual hierarchy between global and editor-specific controls, so that I can quickly locate the features I need.

#### Acceptance Criteria

1. THE System SHALL display a Header component at the top of the application with a height of 64px
2. THE System SHALL display a Toolbar component immediately below the Header with a height of 48px
3. THE Header SHALL contain branding elements and global action buttons
4. THE Toolbar SHALL contain editor-specific controls and document actions
5. THE combined header area SHALL have a total height of 112px

### Requirement 2: Header Component Structure

**User Story:** As a user, I want quick access to OCR, Dictionary, and theme controls from the header, so that I can access these features without navigating away from my work.

#### Acceptance Criteria

1. THE Header SHALL display a logo and title in the left section
2. THE Header SHALL display OCR button, Dictionary button, and Theme toggle in the right section
3. THE Header SHALL use a background color of `var(--color-bg-primary)` with appropriate transparency
4. THE Header SHALL have a bottom border of 1px solid `var(--color-border)`
5. THE Header SHALL maintain consistent styling across dark and light themes

### Requirement 3: Toolbar Component Structure

**User Story:** As a user, I want editor controls organized logically in a dedicated toolbar, so that I can efficiently manage my document settings.

#### Acceptance Criteria

1. THE Toolbar SHALL display Writing Mode toggle and Grid toggle in the left section
2. THE Toolbar SHALL display IME mode toggle after a visual divider in the left section
3. THE Toolbar SHALL display Template, Layout, and Export buttons in the right section
4. THE Toolbar SHALL use visual dividers to separate logical groups of controls
5. THE Toolbar SHALL use a background color of `var(--color-bg-toolbar)`

### Requirement 4: OCR Button and Modal

**User Story:** As a user, I want to access OCR functionality through a modal dialog, so that I can recognize text from images without losing my editor context.

#### Acceptance Criteria

1. WHEN a user clicks the OCR button in the Header THEN the System SHALL open the OCR_Modal
2. THE OCR_Modal SHALL be centered on screen with dimensions of 480px × 600px
3. THE OCR_Modal SHALL contain image upload controls, language selector, and recognition results
4. WHEN a user presses the Escape key while the OCR_Modal is open THEN the System SHALL close the modal
5. WHEN a user clicks outside the OCR_Modal THEN the System SHALL close the modal
6. WHEN a user presses Ctrl+Shift+O THEN the System SHALL open the OCR_Modal

### Requirement 5: Dictionary Button and Modal

**User Story:** As a user, I want to access dictionary functionality through a modal dialog, so that I can look up characters without losing my editor context.

#### Acceptance Criteria

1. WHEN a user clicks the Dictionary button in the Header THEN the System SHALL open the Dictionary_Modal
2. THE Dictionary_Modal SHALL be centered on screen with dimensions of 600px × 700px
3. THE Dictionary_Modal SHALL contain tabs for Search, History, Details, Handwriting, and Override
4. WHEN a user presses the Escape key while the Dictionary_Modal is open THEN the System SHALL close the modal
5. WHEN a user clicks outside the Dictionary_Modal THEN the System SHALL close the modal
6. WHEN a user presses Ctrl+D THEN the System SHALL open the Dictionary_Modal

### Requirement 6: Modal Visual Design

**User Story:** As a user, I want modals to have a professional appearance with smooth animations, so that the interface feels polished and responsive.

#### Acceptance Criteria

1. THE Modal_Overlay SHALL have a background color of `rgba(0, 0, 0, 0.6)` with backdrop blur of 8px
2. THE modal content SHALL have a background color of `var(--color-bg-secondary)`
3. THE modal content SHALL have a border of 1px solid `var(--color-border)` with 16px border radius
4. WHEN a modal opens THEN the System SHALL animate from opacity 0 to 1, scale 0.95 to 1, and y-offset 20px to 0px
5. WHEN a modal closes THEN the System SHALL animate to opacity 0, scale 0.95, and y-offset 20px
6. THE modal animations SHALL use spring physics with stiffness 300 and damping 30

### Requirement 7: Keyboard Navigation

**User Story:** As a user, I want to navigate the interface using keyboard shortcuts, so that I can work efficiently without using the mouse.

#### Acceptance Criteria

1. WHEN a user presses Tab THEN the System SHALL move focus to the next interactive element
2. WHEN a user presses Enter or Space on a focused button THEN the System SHALL activate that button
3. WHEN a user presses Escape while a modal is open THEN the System SHALL close the modal
4. WHEN a user presses Ctrl+D THEN the System SHALL open the Dictionary_Modal
5. WHEN a user presses Ctrl+Shift+O THEN the System SHALL open the OCR_Modal

### Requirement 8: Focus Management

**User Story:** As a user, I want keyboard focus to be managed intelligently when modals open and close, so that I can navigate efficiently with the keyboard.

#### Acceptance Criteria

1. WHEN a modal opens THEN the System SHALL move focus to the first input element within the modal
2. WHEN a modal closes THEN the System SHALL return focus to the button that triggered the modal
3. WHILE a modal is open THE System SHALL trap keyboard focus within the modal
4. THE System SHALL display visible focus indicators on all interactive elements
5. WHEN a user presses Tab while focused on the last element in a modal THEN the System SHALL move focus to the first element in the modal

### Requirement 9: Screen Reader Support

**User Story:** As a user with visual impairments, I want screen reader support for all interface elements, so that I can use the application effectively.

#### Acceptance Criteria

1. THE System SHALL provide `aria-label` attributes for all buttons
2. THE modal dialogs SHALL have `role="dialog"` and `aria-modal="true"` attributes
3. WHEN a modal opens THEN the System SHALL announce the modal title to screen readers
4. WHEN a modal closes THEN the System SHALL announce the closure to screen readers
5. THE System SHALL announce state changes for toggle buttons to screen readers

### Requirement 10: Responsive Behavior - Desktop

**User Story:** As a desktop user, I want the full interface with all labels and features visible, so that I can access all functionality easily.

#### Acceptance Criteria

1. WHEN the viewport width is 1280px or greater THEN the System SHALL display all button text labels
2. WHEN the viewport width is 1280px or greater THEN the System SHALL center modals with their specified dimensions
3. WHEN the viewport width is 1280px or greater THEN the System SHALL display the full 2-tier layout structure

### Requirement 11: Responsive Behavior - Tablet

**User Story:** As a tablet user, I want the interface to adapt to my screen size, so that I can use the application comfortably on my device.

#### Acceptance Criteria

1. WHEN the viewport width is between 768px and 1279px THEN the System SHALL display toolbar buttons with icons only
2. WHEN the viewport width is between 768px and 1279px THEN the System SHALL set modal width to 90% of viewport width
3. WHEN the viewport width is between 768px and 1279px THEN the System SHALL maintain the 2-tier layout structure

### Requirement 12: Responsive Behavior - Mobile

**User Story:** As a mobile user, I want the interface to be optimized for small screens, so that I can use the application on my phone.

#### Acceptance Criteria

1. WHEN the viewport width is less than 768px THEN the System SHALL display a hamburger menu in the Header
2. WHEN the viewport width is less than 768px THEN the System SHALL enable horizontal scrolling for the Toolbar
3. WHEN the viewport width is less than 768px THEN the System SHALL display modals in full-screen mode

### Requirement 13: Theme Support

**User Story:** As a user, I want all new components to support both dark and light themes, so that I can use my preferred visual style.

#### Acceptance Criteria

1. THE System SHALL use CSS variables for all color values in Header, Toolbar, and modals
2. WHEN the theme is dark THEN the System SHALL apply dark theme color values to all components
3. WHEN the theme is light THEN the System SHALL apply light theme color values to all components
4. THE System SHALL maintain visual consistency across all components in both themes
5. WHEN the user toggles the theme THEN the System SHALL update all components without page reload

### Requirement 14: Button Interaction States

**User Story:** As a user, I want visual feedback when I interact with buttons, so that I know my actions are being registered.

#### Acceptance Criteria

1. WHEN a user hovers over a button THEN the System SHALL apply hover styles within 150ms
2. WHEN a user clicks a button THEN the System SHALL apply scale transformation to 0.98
3. WHEN a button receives keyboard focus THEN the System SHALL display a focus ring
4. WHEN a button is in an active state THEN the System SHALL apply primary color accent
5. WHEN a button is processing an action THEN the System SHALL display a loading spinner

### Requirement 15: OCR Modal Functionality

**User Story:** As a user, I want to upload images and recognize text within the OCR modal, so that I can extract text from images.

#### Acceptance Criteria

1. THE OCR_Modal SHALL support drag and drop for image upload
2. THE OCR_Modal SHALL support paste from clipboard using Ctrl+V
3. THE OCR_Modal SHALL provide a language selector with options for CHỮ HÁN, TIẾNG VIỆT, and TIẾNG ANH
4. WHEN OCR processing is in progress THEN the System SHALL display a progress indicator
5. WHEN OCR processing completes THEN the System SHALL display recognition results with confidence percentage
6. THE OCR_Modal SHALL provide a button to copy results to clipboard

### Requirement 16: Dictionary Modal Functionality

**User Story:** As a user, I want to search for characters and view detailed information within the Dictionary modal, so that I can learn about characters while writing.

#### Acceptance Criteria

1. THE Dictionary_Modal SHALL display tabs for Search, History, Details, Handwriting, and Override
2. THE Dictionary_Modal SHALL provide a search input with autocomplete functionality
3. WHEN a user searches for a character THEN the System SHALL display matching results
4. THE Dictionary_Modal SHALL display character details including AI explanations
5. THE Dictionary_Modal SHALL maintain a search history limited to 20 items
6. THE Dictionary_Modal SHALL support handwriting recognition for character input

### Requirement 17: Performance - Modal Loading

**User Story:** As a user, I want modals to open quickly, so that I can access features without waiting.

#### Acceptance Criteria

1. WHEN a user opens a modal THEN the System SHALL display the modal within 200ms
2. THE System SHALL lazy load Tesseract.js only when the OCR_Modal opens
3. THE System SHALL pre-load dictionary data during application initialization
4. WHEN a user switches to the Handwriting tab THEN the System SHALL load the recognition library
5. WHEN a modal closes THEN the System SHALL unmount modal content to free memory

### Requirement 18: Performance - Animation

**User Story:** As a user, I want smooth animations that don't cause lag, so that the interface feels responsive.

#### Acceptance Criteria

1. THE System SHALL use GPU-accelerated properties (transform and opacity) for animations
2. THE System SHALL avoid layout thrashing during animations
3. THE System SHALL use `will-change` property only when necessary
4. THE modal animations SHALL maintain 60 frames per second
5. THE button hover transitions SHALL complete within 150ms

### Requirement 19: Memory Management

**User Story:** As a user, I want the application to manage memory efficiently, so that it remains responsive during extended use.

#### Acceptance Criteria

1. WHEN a modal closes THEN the System SHALL unmount modal content
2. WHEN OCR processing completes THEN the System SHALL clear image data from memory
3. THE System SHALL limit dictionary search history to 20 items
4. THE System SHALL release resources for unused modal components
5. THE System SHALL prevent memory leaks from event listeners

### Requirement 20: Component Migration

**User Story:** As a developer, I want a clear migration path from the old layout to the new layout, so that the transition is smooth and reversible.

#### Acceptance Criteria

1. THE System SHALL maintain existing components during migration
2. THE System SHALL support a feature flag to toggle between old and new layouts
3. THE System SHALL provide an environment variable to control layout selection
4. THE System SHALL preserve all existing functionality during migration
5. WHEN the new layout is enabled THEN the System SHALL remove floating panel components
