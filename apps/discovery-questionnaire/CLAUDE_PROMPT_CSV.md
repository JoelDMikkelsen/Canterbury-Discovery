# Prompt for Claude to Create Supabase CSV Import

Here's a prompt you can give to Claude (or any AI assistant) to create the CSV file:

---

**Prompt:**

Create a CSV file for importing into Supabase to create a table called `questionnaire_responses` with the following structure:

**Columns:**
- `id` (Text, Primary Key, Required) - Unique identifier for each response
- `response_data` (JSONB, Required) - Full JSON object containing the complete questionnaire response
- `user_name` (Text, Optional) - User's name
- `user_email` (Text, Optional) - User's email address
- `started_at` (Timestamp with timezone, Optional) - When the questionnaire was started (ISO 8601 format)
- `completed_at` (Timestamp with timezone, Optional) - When the questionnaire was completed (ISO 8601 format)
- `progress_percent` (Integer, Optional) - Completion percentage (0-100)
- `created_at` (Timestamp with timezone, Required, Default: now()) - When the record was created (ISO 8601 format)

**Requirements:**
1. Create a CSV file with just the header row (no data rows) for creating an empty table
2. Column names should match exactly as listed above
3. Use standard CSV format with comma separators
4. Include proper escaping if needed

**Output:**
Provide the CSV content that can be saved as a file and imported into Supabase's Table Editor.

---

**Expected Output:**

The CSV should look like:
```csv
id,response_data,user_name,user_email,started_at,completed_at,progress_percent,created_at
```

This can be imported into Supabase to automatically create the table structure.
