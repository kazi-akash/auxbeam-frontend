# AuxBeam Design System

This document outlines the design system implemented in the AuxBeam e-commerce platform.

## Color Palette

### Primary Colors (Yellow/Gold)
```
primary-50:  #FFFEF0
primary-100: #FFFACC
primary-200: #FFF799
primary-300: #FFF066
primary-400: #FFE933
primary-500: #FFE200 (Main)
primary-600: #CCB500
primary-700: #998800
primary-800: #665B00
primary-900: #332D00
```

### Gray Scale
```
gray-50:  #F9FAFB
gray-100: #F3F4F6
gray-200: #E5E7EB
gray-300: #D1D5DB
gray-400: #9CA3AF
gray-500: #6B7280
gray-600: #4B5563
gray-700: #374151
gray-800: #1F2937
gray-900: #111827
```

### Semantic Colors
```
success: #10B981 (Green)
error:   #EF4444 (Red)
warning: #F59E0B (Orange)
```

### Text Colors
```
text-primary:   #000000 (Black)
text-secondary: #6B7280 (Gray-500)
text-tertiary:  #9CA3AF (Gray-400)
text-inverse:   #FFFFFF (White)
```

## Typography

### Headings

#### H1 Big (64px)
- Desktop: 64px / 120% line-height / -2% letter-spacing / Bold
- Tablet: 64px / 120% line-height / -2% letter-spacing / Bold
- Mobile: 48px / 120% line-height / -2% letter-spacing / Bold
- Usage: `text-h1-big`, `md:text-h1-big-tablet`, `lg:text-h1-big`

#### H1 Small (56px)
- Desktop: 56px / 120% line-height / -2% letter-spacing / Bold
- Tablet: 48px / 120% line-height / -2% letter-spacing / Bold
- Mobile: 40px / 120% line-height / -2% letter-spacing / Bold
- Usage: `text-h1-small`, `md:text-h1-small-tablet`, `lg:text-h1-small`

#### H2 (48px)
- Desktop: 48px / 120% line-height / -2% letter-spacing / Bold
- Tablet: 40px / 120% line-height / -2% letter-spacing / Bold
- Mobile: 32px / 120% line-height / -2% letter-spacing / Bold
- Usage: `text-h2`, `md:text-h2-tablet`, `lg:text-h2`

#### H3 (40px)
- Desktop: 40px / 130% line-height / -1% letter-spacing / Bold
- Tablet: 32px / 130% line-height / -1% letter-spacing / Bold
- Mobile: 28px / 130% line-height / -1% letter-spacing / Bold
- Usage: `text-h3`, `md:text-h3-tablet`, `lg:text-h3`

#### H4 (32px)
- Desktop: 32px / 130% line-height / -1% letter-spacing / Bold
- Tablet: 28px / 130% line-height / -1% letter-spacing / Bold
- Mobile: 24px / 130% line-height / -1% letter-spacing / Bold
- Usage: `text-h4`, `md:text-h4-tablet`, `lg:text-h4`

#### H5 (24px)
- Desktop: 24px / 140% line-height / 0% letter-spacing / Bold
- Tablet: 20px / 140% line-height / 0% letter-spacing / Bold
- Mobile: 18px / 140% line-height / 0% letter-spacing / Bold
- Usage: `text-h5`, `md:text-h5-tablet`, `lg:text-h5`

#### H6 (20px)
- Desktop: 20px / 140% line-height / 0% letter-spacing / Bold
- Tablet: 18px / 140% line-height / 0% letter-spacing / Bold
- Mobile: 16px / 140% line-height / 0% letter-spacing / Bold
- Usage: `text-h6`, `md:text-h6-tablet`, `lg:text-h6`

### Body Text

#### Body Large (18px)
- Size: 18px / 150% line-height / 0% letter-spacing
- Weights: Regular (400), Medium (500), Semibold (600), Bold (700)
- Usage: `text-body-lg`, `text-body-lg-medium`, `text-body-lg-semibold`, `text-body-lg-bold`

