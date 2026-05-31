# Implementation Plan: Notification System

## Overview

This implementation plan creates a global toast notification system for Yao Editor v2. The system provides visual feedback for operations like document saves, file exports, OCR recognition, and API errors. Notifications appear in the top-right corner with smooth animations, auto-dismiss after a configured duration, and support manual dismissal. The implementation extends the existing AppContext, creates a new NotificationList component, and integrates with existing services.

## Tasks

- [x] 1. Set up notification infrastructure in AppContext
  - [x] 1.1 Extend AppContext with notification state and types
    - Add `Notification` interface to AppContext.tsx
    - Add `notifications` state array to AppContextValue
    - Add `addNotification` and `dismissNotification` functions to AppContextValue interface
    - Create timer reference Map for cleanup management
    - _Requirements: 1.1, 1.2, 10.1, 10.2_
  
  - [x] 1.2 Implement addNotification function with ID generation and timer scheduling
    - Implement `addNotification` function using `crypto.randomUUID()` for ID generation
    - Add fallback ID generation for browsers without crypto.randomUUID support
    - Apply default duration of 4000ms when not specified
    - Schedule auto-dismiss timer using setTimeout
    - Store timer reference in Map for cleanup
    - Implement max notification limit (10) with oldest removal
    - Wrap function with useCallback for performance
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 9.1, 9.2, 10.1, 10.2, 19.2_
  
  - [x] 1.3 Implement dismissNotification function with timer cleanup
    - Implement `dismissNotification` function to remove notification by ID
    - Clear associated timer from Map when dismissing
    - Make function idempotent (no error on non-existent ID)
    - Wrap function with useCallback for performance
    - _Requirements: 2.1, 2.2, 2.3, 8.1, 19.2_
  
  - [x] 1.4 Implement cleanup effect for component unmount
    - Add useEffect cleanup function to clear all timers on unmount
    - Clear timer reference Map on unmount
    - Prevent state updates after unmount
    - _Requirements: 8.2, 8.3, 20.1, 20.2, 20.3_
  
  - [ ]* 1.5 Write property test for unique notification IDs
    - **Property 1: Unique Notification IDs**
    - **Validates: Requirements 1.1, 10.1, 10.3**
    - Use fast-check to generate multiple notifications
    - Verify all generated IDs are unique
    - Test with various notification inputs
  
  - [ ]* 1.6 Write property test for notification array growth
    - **Property 2: Notification Array Growth**
    - **Validates: Requirements 1.2**
    - Use fast-check to generate notification inputs
    - Verify array length increases by 1 for each addition (up to max 10)
    - Test max limit enforcement
  
  - [ ]* 1.7 Write property test for timer creation and storage
    - **Property 3: Timer Creation and Storage**
    - **Validates: Requirements 1.3, 1.5**
    - Verify timer reference is stored for each notification
    - Verify timer Map size matches notifications array length
  
  - [ ]* 1.8 Write property test for default duration application
    - **Property 4: Default Duration Application**
    - **Validates: Requirements 1.4**
    - Generate notifications without duration specified
    - Verify 4000ms default is applied
  
  - [ ]* 1.9 Write unit tests for AppContext notification logic
    - Test addNotification generates unique IDs
    - Test addNotification adds to state array
    - Test dismissNotification removes from state
    - Test dismissNotification is idempotent
    - Test cleanup clears all timers
    - Test max notification limit (10)

- [x] 2. Checkpoint - Verify AppContext notification infrastructure
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Create NotificationCard component
  - [x] 3.1 Create NotificationCard component with type-based styling
    - Create new file `src/components/common/NotificationCard.tsx`
    - Define NotificationCardProps interface
    - Implement icon selection based on notification type (success, error, warning, info)
    - Apply color scheme based on type (green, red, yellow, blue)
    - Support dark mode color schemes
    - Render notification message text safely (prevent XSS)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 17.1, 18.1, 18.2, 18.3_
  
  - [x] 3.2 Add close button to NotificationCard
    - Render close button with × icon
    - Handle click event to call onDismiss with notification ID
    - Apply hover and focus styles for accessibility
    - _Requirements: 5.6, 5.7_
  
  - [x] 3.3 Add progress bar to NotificationCard
    - Render progress bar at bottom of card
    - Animate width from 100% to 0% over notification duration
    - Use color matching notification type
    - Use CSS animation for smooth performance
    - _Requirements: 7.1, 7.2, 7.3, 19.1_
  
  - [ ]* 3.4 Write unit tests for NotificationCard component
    - Test renders correct icon for each type
    - Test renders message text correctly
    - Test renders close button
    - Test close button calls onDismiss with correct ID
    - Test applies correct color scheme for each type
    - Test progress bar is present
    - Test dark mode styling

