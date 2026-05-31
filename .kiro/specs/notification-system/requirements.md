# Requirements Document: Notification System

## Introduction

The Notification System is a global toast notification feature for Yao Editor v2 that provides visual feedback to users about important operations such as document saves, file exports, OCR recognition, and API errors. The system displays notifications in a stack positioned in the top-right corner of the screen with smooth animations, automatically dismisses notifications after a configured duration, and supports manual dismissal by the user. The system integrates with existing services (AutoSave, Export, OCR, GemAI, OverrideManager) to notify users of operation results.

## Glossary

- **Notification_System**: The global toast notification feature that manages and displays user feedback messages
- **Notification**: A single toast message with type, content, and duration
- **Notification_Stack**: The visual container that displays all active notifications in the top-right corner
- **AppContext**: The React context that manages global application state including notifications
- **Auto_Dismiss**: The automatic removal of a notification after its configured duration expires
- **Manual_Dismiss**: User-initiated removal of a notification by clicking the close button
- **Service**: An existing application module that triggers notifications (AutoSave, Export, OCR, GemAI, OverrideManager)
- **Animation_System**: The framer-motion library that handles enter/exit animations for notifications
- **Timer_Manager**: The internal system that schedules and manages auto-dismiss timers

## Requirements

### Requirement 1: Add Notification

**User Story:** As a service or component, I want to add notifications to the system, so that users receive visual feedback about operations.

#### Acceptance Criteria

1. WHEN a service calls addNotification with valid notification data, THE Notification_System SHALL generate a unique UUID for the notification
2. WHEN a service calls addNotification with valid notification data, THE Notification_System SHALL add the notification to the notifications array
3. WHEN a notification is added, THE Notification_System SHALL schedule an auto-dismiss timer for the specified duration
4. WHERE no duration is specified, THE Notification_System SHALL use a default duration of 4000 milliseconds
5. WHEN a notification is added, THE Notification_System SHALL store the timer reference for cleanup
6. WHEN a notification is added, THE Notification_System SHALL trigger a UI re-render to display the notification

### Requirement 2: Dismiss Notification

**User Story:** As a user, I want to dismiss notifications manually, so that I can clear notifications I have already read.

#### Acceptance Criteria

1. WHEN a user clicks the close button on a notification, THE Notification_System SHALL remove that notification from the notifications array
2. WHEN a notification is dismissed, THE Notification_System SHALL clear the associated auto-dismiss timer
3. WHEN dismissNotification is called with a non-existent ID, THE Notification_System SHALL complete without error
4. WHEN a notification is dismissed, THE Notification_System SHALL trigger a UI re-render to remove the notification

### Requirement 3: Auto-Dismiss Notification

**User Story:** As a user, I want notifications to automatically disappear after a period of time, so that I don't have to manually close every notification.

#### Acceptance Criteria

1. WHEN a notification's duration expires, THE Timer_Manager SHALL automatically call dismissNotification with the notification ID
2. WHEN a notification is auto-dismissed, THE Notification_System SHALL remove it from the notifications array
3. WHEN a notification is auto-dismissed, THE Notification_System SHALL trigger the exit animation

### Requirement 4: Display Notification Stack

**User Story:** As a user, I want to see all active notifications in a consistent location, so that I can easily notice important feedback.

#### Acceptance Criteria

1. THE Notification_Stack SHALL be positioned fixed in the top-right corner of the screen
2. THE Notification_Stack SHALL use z-index 100 to appear above all other UI components
3. WHEN notifications exist in the array, THE Notification_Stack SHALL render a notification card for each notification
4. WHEN the notifications array is empty, THE Notification_Stack SHALL render nothing

### Requirement 5: Render Notification Card

**User Story:** As a user, I want each notification to display clear information about its type and message, so that I can quickly understand the feedback.

#### Acceptance Criteria

1. WHEN a notification has type 'success', THE Notification_Card SHALL display a checkmark icon and green color scheme
2. WHEN a notification has type 'error', THE Notification_Card SHALL display an X icon and red color scheme
3. WHEN a notification has type 'warning', THE Notification_Card SHALL display a warning icon and yellow color scheme
4. WHEN a notification has type 'info', THE Notification_Card SHALL display an info icon and blue color scheme
5. THE Notification_Card SHALL display the notification message text
6. THE Notification_Card SHALL display a close button
7. WHEN the close button is clicked, THE Notification_Card SHALL call dismissNotification with the notification ID

### Requirement 6: Animate Notifications

**User Story:** As a user, I want notifications to appear and disappear smoothly, so that the interface feels polished and professional.

#### Acceptance Criteria

1. WHEN a notification is added, THE Animation_System SHALL animate the notification with a slide-in effect from the right
2. WHEN a notification is added, THE Animation_System SHALL animate the notification with a fade-in effect
3. WHEN a notification is dismissed, THE Animation_System SHALL animate the notification with a slide-out effect to the right
4. WHEN a notification is dismissed, THE Animation_System SHALL animate the notification with a fade-out effect
5. THE Animation_System SHALL use GPU-accelerated transforms for smooth performance

### Requirement 7: Display Progress Indicator

**User Story:** As a user, I want to see how much time remains before a notification auto-dismisses, so that I know how long I have to read it.

#### Acceptance Criteria

1. THE Notification_Card SHALL display a progress bar at the bottom of the card
2. WHEN a notification is displayed, THE progress bar SHALL animate from 100% width to 0% width over the notification duration
3. THE progress bar SHALL use a color that matches the notification type

### Requirement 8: Manage Timer Cleanup

**User Story:** As a developer, I want timers to be properly cleaned up, so that there are no memory leaks.

#### Acceptance Criteria