#### Body Medium (16px)
- Size: 16px / 150% line-height / 0% letter-spacing
- Weights: Regular (400), Medium (500), Semibold (600), Bold (700)
- Usage: `text-body-md`, `text-body-md-medium`, `text-body-md-semibold`, `text-body-md-bold`

#### Body Small (14px)
- Size: 14px / 150% line-height / 0% letter-spacing
- Weights: Regular (400), Medium (500), Semibold (600), Bold (700)
- Usage: `text-body-sm`, `text-body-sm-medium`, `text-body-sm-semibold`, `text-body-sm-bold`

#### Caption (12px)
- Size: 12px / 150% line-height / 0% letter-spacing
- Weights: Regular (400), Medium (500), Semibold (600), Bold (700)
- Usage: `text-caption`, `text-caption-medium`, `text-caption-semibold`, `text-caption-bold`

## Spacing

Based on 4px grid system:
```
0:  0px
1:  4px
2:  8px
3:  12px
4:  16px
5:  20px
6:  24px
7:  28px
8:  32px
10: 40px
12: 48px
14: 56px
16: 64px
20: 80px
24: 96px
32: 128px
40: 160px
48: 192px
56: 224px
64: 256px
```

## Border Radius

```
none:    0
sm:      4px
DEFAULT: 8px
md:      12px
lg:      16px
xl:      20px
2xl:     24px
full:    9999px
```

## Component Examples

### Buttons

#### Primary Button
```tsx
<button className="bg-primary-500 text-text-primary px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors text-body-md-semibold">
  Click Me
</button>
```

#### Secondary Button
```tsx
<button className="bg-gray-100 text-text-primary px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-body-md-semibold">
  Click Me
</button>
```

#### Outline Button
```tsx
<button className="border-2 border-primary-500 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors text-body-md-semibold">
  Click Me
</button>
```

### Form Inputs

```tsx
<input
  type="text"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-body-md"
  placeholder="Enter text..."
/>
```

### Cards

```tsx
<div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
  <h3 className="text-h6 mb-2">Card Title</h3>
  <p className="text-body-md text-text-secondary">Card content goes here.</p>
</div>
```

### Badges

```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-caption-semibold bg-success/10 text-success">
  Success
</span>

<span className="inline-flex items-center px-3 py-1 rounded-full text-caption-semibold bg-error/10 text-error">
  Error
</span>

<span className="inline-flex items-center px-3 py-1 rounded-full text-caption-semibold bg-warning/10 text-warning">
  Warning
</span>
```

## Usage Guidelines

### Color Usage
- Use `primary-500` for main CTAs and important actions
- Use `gray` scale for neutral elements
- Use semantic colors (`success`, `error`, `warning`) for status indicators
- Use `text-*` colors for typography

### Typography Usage
- Use H1-H2 for page titles
- Use H3-H4 for section headings
- Use H5-H6 for subsection headings
- Use body text for content
- Use caption for small labels and metadata

### Spacing Usage
- Use consistent spacing multiples (4, 8, 12, 16, 24, 32, etc.)
- Maintain visual hierarchy with spacing
- Use larger spacing between sections
- Use smaller spacing within components

### Responsive Design
- Always include responsive variants for headings
- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Test on mobile, tablet, and desktop viewports

## Accessibility

- Maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Use semantic HTML elements
- Include proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers

## Implementation

All design tokens are configured in `tailwind.config.ts`. To use them:

1. Import the utility classes in your components
2. Use the predefined color, typography, and spacing classes
3. Follow the component examples above
4. Maintain consistency across the application

## Resources

- Tailwind CSS Documentation: https://tailwindcss.com/docs
- Color Contrast Checker: https://webaim.org/resources/contrastchecker/
- Typography Scale Calculator: https://type-scale.com/
