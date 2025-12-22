# Design Guidelines: Inner State Reflection App

## Core Philosophy
A soft, minimal application for gentle emotional observation and clarity. Non-judgmental, supportive, and intimate. No gamification, no streaks, no pressure—just a quiet pause in the day.

## Architecture Decisions

### Authentication
**No authentication required.** This is a single-user, local-first utility app focused on personal reflection. Data stored locally.

**Profile/Settings Screen Required:**
- User-customizable avatar (1 preset avatar: soft, abstract, calming design)
- Display name field
- App preferences: theme (dark mode only), notification settings

### Navigation
**Stack-Only Navigation.** Linear flow optimized for focused reflection:
1. Check-in Screen (entry point)
2. Reflection Screen (after submission)
3. Visual State Screen (optional view)
4. Settings Screen (accessible via header icon)

No tab bar. No drawer. Simple, linear progression.

## Screen Specifications

### 1. Check-in Screen
**Purpose:** User writes 1–3 sentences answering "How do I feel right now?"

**Layout:**
- **Header:** Transparent, no title, settings icon (top-right)
- **Root view:** Scrollable
- **Safe area insets:** 
  - Top: `insets.top + Spacing.xl`
  - Bottom: `insets.bottom + Spacing.xl`

**Components:**
- Centered prompt text: "How do I feel right now?" (serif font, muted text color)
- Multi-line text input (3–5 lines visible, card background, border radius 20px)
- Primary action button: "Reflect my state" (full-width, fixed at bottom with safe area)

**Interaction:**
- Input has subtle focus border (#7C7CFF) when active
- Button has subtle press feedback (opacity 0.85)

---

### 2. Reflection Screen
**Purpose:** Display AI-generated calm reflection and short metaphor

**Layout:**
- **Header:** Transparent, back button (top-left), share icon (top-right)
- **Root view:** Scrollable
- **Safe area insets:**
  - Top: `headerHeight + Spacing.xl`
  - Bottom: `insets.bottom + Spacing.xl`

**Components:**
- User's original input (small serif text, muted color, top of screen)
- AI reflection text (3–5 lines, serif font, primary text color, generous line height)
- Divider (subtle, muted background color)
- Metaphor of the day (serif font, slightly smaller, accent color)
- Secondary button: "Explore visual state" (below metaphor)

**Typography:**
- Reflection text: Playfair Display, 20–24px, line height 1.6
- Metaphor: Playfair Display, 16–18px

---

### 3. Visual State Screen
**Purpose:** Abstract visual representation of emotional state through color, spacing, typography

**Layout:**
- **Header:** Transparent, back button (top-left), "Done" button (top-right)
- **Root view:** Non-scrollable, full-screen canvas
- **Safe area insets:** Full bleed, respect only top/bottom safe areas

**Components:**
- Generative visual element (abstract shapes, gradients, or typography arranged based on emotional tone)
- No text except optional subtle label at bottom
- Color palette dynamically shifts based on emotional state (use primary accent #7C7CFF as base, generate complementary tones)

**Interaction:**
- Tap anywhere to dismiss
- Subtle fade-in animation on entry

---

### 4. Settings Screen
**Purpose:** User preferences and account management

**Layout:**
- **Header:** Default navigation header, title: "Settings", close button (top-right)
- **Root view:** Scrollable form
- **Safe area insets:**
  - Top: `Spacing.xl`
  - Bottom: `insets.bottom + Spacing.xl`

**Components:**
- Profile section: avatar (circular, 80px), display name field
- Preferences: notification toggle, app info
- Destructive zone: "Clear all reflections" (secondary background, destructive text color)

---

## Color System (Global Application)

```
Background: #0F0F14
Text: #EDEDF2
Muted Background: #1A1A22
Muted Text: #9A9AA8

Primary Action Background: #7C7CFF
Primary Action Text: #FFFFFF

Secondary Background: #15151D
Secondary Text: #EDEDF2

Accent Background: #7C7CFF
Accent Text: #FFFFFF

Destructive Background: #FF6B6B
Destructive Text: #0F0F14

Card Background: #15151D
Card Text: #EDEDF2

Popover Background: #1C1C26
Popover Text: #EDEDF2

Focus Border: #7C7CFF
Input Border: #2A2A38
```

---

## Typography System

- **Sans-serif (Inter):** All UI elements, buttons, inputs, navigation
- **Serif (Playfair Display):** AI reflection text, metaphors only
- **Monospace (JetBrains Mono):** System labels, technical hints (minimal use)

**Hierarchy:**
- Prompts/Titles: 24–28px
- Body (reflection): 20–24px, line height 1.6
- Metaphor: 16–18px
- UI labels: 14–16px

---

## Layout & Spacing

- **Border radius:** 16–24px for all cards, buttons, inputs
- **Spacing rhythm:** Use generous padding (24–32px between major sections)
- **Button height:** 56px minimum for primary actions
- **Input padding:** 16–20px internal padding
- **Card padding:** 20–24px

---

## Visual Design Principles

- **No emojis.** Use Feather icons from @expo/vector-icons sparingly
- **No drop shadows** except for floating action button (if needed):
  - shadowOffset: {width: 0, height: 2}
  - shadowOpacity: 0.10
  - shadowRadius: 2
- **Touchable feedback:** Opacity 0.85 on press for all interactive elements
- **Animations:** Subtle fades (200–300ms), no bounces or springs

---

## Critical Assets

1. **Avatar Preset (1 required):** Soft, abstract, calming illustration. Muted purple/blue tone matching #7C7CFF. Minimal geometric shapes or organic forms.
2. **App Icon:** Minimal, dark background, single abstract element in accent color.

No additional images or illustrations needed. Rely on typography and spacing for visual hierarchy.

---

## Accessibility Requirements

- Minimum touch target: 44x44px
- Text contrast ratio: 4.5:1 minimum (already satisfied by color system)
- Support Dynamic Type for all text (except metaphors, which can have max size)
- VoiceOver labels for all interactive elements