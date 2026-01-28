# Supabase Database Setup Guide

This guide explains how to set up Supabase to automatically store questionnaire responses in a database, making them easily accessible through the admin interface.

## Why Supabase?

- ✅ **Free tier** - 500MB database, 2GB bandwidth (plenty for questionnaires)
- ✅ **Easy setup** - 5 minutes to configure
- ✅ **Web dashboard** - View all responses in a user-friendly interface
- ✅ **Automatic saves** - Responses saved when users complete the questionnaire
- ✅ **No backend code** - Works with static sites using REST API

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" (free)
3. Sign up with GitHub (easiest) or email
4. Create a new organization (if prompted)

## Step 2: Create a New Project

1. Click "New Project"
2. Fill in:
   - **Name:** `erp-questionnaire` (or your choice)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free
3. Click "Create new project"
4. Wait 2-3 minutes for project to initialize

## Step 3: Create the Database Table

1. In your Supabase project, go to **Table Editor** (left sidebar)
2. Click **"New table"**
3. Configure:
   - **Name:** `questionnaire_responses`
   - **Description:** "Stores ERP questionnaire responses"
4. Add columns:

   | Column Name | Type | Default | Nullable | Description |
   |------------|------|---------|----------|-------------|
   | `id` | `text` | - | ❌ | Primary key (response ID) |
   | `response_data` | `jsonb` | - | ❌ | Full response JSON |
   | `user_name` | `text` | - | ✅ | User's name |
   | `user_email` | `text` | - | ✅ | User's email |
   | `started_at` | `timestamptz` | - | ✅ | When questionnaire started |
   | `completed_at` | `timestamptz` | - | ✅ | When questionnaire completed |
   | `progress_percent` | `integer` | - | ✅ | Completion percentage |
   | `created_at` | `timestamptz` | `now()` | ❌ | When record created |

5. Set `id` as **Primary Key**
6. Click **"Save"**

## Step 4: Configure Row Level Security (RLS)

1. Go to **Authentication** → **Policies** (or click the shield icon on your table)
2. Click **"New Policy"**
3. Select **"Enable insert access for all users"** (or create custom policy)
4. For **SELECT** (read access), create a policy:
   - **Policy name:** `Allow public read`
   - **Allowed operation:** `SELECT`
   - **Target roles:** `anon`, `authenticated`
   - **Policy definition:** `true` (allow all reads)
5. Click **"Save"**

**Important:** Since we're using the anon key, we need to allow public inserts. For production, consider adding authentication.

## Step 5: Get Your API Keys

1. Go to **Settings** → **API** (gear icon in left sidebar)
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 6: Configure Netlify Environment Variables

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add these variables:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

5. Click **"Save"**

## Step 7: Redeploy Your Site

1. In Netlify, go to **Deploys**
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for build to complete

## Step 8: Test It

1. Complete a questionnaire on your site
2. On completion, it should automatically save to Supabase
3. Go to `/admin-view` and click **"Load from Database"**
4. You should see the response appear

## Viewing Responses in Supabase Dashboard

1. Go to your Supabase project
2. Click **Table Editor** → `questionnaire_responses`
3. You'll see all responses with:
   - User info
   - Completion status
   - Full JSON data in `response_data` column
4. Click on any row to view/edit the JSON

## Viewing Responses in Admin Interface

1. Go to `https://your-site.netlify.app/admin-view`
2. Enter admin password
3. Click **"Load from Database"**
4. All responses from Supabase will appear
5. Click any response to view full details

## Troubleshooting

### "Supabase not configured" message
- Check environment variables are set in Netlify
- Ensure variable names start with `NEXT_PUBLIC_`
- Redeploy after adding variables

### "Failed to save" error
- Check RLS policies allow INSERT
- Verify API keys are correct
- Check browser console for detailed error

### Responses not appearing
- Verify table name is exactly `questionnaire_responses`
- Check RLS policies allow SELECT
- Ensure `response_data` column is type `jsonb`

### CORS errors
- Supabase should handle CORS automatically
- If issues persist, check Supabase project settings

## Security Notes

⚠️ **Important:**
- The anon key is public (it's in your client-side code)
- RLS policies protect your data
- For sensitive data, consider:
  - Adding authentication
  - Using service role key (server-side only)
  - Restricting RLS policies further

## Alternative: Using Service Role Key (More Secure)

If you want more control, you can:
1. Use Netlify Functions (serverless)
2. Store service role key as environment variable (not `NEXT_PUBLIC_`)
3. Create API endpoint that uses service role key
4. Call that endpoint from your app

This keeps the service role key secret but requires serverless functions.

## Cost

- **Free tier:** 500MB database, 2GB bandwidth
- **Typical usage:** ~1KB per response = 500,000 responses
- **Upgrade:** Only if you exceed free tier limits

## Next Steps

- Set up email notifications when responses are submitted
- Create custom views/reports in Supabase
- Export data to CSV/Excel from Supabase dashboard
- Set up automated backups
