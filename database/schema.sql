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
  "estValue" integer,
  "range" integer,
  "type" text,
  "beds" text,
  "bath" text,
  "sqft" integer,
  "built" integer,
  "lastSale" text
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
  "shares" integer,
  "symbol" text,
  "sector" text
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
