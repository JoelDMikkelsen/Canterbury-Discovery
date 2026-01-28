# ERP Discovery Questionnaire

A static, client-side questionnaire application for evaluating ERP solutions (NetSuite vs Microsoft Dynamics 365 Business Central).

## Overview

This is a **fully static web application** that runs entirely in the browser. It requires:
- **NO authentication**
- **NO server-side code**
- **NO backend services**
- **NO environment variables**
- **NO runtime dependencies**

All data is stored locally in the browser using `localStorage`. The application can be hosted on any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## Technology Stack

- **Framework:** Next.js 14 (Static Export)
- **Language:** TypeScript
- **Frontend:** React 18
- **Persistence:** Browser localStorage
- **Styling:** Tailwind CSS
- **Deployment Target:** Netlify (or any static host)

## Features

- ✅ **Zero Configuration** - Works out of the box, no setup required
- ✅ **Auto-save** - All responses saved automatically to localStorage
- ✅ **Resume Capability** - Continue where you left off after refresh
- ✅ **Progress Tracking** - Visual progress indicator and section completion
- ✅ **Export Results** - Download printable HTML summary of all responses
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Multiple Question Types** - Choice, select, text, ranking, yes/no with followups
- ✅ **Validation** - Required field validation before section completion
- ✅ **Offline Capable** - Works offline after initial load

## Local Development

### Prerequisites

- Node.js 18+ and npm

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3001](http://localhost:3001) in your browser.

3. **Build for Production**
   ```bash
   npm run build
   ```
   This creates a static export in the `out/` directory.

### Development Commands

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build static export (outputs to `out/`)
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Deployment to Netlify

### Option 1: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the Application**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=out
   ```

### Option 2: Netlify Dashboard

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

2. **Configure Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
   - **Base directory:** `apps/discovery-questionnaire` (if monorepo)

3. **Deploy**
   - Netlify will automatically build and deploy on every push to your main branch

### Option 3: Drag & Drop

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Go to [Netlify Drop](https://app.netlify.com/drop)
   - Drag and drop the `out/` folder

## Data Persistence

### How It Works

- All questionnaire responses are stored in the browser's `localStorage`
- Data persists across browser sessions on the same device
- Each answer is automatically saved as you type (debounced 500ms)
- Progress is calculated and saved automatically

### Storage Limitations

- **Browser-specific:** Data is stored per browser/device
- **Storage quota:** Typically 5-10MB per domain
- **Clearing data:** If user clears browser data, responses are lost
- **Export recommended:** Users should export results for backup

### Export Feature

Users can export their completed questionnaire as:
- **HTML file** - Printable summary with all questions and answers
- **Print view** - Browser print dialog for physical printing

The export includes:
- All section names and descriptions
- All questions with answers
- Completion metadata (dates, progress)
- Formatted for easy reading

## Application Structure

```
apps/discovery-questionnaire/
├── app/
│   ├── questionnaire/       # Main questionnaire page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/
│   ├── CompletionScreen.tsx  # Completion & export screen
│   ├── PriorityRanking.tsx  # Drag-and-drop ranking component
│   ├── ProgressBar.tsx       # Progress indicator
│   ├── QuestionRenderer.tsx # Question type renderers
│   ├── SaveIndicator.tsx     # Auto-save status
│   └── SectionNavigation.tsx # Sidebar navigation
├── lib/
│   ├── questions.ts          # Questionnaire structure
│   ├── localStorage.ts       # localStorage persistence layer
│   └── htmlGenerator.ts      # Export HTML generator
├── types/
│   └── index.ts              # TypeScript type definitions
├── next.config.js            # Next.js config (static export)
└── README.md                 # This file
```

## Questionnaire Structure

The questionnaire consists of 11 sections:

1. **Organisation & Entity Structure** (8 min)
2. **Finance & Accounting Complexity** (7 min)
3. **Operations – Hospitality, Gaming, POS** (10 min)
4. **Users, Roles & Access Model** (8 min)
5. **Integrations & Data Flow** (10 min)
6. **Reporting, Planning & Analytics** (8 min)
7. **Payroll & Workforce Management** (5 min)
8. **Procure-to-Pay & Capex** (6 min)
9. **Fixed Assets, Leases & Property** (5 min)
10. **Controls, Audit & Compliance** (5 min)
11. **Fit, Risk & Decision Criteria** (8 min)

**Total estimated time:** 60-75 minutes

## Question Types

- **Multiple Choice** - Single selection from options
- **Multiple Select** - Multiple selections from options
- **Yes/No with Followup** - Yes/No question with conditional text followup
- **Text** - Free-form text input (with max length)
- **Priority Ranking** - Drag-and-drop ordering of criteria
- **Number** - Numeric input (with min/max)
- **Date** - Date picker
- **Scale** - Slider with custom labels

## User Flow

1. **Landing Page**
   - Welcome message and description
   - "Start Questionnaire" button
   - Shows resume option if data exists

2. **Questionnaire**
   - Section-based navigation
   - Auto-save on every answer
   - Progress tracking
   - Section completion checkbox
   - Previous/Next navigation

3. **Completion Screen**
   - Thank you message
   - Export options (Download HTML, Print)
   - Start over option
   - Return home option

## Browser Compatibility

- **Modern browsers only** - Requires localStorage support
- **Tested on:**
  - Chrome/Edge (latest)
  - Firefox (latest)
  - Safari (latest)

## Limitations

- **No server-side persistence** - Data only stored in browser
- **No multi-device sync** - Each device has separate data
- **No authentication** - Anyone can access and use
- **No data collection** - Responses never leave the browser
- **Storage quota** - Subject to browser localStorage limits (~5-10MB)

## Troubleshooting

### Build Issues

- **Error: "output: export" not found**
  - Ensure Next.js 14+ is installed
  - Check `next.config.js` has `output: "export"`

- **TypeScript Errors**
  - Run `npm run type-check` to see all errors
  - Ensure all types are properly defined

### Runtime Issues

- **Data Not Saving**
  - Check browser console for localStorage errors
  - Verify localStorage is enabled (not in private/incognito with restrictions)
  - Check storage quota hasn't been exceeded

- **Export Not Working**
  - Ensure questionnaire is completed
  - Check browser allows downloads
  - Try different browser if issues persist

### Deployment Issues

- **Netlify Build Fails**
  - Check build command is `npm run build`
  - Verify publish directory is `out`
  - Check Node.js version (18+ required)

- **404 Errors After Deployment**
  - Ensure `trailingSlash: true` in `next.config.js`
  - Check Netlify redirect rules if needed

## Development Notes

### Adding New Questions

1. Edit `lib/questions.ts`
2. Add question to appropriate section
3. Question types are defined in `types/index.ts`
4. Question rendering logic is in `components/QuestionRenderer.tsx`

### Modifying Styles

- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.js`
- Component styles: Inline Tailwind classes

### Changing Export Format

- Edit `lib/htmlGenerator.ts` to modify HTML export
- For PDF export, consider adding a client-side PDF library (e.g., jsPDF)

## Security Considerations

- **No authentication** - Application is publicly accessible
- **No data transmission** - All data stays in browser
- **No server-side validation** - All validation is client-side
- **Export responsibility** - Users must export their own data

## License

Proprietary - Internal use only.
