# Create a new file with just the SQL statements
cat > clean-test-data.sql << 'EOF'
-- Insert test user
INSERT INTO "users" ("userName", "hashedPassword", "createdAt")
VALUES ('testuser', 'password123', CURRENT_TIMESTAMP)
RETURNING "userId";

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
EOF