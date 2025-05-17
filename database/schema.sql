set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "userId" serial PRIMARY KEY,
  "userName" text,
  "hashedPassword" text,
  "createdAt" timestamptz
);

CREATE TABLE "properties" (
  "id" serial PRIMARY KEY,
  "userId" integer REFERENCES "users" ("userId"),
  "formattedAddress" text,
  "price" integer,
  "priceRangeLow" integer,
  "priceRangeHigh" integer,
  "propertyType" text,
  "bedrooms" integer,
  "bathrooms" numeric,
  "squareFootage" integer,
  "lastSale" text,
  "lastSalePrice" integer,
  "yearBuilt" integer,
  "mortgagePayment" integer,
  "mortgageBalance" integer,
  "hoaPayment" integer,
  "interestRate" numeric,
  "image" text,
  "monthlyRent" integer,
  "notes" text
);

CREATE TABLE "transactions" (
  "transaction_id" SERIAL PRIMARY KEY,
  "user_id" INTEGER REFERENCES "users"("userId"),
  "account_number" TEXT NOT NULL,
  "trade_date" DATE NOT NULL,
  "settlement_date" DATE NOT NULL,
  "transaction_type" TEXT NOT NULL,
  "transaction_description" TEXT,
  "investment_name" TEXT NOT NULL,
  "symbol" TEXT NOT NULL,
  "shares" NUMERIC NOT NULL,
  "share_price" NUMERIC NOT NULL,
  "principal_amount" NUMERIC NOT NULL,
  "fees" NUMERIC NOT NULL,
  "net_amount" NUMERIC NOT NULL,
  "accrued_interest" NUMERIC NOT NULL,
  "account_type" TEXT NOT NULL
);

CREATE TABLE "insights" (
  "insightId" serial PRIMARY KEY,
  "userId" integer NOT NULL REFERENCES "users"("userId") ON DELETE CASCADE,
  "overview" text NOT NULL,
  "timelineToPurchase" text NOT NULL,
  "marketTrends" text NOT NULL,
  "peerStrategies" text NOT NULL,
  "createdAt" timestamp with time zone DEFAULT now(),
  "updatedAt" timestamp with time zone DEFAULT now()
);

-- ACCOUNTS
CREATE TABLE "accounts" (
  "accountId" SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "users"("userId"),
  "name" TEXT NOT NULL,
  "institution" TEXT,
  "balance" NUMERIC NOT NULL,
  "previousBalance" NUMERIC,
  "changePercent" NUMERIC,
  "lastUpdated" DATE
);

-- HOLDINGS
CREATE TABLE "holdings" (
  "holdingId" SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "users"("userId"),
  "symbol" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT,
  "shares" NUMERIC,
  "price" NUMERIC,
  "value" NUMERIC,
  "costBasis" NUMERIC,
  "gain" NUMERIC,
  "gainPercent" NUMERIC
);

-- PERFORMANCE (Historical Growth)
CREATE TABLE "performance" (
  "performanceId" SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "users"("userId"),
  "date" TEXT NOT NULL,
  "portfolio" NUMERIC,
  "sp500" NUMERIC
);

-- INTEREST INCOME
CREATE TABLE "interest_income" (
  "incomeId" SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "users"("userId"),
  "type" TEXT, -- 'cash', 'bonds', 'stockDividends'
  "balance" NUMERIC,
  "apy" NUMERIC,     -- for cash and bonds
  "yield" NUMERIC,   -- for stock dividends
  "monthlyIncome" NUMERIC
);

-- TASKS
CREATE TABLE "tasks" (
  "taskId" SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "users"("userId"),
  "title" TEXT NOT NULL,
  "description" TEXT,
  "dueDate" DATE,
  "amount" NUMERIC,
  "priority" TEXT,
  "category" TEXT
);