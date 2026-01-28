# Database Storage Solution

## Overview

We've added **optional Supabase integration** to automatically store questionnaire responses in a database. This makes it easy to access all responses without manual export/import.

## How It Works

### Without Supabase (Current Behavior)
- Responses stored in browser localStorage only
- Users must export JSON files
- Admins must import files manually

### With Supabase (New Option)
- Responses automatically saved to database when completed
- Admin page can load all responses with one click
- View responses in Supabase web dashboard
- No manual file handling needed

## Setup Required

1. **Create Supabase account** (free)
2. **Create database table** (use `supabase-setup.sql`)
3. **Add environment variables** to Netlify
4. **Redeploy** your site

See `SUPABASE_SETUP.md` for detailed instructions.

## Features

### Automatic Saving
- When user completes questionnaire, response is automatically saved to Supabase
- Works in background - user doesn't need to do anything
- Falls back gracefully if Supabase not configured

### Admin Access
- Go to `/admin-view`
- Click **"Load from Database"**
- All responses appear instantly
- View, export, or manage responses

### Supabase Dashboard
- View all responses in web interface
- Filter, search, export to CSV
- No code required

## Configuration

### Environment Variables (Netlify)

Add these in Netlify Dashboard → Site settings → Environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Optional Configuration

If environment variables are not set, the app works normally with localStorage only. Supabase features are automatically disabled.

## Cost

- **Free tier:** 500MB database, 2GB bandwidth
- **Typical usage:** ~1KB per response
- **Capacity:** ~500,000 responses on free tier
- **Upgrade:** Only if you exceed limits

## Security

- Uses Supabase Row Level Security (RLS)
- Anon key is public (safe for this use case)
- RLS policies control access
- For sensitive data, consider adding authentication

## Migration Path

1. **Phase 1:** Set up Supabase (optional)
2. **Phase 2:** New responses automatically saved
3. **Phase 3:** Old responses can be imported via admin page
4. **Phase 4:** All future responses in database

## Benefits

✅ **Automatic collection** - No manual export/import  
✅ **Centralized storage** - All responses in one place  
✅ **Easy access** - View in admin page or Supabase dashboard  
✅ **Scalable** - Handles thousands of responses  
✅ **Free** - No cost for typical usage  
✅ **Optional** - Works without it (backward compatible)

## Files Added

- `lib/supabase.ts` - Supabase client functions
- `supabase-setup.sql` - Database setup script
- `SUPABASE_SETUP.md` - Detailed setup guide
- Updated `components/CompletionScreen.tsx` - Auto-save on completion
- Updated `app/admin-view/page.tsx` - Load from database

## Next Steps

1. Follow `SUPABASE_SETUP.md` to set up database
2. Add environment variables to Netlify
3. Redeploy site
4. Test by completing a questionnaire
5. Verify response appears in admin page

## Support

If you need help:
- Check `SUPABASE_SETUP.md` for setup issues
- Review Supabase documentation
- Check browser console for errors
- Verify environment variables are set correctly