- [x] 4. Create NotificationList component
  - [x] 4.1 Create NotificationList component with stack layout
    - Create new file `src/components/common/NotificationList.tsx` (update existing file)
    - Consume notifications from AppContext using useAppContext hook
    - Position container fixed in top-right corner (top-4 right-4)
    - Apply z-index 100 for layering above all content
    - Render empty state when no notifications
    - _Requirements: 4.1, 4.2, 4.4, 19.4_
  
  - [x] 4.2 Add framer-motion animations to NotificationList
    - Wrap notification cards with AnimatePresence
    - Implement slide-in animation from right with fade-in
    - Implement slide-out animation to right with fade-out
    - Use GPU-accelerated transforms (translateX, opacity)
    - Add will-change CSS hint for performance
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 19.1_
  
  - [x] 4.3 Render NotificationCard for each notification
    - Map over notifications array to render NotificationCard components
    - Pass notification data and dismissNotification callback
    - Use notification ID as React key
    - _Requirements: 4.3_
  
  - [ ]* 4.4 Write property test for render count matching array length
    - **Property 8: Render Count Matches Array Length**
    - **Validates: Requirements 4.3**
    - Generate various notification arrays
    - Verify rendered card count equals array length
  
  - [ ]* 4.5 Write property test for z-index layering
    - **Property 19: Z-index Layering**
    - **Validates: Requirements 4.2**
    - Verify NotificationList has z-index 100
    - Verify it's higher than other UI components
  
  - [ ]* 4.6 Write unit tests for NotificationList component
    - Test renders empty state when no notifications
    - Test renders correct number of cards
    - Test applies correct positioning and z-index
    - Test passes correct props to NotificationCard

- [x] 5. Checkpoint - Verify notification UI components
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Integrate NotificationList into App.tsx
  - [x] 6.1 Add NotificationList to App.tsx root level
    - Import NotificationList component
    - Render NotificationList at root level (after main content)
    - Ensure it's inside AppProvider for context access
    - Verify positioning and z-index work correctly
    - _Requirements: 4.1, 4.2_

- [x] 7. Integrate with AutoSave service
  - [x] 7.1 Add success notification to useAutoSave hook
    - Import useAppContext in `src/hooks/useAutoSave.ts`
    - Call addNotification with success type when save completes
    - Use Vietnamese message "Đã lưu tài liệu"
    - Set duration to 3000ms
    - _Requirements: 12.1_
  
  - [x] 7.2 Add error notification to useAutoSave hook
    - Call addNotification with error type when save fails
    - Include error message in notification
    - Set duration to 5000ms
    - _Requirements: 12.2_

- [x] 8. Integrate with Export service
  - [x] 8.1 Add success notification to useExport hook
    - Import useAppContext in `src/hooks/useExport.ts`
    - Call addNotification with success type when export completes
    - Use appropriate Vietnamese message
    - Set duration to 3000ms
    - _Requirements: 13.1_
  
  - [x] 8.2 Add error notification to useExport hook
    - Call addNotification with error type when export fails
    - Include error message in notification
    - Set duration to 5000ms
    - _Requirements: 13.2_

- [x] 9. Integrate with OCR service
  - [x] 9.1 Add info notification to OCRPanel component
    - Import useAppContext in `src/components/ocr/OCRPanel.tsx`
    - Call addNotification with info type when OCR completes
    - Use Vietnamese message "Nhận dạng hoàn tất"
    - Set duration to 4000ms
    - _Requirements: 14.1_

- [x] 10. Integrate with GemAI service
  - [x] 10.1 Add warning notification for GemAI timeout
    - Import useAppContext in components using GemAI service
    - Call addNotification with warning type on timeout
    - Use Vietnamese message "Gemini không phản hồi, thử lại sau"
    - Set duration to 6000ms
    - _Requirements: 15.1_
  
  - [x] 10.2 Add error notification for GemAI errors
    - Call addNotification with error type on API errors
    - Include error message in notification
    - Set duration to 5000ms
    - _Requirements: 15.2_

- [x] 11. Integrate with OverrideManager
  - [x] 11.1 Add success notifications to OverrideManager
    - Import useAppContext in `src/components/dictionary/OverrideManager.tsx`
    - Call addNotification with success type when adding entry
    - Call addNotification with success type when deleting entry
    - Use appropriate Vietnamese messages
    - Set duration to 3000ms
    - _Requirements: 16.1, 16.2_
  
  - [x] 11.2 Add error notification to OverrideManager
    - Call addNotification with error type on operation errors
    - Include error message in notification
    - Set duration to 5000ms
    - _Requirements: 16.3_

- [x] 12. Checkpoint - Verify all service integrations
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 13. Write property tests for auto-dismiss behavior
  - [ ]* 13.1 Write property test for auto-dismiss guarantee
    - **Property 5: Auto-dismiss Guarantee**
    - **Validates: Requirements 3.1, 3.2**
    - Generate notifications with various durations
    - Wait for max duration + buffer
    - Verify all notifications are removed
  
  - [ ]* 13.2 Write property test for timer cleanup on dismiss
    - **Property 6: Timer Cleanup on Dismiss**
    - **Validates: Requirements 2.2, 8.1**
    - Add notifications and verify timers created
    - Dismiss notifications and verify timers cleared
  
  - [ ]* 13.3 Write property test for idempotent dismiss
    - **Property 7: Idempotent Dismiss**
    - **Validates: Requirements 2.3**
    - Generate random string IDs
    - Call dismissNotification multiple times
    - Verify no errors thrown

