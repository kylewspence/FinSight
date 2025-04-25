## Testing the Updated Schema with Sample Data

1. **Prepare SQL Test Script**:
   Create a file `test-data.sql` with INSERT statements:

   ```sql
   -- Insert test user
   INSERT INTO "users" ("userName", "hashedPassword", "createdAt")
   VALUES ('testuser', 'password123', CURRENT_TIMESTAMP)
   RETURNING "userId";

   -- The returned userId will be 1 if this is the first user

   -- Insert test properties
   INSERT INTO "properties" ("userId", "address", "estValue", "range", "type", "beds", "bath", "sqft", "built", "lastSale")
   VALUES 
     (1, '123 Main St', 450000, 25000, 'single-family', '3', '2', 1800, 2005, '2020-01-15'),
     (1, '456 Oak Ave', 380000, 15000, 'condo', '2', '2', 1200, 2010, '2019-06-22');

   -- Insert test transactions
   INSERT INTO "transactions" ("userId", "date", "description", "category", "amount")
   VALUES 
     (1, 20240301, 'Mortgage payment', 'Housing', -1500),
     (1, 20240305, 'Grocery shopping', 'Food', -120),
     (1, 20240310, 'Salary deposit', 'Income', 3500);

   -- Insert test holdings
   INSERT INTO "holdings" ("userId", "shares", "symbol", "sector")
   VALUES 
     (1, 10, 'AAPL', 'Technology'),
     (1, 5, 'MSFT', 'Technology'),
     (1, 15, 'JNJ', 'Healthcare');

   -- Insert test insights
   INSERT INTO "insights" ("userId", "goals", "health", "ageGroupCompare", "spendingAlert", "savingsRate")
   VALUES (1, 'Save for retirement', 85, 7, 'High restaurant spending', '15%');
   ```

2. **Run the Test Script**:
   ```bash
   # Connect to your PostgreSQL database
   psql -d finsight -f test-data.sql
   ```

3. **Verify with SELECT Queries**:
   ```sql
   -- Test property relationships
   SELECT p.*, u."userName" 
   FROM "properties" p
   JOIN "users" u ON p."userId" = u."userId";

   -- Test transaction relationships
   SELECT t.*, u."userName" 
   FROM "transactions" t
   JOIN "users" u ON t."userId" = u."userId";

   -- Test holdings relationships
   SELECT h.*, u."userName" 
   FROM "holdings" h
   JOIN "users" u ON h."userId" = u."userId";

   -- Test insights relationships
   SELECT i.*, u."userName" 
   FROM "insights" i
   JOIN "users" u ON i."userId" = u."userId";
   ```

4. **Test Constraint Validation**:
   ```sql
   -- Test foreign key constraint (should fail)
   INSERT INTO "properties" ("userId", "address", "estValue")
   VALUES (999, '789 Invalid St', 300000);
   ```

5. **Clean Up Test Data** (if needed):
   ```sql
   -- Delete test data
   DELETE FROM "insights" WHERE "userId" = 1;
   DELETE FROM "holdings" WHERE "userId" = 1;
   DELETE FROM "transactions" WHERE "userId" = 1;
   DELETE FROM "properties" WHERE "userId" = 1;
   DELETE FROM "users" WHERE "userId" = 1;
   ```