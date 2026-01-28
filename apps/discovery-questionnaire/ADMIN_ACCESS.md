# Admin Access Guide

## Overview

Since this application uses client-side localStorage (no central database), accessing responses requires a different approach than the original Azure-based system.

## Accessing Responses

### Option 1: Hidden Admin Page (Recommended)

**URL:** `https://your-site.netlify.app/admin-view`

**Password:** `fusion5-admin-2024` (change this in `app/admin-view/page.tsx`)

**Features:**
- View response from current browser's localStorage
- Import multiple JSON files exported by users
- View all imported responses in one place
- Export individual responses as HTML or JSON
- Password-protected (simple client-side check)

**How to Use:**
1. Navigate to `/admin-view` on the deployed site
2. Enter the password
3. View the current browser's response (if questionnaire was completed in this browser)
4. Import JSON files: Click "Import JSON File" and select exported response files
5. Click on any response in the sidebar to view full details
6. Export responses as HTML or JSON for sharing/archiving

### Option 2: User Export/Admin Import Workflow

**For Users:**
1. Complete the questionnaire
2. On completion screen, click "Download JSON"
3. Send the JSON file to admin

**For Admins:**
1. Go to `/admin-view`
2. Click "Import JSON File"
3. Select the JSON files received from users
4. View all responses in the sidebar
5. Export as needed

## Changing the Admin Password

Edit `apps/discovery-questionnaire/app/admin-view/page.tsx`:

```typescript
const ADMIN_PASSWORD = "your-new-password-here";
```

Then rebuild and redeploy.

## Security Note

⚠️ **Important:** This is a simple client-side password check. It provides basic protection but is not cryptographically secure. For production use with sensitive data, consider:

- Using a more secure password
- Changing the password regularly
- Not sharing the URL publicly
- Using Netlify's password protection feature (Site settings → Security → Password protection)

## Alternative: Netlify Password Protection

You can also protect the entire `/admin-view` route using Netlify's built-in password protection:

1. Go to Netlify Dashboard → Site settings → Security
2. Enable "Password protection"
3. Set a password for the entire site (or use Netlify's per-route protection if available)

This provides an additional layer of security on top of the application-level password.

## Response Collection Workflow

**Recommended Process:**

1. **Users complete questionnaire** → Data stored in their browser
2. **Users export JSON** → On completion screen, download JSON file
3. **Users send JSON to admin** → Email, file share, etc.
4. **Admin imports JSON files** → Use `/admin-view` page to import multiple files
5. **Admin reviews responses** → View all responses in one interface
6. **Admin exports as needed** → Export individual or aggregate reports

## Limitations

- **No automatic collection:** Responses must be manually exported and imported
- **Browser-specific:** Can only view responses from the current browser's localStorage
- **No real-time sync:** Responses are static files, not live data
- **Manual workflow:** Requires users to export and send files

## Future Enhancements (Optional)

If you need automatic collection, consider:
- Adding a simple backend API endpoint
- Using a form submission service (like Formspree, Netlify Forms, etc.)
- Setting up a Google Form that accepts JSON uploads
- Using a cloud storage service with API access
