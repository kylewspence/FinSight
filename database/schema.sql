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


CREATE TABLE "transactions" (
  "transactionId" serial PRIMARY KEY,
  "userId" integer REFERENCES "users" ("userId"),
  "date" integer,
  "description" text,
  "category" text,
  "amount" integer
);

CREATE TABLE "holdings" (
  "holdingId" serial PRIMARY KEY,
  "userId" integer REFERENCES "users" ("userId"),
  "symbol" text NOT NULL,
  "shares" numeric NOT NULL,
  "accountName" text NOT NULL,
  "sector" text,
  "lastUpdated" timestamptz DEFAULT now(),
);

CREATE TABLE "insights" (
  "insightsId" serial PRIMARY KEY,
  "userId" integer REFERENCES "users" ("userId"),
  "goals" text,
  "health" integer,
  "ageGroupCompare" integer,
  "spendingAlert" text,
  "savingsRate" text
);
