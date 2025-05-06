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
  "propertyId" serial PRIMARY KEY,
  "userId" integer REFERENCES "users" ("userId"),
  "address" text,
  "estimatedValue" integer,
  "estimatedRangeLow" integer,
  "estimatedRangeHigh" integer,
  "type" text,
  "beds" integer,
  "bath" numeric,
  "squareFootage" integer,
  "lastSale" text,
  "lastSalePrice" integer,
  "yearBuilt" integer
);


-- CREATE TABLE "transactions" (
--   "transactionId" serial PRIMARY KEY,
--   "userId" integer REFERENCES "users" ("userId"),
--   "date" integer,
--   "description" text,
--   "category" text,
--   "amount" integer
-- );

CREATE TABLE "holdings" (
  "holding_id" SERIAL PRIMARY KEY,
  "user_id" INTEGER REFERENCES "users"("userId"),
  "account_number" TEXT NOT NULL,
  "investment_name" TEXT NOT NULL,
  "symbol" TEXT NOT NULL,
  "shares" NUMERIC NOT NULL,
  "share_price" NUMERIC NOT NULL,
  "total_value" NUMERIC NOT NULL,
  "upload_account_type" TEXT
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
