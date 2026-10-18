-- ==============================================================================
-- PIP'S DREAM STUDIO: GUESTBOOK & ATOMIC VISITOR COUNTER MIGRATION
-- Compatible with Supabase PostgreSQL
-- ==============================================================================

-- 1. GUESTBOOK ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.guestbook_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name TEXT NOT NULL,
    message TEXT NOT NULL,
    avatar_emoji TEXT DEFAULT '⭐',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Safety validation constraints
    CONSTRAINT check_author_name_length CHECK (char_length(trim(author_name)) >= 2 AND char_length(author_name) <= 32),
    CONSTRAINT check_message_length CHECK (char_length(trim(message)) >= 3 AND char_length(message) <= 280)
);

-- Index for speedy ordering by newest entries
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON public.guestbook_entries(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone (including unauthenticated visitors) can read all guestbook entries
DROP POLICY IF EXISTS "Public can view guestbook entries" ON public.guestbook_entries;
CREATE POLICY "Public can view guestbook entries"
ON public.guestbook_entries
FOR SELECT
TO public
USING (true);

-- Policy 2: Anyone can insert a new guestbook entry subject to validation constraints
DROP POLICY IF EXISTS "Public can insert guestbook entries" ON public.guestbook_entries;
CREATE POLICY "Public can insert guestbook entries"
ON public.guestbook_entries
FOR INSERT
TO public
WITH CHECK (
    char_length(trim(author_name)) >= 2 AND
    char_length(author_name) <= 32 AND
    char_length(trim(message)) >= 3 AND
    char_length(message) <= 280
);

-- Deny UPDATE and DELETE by default (no policies added for UPDATE/DELETE, preventing visitor tampering)

-- ==============================================================================
-- 2. VISITOR COUNTER TABLE & ATOMIC RPC INCREMENT
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.visitor_counter (
    id TEXT PRIMARY KEY,
    count BIGINT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Initialize global row if it does not exist
INSERT INTO public.visitor_counter (id, count, updated_at)
VALUES ('global', 1, NOW())
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.visitor_counter ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read the visitor count
DROP POLICY IF EXISTS "Public can read visitor counter" ON public.visitor_counter;
CREATE POLICY "Public can read visitor counter"
ON public.visitor_counter
FOR SELECT
TO public
USING (true);

-- Atomic RPC function to increment the visitor counter safely
-- SECURITY DEFINER ensures arbitrary clients cannot overwrite or decrement the count
CREATE OR REPLACE FUNCTION public.increment_visitor_counter()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_count BIGINT;
BEGIN
    UPDATE public.visitor_counter
    SET count = count + 1,
        updated_at = NOW()
    WHERE id = 'global'
    RETURNING count INTO new_count;

    -- Handle case where row was missing
    IF NOT FOUND THEN
        INSERT INTO public.visitor_counter (id, count, updated_at)
        VALUES ('global', 1, NOW())
        RETURNING count INTO new_count;
    END IF;

    RETURN new_count;
END;
$$;

-- Grant execution permissions to public and authenticated users
GRANT EXECUTE ON FUNCTION public.increment_visitor_counter() TO anon, authenticated, public;
