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
  "date" integer,
  "description" text,
  "category" text,
  "amount" integer
);

CREATE TABLE "holdings" (
  "holdingId" serial PRIMARY KEY,
  "shares" integer,
  "symbol" text,
  "sector" text
);

CREATE TABLE "insights" (
  "insightsId" serial PRIMARY KEY,
  "goals" text,
  "health" integer,
  "ageGroupCompare" integer,
  "spendingAlert" text,
  "savingsRate" text
);

ALTER TABLE "properties" ADD FOREIGN KEY ("propertyId") REFERENCES "users" ("userId");

ALTER TABLE "transactions" ADD FOREIGN KEY ("transactionId") REFERENCES "users" ("userId");

ALTER TABLE "holdings" ADD FOREIGN KEY ("holdingId") REFERENCES "users" ("userId");

ALTER TABLE "insights" ADD FOREIGN KEY ("insightsId") REFERENCES "users" ("userId");
