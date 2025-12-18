-- CreateEnum (only if not exists)
DO $$ BEGIN
    CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED', 'RESOLVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "FeedbackType" AS ENUM ('COMPLAINT', 'SUGGESTION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update Ticket table if exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Ticket') THEN
        ALTER TABLE "Ticket" ALTER COLUMN "status" TYPE "TicketStatus" USING "status"::"TicketStatus";
    END IF;
END $$;

-- Update Feedback table if exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Feedback') THEN
        ALTER TABLE "Feedback" ALTER COLUMN "type" TYPE "FeedbackType" USING "type"::"FeedbackType";
    END IF;
END $$;

