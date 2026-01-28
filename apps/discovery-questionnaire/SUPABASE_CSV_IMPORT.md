# Supabase CSV Import Guide

## Quick Setup Using CSV Import

Instead of running SQL, you can import a CSV file to create the table structure in Supabase.

## Option 1: Import Empty Table (Recommended)

1. Go to your Supabase project
2. Click **Table Editor** (left sidebar)
3. Click **"Import data via CSV"** or **"New table"** → **"Import CSV"**
4. Upload `questionnaire_responses_empty.csv`
5. Supabase will detect the columns automatically
6. Configure column types:
   - `id` → **Text** (Primary Key)
   - `response_data` → **JSONB**
   - `user_name` → **Text** (Nullable)
   - `user_email` → **Text** (Nullable)
   - `started_at` → **Timestamp with timezone** (Nullable)
   - `completed_at` → **Timestamp with timezone** (Nullable)
   - `progress_percent` → **Integer** (Nullable)
   - `created_at` → **Timestamp with timezone** (Default: `now()`)
7. Set `id` as **Primary Key**
8. Click **"Create table"**

## Option 2: Import with Sample Data

1. Upload `questionnaire_responses.csv` (includes one sample row)
2. Follow same steps as above
3. The sample row will be imported (you can delete it later)

## After Import

1. Go to **Authentication** → **Policies** (or click shield icon on table)
2. Enable Row Level Security (RLS)
3. Create policies:
   - **INSERT policy:** Allow `anon` and `authenticated` roles
   - **SELECT policy:** Allow `anon` and `authenticated` roles

Or run this SQL in the SQL Editor:

```sql
-- Enable RLS
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Allow inserts
CREATE POLICY "Allow public insert" ON questionnaire_responses
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow reads
CREATE POLICY "Allow public read" ON questionnaire_responses
  FOR SELECT TO anon, authenticated USING (true);
```

## Column Types Reference

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | Text | ❌ | - | Primary Key |
| `response_data` | JSONB | ❌ | - | Full response JSON |
| `user_name` | Text | ✅ | - | User's name |
| `user_email` | Text | ✅ | - | User's email |
| `started_at` | Timestamptz | ✅ | - | When started |
| `completed_at` | Timestamptz | ✅ | - | When completed |
| `progress_percent` | Integer | ✅ | - | 0-100 |
| `created_at` | Timestamptz | ❌ | `now()` | Auto-set |

## Troubleshooting

### "Invalid column type" error
- Make sure `response_data` is set to **JSONB**, not Text
- Verify timestamp columns are **Timestamptz**, not just Timestamp

### "Primary key required" error
- Set `id` column as Primary Key in table settings

### Import fails
- Check CSV has no extra commas or quotes
- Ensure column names match exactly
- Try the empty CSV first, then add data manually

## Alternative: Use SQL Editor

If CSV import doesn't work, use the SQL method:
1. Go to **SQL Editor**
2. Copy contents of `supabase-setup.sql`
3. Click **Run**
