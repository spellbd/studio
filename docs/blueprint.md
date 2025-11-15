# **App Name**: ভাষা মিত্র (Bhasha Mitra)

## Core Features:

- Bangla Spell Check: Detect Bangla spelling errors in Word documents using Gimeni API and highlight them.
- Structural & Formatting Suggestions: Analyze document structure (headings, paragraphs, spacing, alignment) and suggest improvements.
- Offline Learning System: Use an IndexedDB database to store custom dictionary entries, user-corrected words, and common error patterns. Employ a local Bangla n-gram model as a tool for corrections when offline, or when the Gimeni API is unavailable.
- Error List View: Display errors in an actionable manner in the React taskpane.
- Suggestion Cards: Show suggestions for each error with Replace/Ignore buttons.
- Settings Panel: Provide a settings panel to toggle online/offline mode.

## Style Guidelines:

- Primary color: Deep blue (#1A237E) to evoke trust and professionalism.
- Background color: Light blue-gray (#ECEFF1), a desaturated tint of the primary, for a clean backdrop.
- Accent color: Soft teal (#4DB6AC) to draw attention to actionable items without clashing with the professionalism.
- Body font: 'Inter', sans-serif, suitable for the long body texts.
- Headline font: 'Space Grotesk', sans-serif, for a contemporary, techy feel in the UI headers.
- Use simple, clear icons from a set like Font Awesome or Material Icons to represent actions and statuses.
- Employ a clean, grid-based layout for the taskpane to ensure readability and ease of use.
- Subtle animations (e.g., fade-in, slide-in) for transitions and loading states to improve user experience.