1. WHEN a notification is manually dismissed before auto-dismiss, THE Timer_Manager SHALL clear the associated timer
2. WHEN the Notification_System component unmounts, THE Timer_Manager SHALL clear all active timers
3. WHEN a timer is cleared, THE Timer_Manager SHALL remove the timer reference from storage

### Requirement 9: Limit Notification Count

**User Story:** As a user, I want the notification stack to remain manageable, so that the UI doesn't become cluttered with too many notifications.

#### Acceptance Criteria

1. WHEN the notifications array contains 10 notifications and a new notification is added, THE Notification_System SHALL remove the oldest notification
2. THE Notification_System SHALL maintain a maximum of 10 active notifications at any time

### Requirement 10: Generate Unique IDs

**User Story:** As a developer, I want each notification to have a unique identifier, so that notifications can be individually managed and dismissed.

#### Acceptance Criteria

1. WHEN a notification is created, THE Notification_System SHALL generate a unique ID using crypto.randomUUID()
2. WHERE crypto.randomUUID() is unavailable, THE Notification_System SHALL generate a unique ID using timestamp and random number combination
3. FOR ALL notifications in the array, each notification SHALL have a unique ID

### Requirement 11: Validate Notification Data

**User Story:** As a developer, I want notification data to be validated, so that invalid notifications don't cause runtime errors.

#### Acceptance Criteria

1. WHEN addNotification is called, THE Notification_System SHALL verify that the type is one of: 'info', 'success', 'warning', 'error'
2. WHEN addNotification is called, THE Notification_System SHALL verify that the message is a non-empty string
3. WHERE duration is provided, THE Notification_System SHALL verify that duration is a positive integer
4. WHERE an invalid type is provided, THE Notification_System SHALL default to 'info' type

### Requirement 12: Integrate with AutoSave Service

**User Story:** As a user, I want to be notified when my document is saved, so that I know my work is preserved.

#### Acceptance Criteria

1. WHEN the AutoSave service successfully saves a document, THE Notification_System SHALL display a success notification with message "Đã lưu tài liệu"
2. WHEN the AutoSave service fails to save a document, THE Notification_System SHALL display an error notification with the error message

### Requirement 13: Integrate with Export Service

**User Story:** As a user, I want to be notified when my document export completes or fails, so that I know the status of my export operation.

#### Acceptance Criteria

1. WHEN the Export service successfully exports a document, THE Notification_System SHALL display a success notification
2. WHEN the Export service fails to export a document, THE Notification_System SHALL display an error notification with the error message

### Requirement 14: Integrate with OCR Service

**User Story:** As a user, I want to be notified when OCR recognition completes, so that I know the operation has finished.

#### Acceptance Criteria

1. WHEN the OCR service completes recognition, THE Notification_System SHALL display an info notification with message "Nhận dạng hoàn tất"

### Requirement 15: Integrate with GemAI Service

**User Story:** As a user, I want to be notified when the GemAI service encounters errors, so that I understand why operations failed.

#### Acceptance Criteria

1. WHEN the GemAI service times out, THE Notification_System SHALL display a warning notification with message "Gemini không phản hồi, thử lại sau"
2. WHEN the GemAI service encounters an error, THE Notification_System SHALL display an error notification with the error message

### Requirement 16: Integrate with OverrideManager

**User Story:** As a user, I want to be notified when dictionary operations complete, so that I know my changes were saved.

#### Acceptance Criteria

1. WHEN the OverrideManager successfully adds a dictionary entry, THE Notification_System SHALL display a success notification
2. WHEN the OverrideManager successfully deletes a dictionary entry, THE Notification_System SHALL display a success notification
3. WHEN the OverrideManager encounters an error, THE Notification_System SHALL display an error notification with the error message

### Requirement 17: Prevent XSS Attacks

**User Story:** As a developer, I want notification messages to be safe from XSS attacks, so that malicious content cannot be injected.

#### Acceptance Criteria

1. WHEN rendering notification messages, THE Notification_System SHALL use React's text content rendering (not dangerouslySetInnerHTML)
2. WHERE notification messages contain user-generated content, THE Notification_System SHALL sanitize the content before display
3. THE Notification_System SHALL limit message length to prevent UI overflow attacks

### Requirement 18: Support Dark Mode

**User Story:** As a user, I want notifications to respect the application's dark mode setting, so that the UI remains consistent.

#### Acceptance Criteria

1. WHEN the application is in dark mode, THE Notification_Card SHALL use dark mode color schemes
2. WHEN the application is in light mode, THE Notification_Card SHALL use light mode color schemes
3. THE Notification_Card SHALL maintain sufficient contrast in both modes for accessibility

### Requirement 19: Optimize Performance

**User Story:** As a user, I want notifications to perform smoothly without impacting application performance, so that the UI remains responsive.

#### Acceptance Criteria

1. THE Animation_System SHALL use GPU-accelerated CSS properties (transform, opacity) for animations
2. THE Notification_System SHALL use useCallback for addNotification and dismissNotification to prevent unnecessary re-renders
3. THE Timer_Manager SHALL use a Map data structure for O(1) timer lookup and cleanup
4. THE Notification_System SHALL limit the maximum number of notifications to 10 to prevent excessive DOM nodes

### Requirement 20: Handle Component Unmount

**User Story:** As a developer, I want the notification system to clean up properly when unmounted, so that there are no memory leaks or errors.

#### Acceptance Criteria

1. WHEN the AppContext component unmounts, THE Timer_Manager SHALL clear all active timers
2. WHEN the AppContext component unmounts, THE Timer_Manager SHALL clear the timer reference map
3. WHEN an auto-dismiss timer fires after component unmount, THE Notification_System SHALL not attempt to update state