- [ ]* 14. Write property tests for UI rendering
  - [ ]* 14.1 Write property test for close button presence
    - **Property 9: Close Button Presence**
    - **Validates: Requirements 5.6**
    - Render notifications with various types
    - Verify close button exists in each card
  
  - [ ]* 14.2 Write property test for message display
    - **Property 10: Message Display**
    - **Validates: Requirements 5.5, 11.2**
    - Generate notifications with various messages
    - Verify message text is displayed correctly
  
  - [ ]* 14.3 Write property test for progress bar presence
    - **Property 11: Progress Bar Presence**
    - **Validates: Requirements 7.1**
    - Render notifications
    - Verify progress bar element exists in each card

- [ ]* 15. Write property tests for cleanup and limits
  - [ ]* 15.1 Write property test for timer cleanup on unmount
    - **Property 12: Timer Cleanup on Unmount**
    - **Validates: Requirements 8.2, 8.3, 20.1, 20.2**
    - Add notifications with timers
    - Unmount component
    - Verify all timers cleared and Map emptied
  
  - [ ]* 15.2 Write property test for maximum notifications limit
    - **Property 13: Maximum Notifications Limit**
    - **Validates: Requirements 9.1, 9.2**
    - Add more than 10 notifications
    - Verify array length never exceeds 10
    - Verify oldest notifications removed first

- [ ]* 16. Write property tests for validation
  - [ ]* 16.1 Write property test for type validation
    - **Property 14: Type Validation**
    - **Validates: Requirements 11.1**
    - Generate notifications
    - Verify all types are valid enum values
  
  - [ ]* 16.2 Write property test for duration validation
    - **Property 15: Duration Validation**
    - **Validates: Requirements 11.3**
    - Generate notifications with durations
    - Verify all durations are positive integers
  
  - [ ]* 16.3 Write property test for XSS prevention
    - **Property 16: XSS Prevention**
    - **Validates: Requirements 17.2**
    - Generate messages with HTML/script tags
    - Verify content rendered as plain text
    - Verify no script execution
  
  - [ ]* 16.4 Write property test for message length handling
    - **Property 17: Message Length Handling**
    - **Validates: Requirements 17.3**
    - Generate very long messages
    - Verify UI handles gracefully without overflow

- [ ]* 17. Write property test for animation consistency
  - [ ]* 17.1 Write property test for animation consistency
    - **Property 18: Animation Consistency**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
    - Add and remove notifications
    - Verify enter animations (slide-in, fade-in)
    - Verify exit animations (slide-out, fade-out)

- [ ]* 18. Write integration tests for service integrations
  - [ ]* 18.1 Write integration test for AutoSave → Notification
    - Trigger auto-save in editor
    - Verify success notification appears
    - Verify notification auto-dismisses
  
  - [ ]* 18.2 Write integration test for Export → Notification
    - Trigger PDF export
    - Verify success notification on completion
    - Trigger export error
    - Verify error notification appears
  
  - [ ]* 18.3 Write integration test for OCR → Notification
    - Complete OCR recognition
    - Verify info notification appears
    - Verify correct Vietnamese message
  
  - [ ]* 18.4 Write integration test for GemAI → Notification
    - Trigger Gemini API error
    - Verify error notification appears
    - Verify error message included
  
  - [ ]* 18.5 Write integration test for OverrideManager → Notification
    - Add dictionary entry
    - Verify success notification
    - Delete dictionary entry
    - Verify success notification

- [x] 19. Final checkpoint - Complete notification system
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design
- Unit tests validate specific examples and edge cases
- Integration tests verify end-to-end flows with existing services
- The implementation uses TypeScript throughout for type safety
- Framer-motion is used for smooth GPU-accelerated animations
- The system integrates deeply with existing AppContext and services
- Dark mode support is built-in from the start
- Performance optimizations (useCallback, GPU transforms) are included in core implementation
- Security considerations (XSS prevention, rate limiting) are addressed in validation

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["1.5", "1.6", "1.7", "1.8", "1.9", "3.1"] },
    { "id": 3, "tasks": ["3.2", "3.3"] },
    { "id": 4, "tasks": ["3.4", "4.1"] },
    { "id": 5, "tasks": ["4.2", "4.3"] },
    { "id": 6, "tasks": ["4.4", "4.5", "4.6", "6.1"] },
    { "id": 7, "tasks": ["7.1", "7.2", "8.1", "8.2", "9.1", "10.1", "10.2", "11.1", "11.2"] },
    { "id": 8, "tasks": ["13.1", "13.2", "13.3", "14.1", "14.2", "14.3", "15.1", "15.2", "16.1", "16.2", "16.3", "16.4", "17.1"] },
    { "id": 9, "tasks": ["18.1", "18.2", "18.3", "18.4", "18.5"] }
  ]
}
```
