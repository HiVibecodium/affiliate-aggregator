# UI Components Documentation

This document describes the new UI components added to improve user experience.

## Error Boundary

### Purpose

Catches and handles React errors gracefully, preventing the entire app from crashing.

### Usage

```tsx
import { ErrorBoundary } from '@/components/ui/error-boundary';

<ErrorBoundary
  fallback={<div>Custom error message</div>} // Optional
  onError={(error, errorInfo) => {
    // Custom error handling
  }}
>
  <YourComponent />
</ErrorBoundary>;
```

### Features

- Automatic error capture with Sentry integration
- User-friendly error messages
- Custom fallback components
- Development mode displays detailed errors
- Reload and home navigation options

---

## Loading Skeletons

### Purpose

Provides visual feedback while content is loading, improving perceived performance.

### Components

#### Basic Skeleton

```tsx
import { Skeleton } from '@/components/ui/loading-skeleton';

<Skeleton
  variant="text" // text, circular, rectangular, rounded
  width="200px"
  height="1.5rem"
  animation="pulse" // pulse, wave, none
/>;
```

#### Predefined Skeletons

```tsx
import {
  CardSkeleton,
  TableSkeleton,
  ProgramCardSkeleton,
  DashboardSkeleton
} from '@/components/ui/loading-skeleton';

// Usage
<CardSkeleton />
<TableSkeleton rows={5} />
<ProgramCardSkeleton />
<DashboardSkeleton />
```

### Variants

- **text**: For text content (default)
- **circular**: For avatars and icons
- **rectangular**: For images and blocks
- **rounded**: For cards and containers

### Animations

- **pulse**: Fade in/out animation (default)
- **wave**: Shimmer effect
- **none**: No animation

---

## Toast Notifications

### Purpose

Displays temporary notifications to users about actions, errors, or status updates.

### Setup

Wrap your app with ToastProvider:

```tsx
import { ToastProvider } from '@/components/ui/toast-notification';

function App() {
  return <ToastProvider>{/* Your app content */}</ToastProvider>;
}
```

### Usage

```tsx
import { useToast } from '@/components/ui/toast-notification';

function MyComponent() {
  const toast = useToast();

  const handleClick = () => {
    // Different notification types
    toast.success('Operation completed!');
    toast.error('Something went wrong');
    toast.warning('Please review your input');
    toast.info('New features available');

    // With custom duration (milliseconds)
    toast.success('Saved!', 3000);
  };

  return <button onClick={handleClick}>Show Toast</button>;
}
```

### Features

- 4 notification types: success, error, warning, info
- Auto-dismiss with configurable duration
- Manual dismiss button
- Stacking support for multiple toasts
- Smooth animations
- Accessible (ARIA roles)

---

## Form Fields

### Purpose

Standardized, accessible form inputs with built-in validation and error handling.

### Components

#### InputField

```tsx
import { InputField } from '@/components/ui/form-field';

<InputField
  label="Email Address"
  name="email"
  type="email"
  required
  error={errors.email}
  helperText="We'll never share your email"
  icon={<EmailIcon />}
  placeholder="Enter your email"
/>;
```

#### TextAreaField

```tsx
import { TextAreaField } from '@/components/ui/form-field';

<TextAreaField
  label="Description"
  name="description"
  rows={4}
  required
  error={errors.description}
  helperText="Describe your issue"
/>;
```

#### SelectField

```tsx
import { SelectField } from '@/components/ui/form-field';

<SelectField
  label="Choose Option"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  error={errors.option}
  placeholder="Select an option"
/>;
```

### Features

- Consistent styling across all form elements
- Built-in error display
- Required field indicators
- Helper text support
- Icon support for inputs
- Dark mode compatible
- Fully accessible (labels, ARIA attributes)

---

## Custom Animations

### Available Animations

#### Slide In/Out

```css
.animate-slide-in-right  /* Slide in from right */
.animate-slide-out-right /* Slide out to right */
```

#### Fade In

```css
.animate-fade-in /* Fade in effect */
```

#### Scale In

```css
.animate-scale-in /* Scale and fade in */
```

#### Shimmer

```css
.animate-shimmer /* Loading shimmer effect */
```

### Usage

```tsx
<div className="animate-fade-in">
  Content appears with fade effect
</div>

<div className="animate-scale-in">
  Content appears with scale effect
</div>
```

---

## Styling Classes

### Text Colors

```css
.text-primary   /* Main text color (adapts to theme) */
.text-secondary /* Secondary text color */
.text-muted     /* Muted/hint text color */
```

### Card Base

```css
.card-base /* Standard card styling with shadow */
```

### Form Elements

```css
.input-field  /* Styled input field */
.select-field /* Styled select field */
```

---

## Best Practices

### Error Boundaries

1. Wrap route-level components with ErrorBoundary
2. Provide custom fallbacks for critical sections
3. Log errors to your monitoring service
4. Test error scenarios in development

### Loading States

1. Show skeletons immediately on page load
2. Match skeleton structure to actual content
3. Use appropriate animation types
4. Keep skeleton duration reasonable (< 3s)

### Toast Notifications

1. Keep messages concise and actionable
2. Use appropriate severity levels
3. Don't stack too many toasts
4. Provide undo actions when applicable

### Form Fields

1. Always include labels for accessibility
2. Provide clear error messages
3. Use helper text for additional context
4. Mark required fields clearly
5. Validate on blur for better UX

---

## Accessibility

All components follow WCAG 2.1 AA guidelines:

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Focus indicators
- Error announcements

---

## Dark Mode Support

All components automatically support dark mode through Tailwind's dark mode classes. No additional configuration required.

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Performance Considerations

- Components use React best practices (memo, lazy loading)
- CSS animations are GPU-accelerated
- Minimal bundle size impact
- Tree-shakeable exports
- No external dependencies beyond React
