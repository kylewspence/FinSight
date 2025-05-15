

INSERT INTO "users" ("userId", "userName", "hashedPassword")
VALUES
  (1, 'kdubs1', '$argon2id$v=19$m=65536,t=3,p=4$hJZ+bXoGbVpKLDy/OBtaTg$lpDtMvEx+Im5T5BzwbELTnHFwif8wiEzha6cy5flMLc');

INSERT INTO "properties" (
  "userId", "formattedAddress", "price" "priceRangeLow", "priceRangeHigh",
  "propertyType", "bedrooms", "bathrooms", "squareFootage", "yearBuilt", "lastSale", "lastSalePrice",
  "mortgagePayment", "mortgageBalance", "hoaPayment", "monthlyRent", "interestRate",
  "notes", "image"
)
VALUES (
  1,
  '30925 W Fairmount Ave, Buckeye, AZ 85396',
  394000,
  372000,
  409760,
  'Single Family',
  4,
  3,
  1712,
  2019,
  '2022-01-01T00:00:00.000Z',
  399900,
  0,
  0,
  100,
  1800,
  0.00,
  'Notes test',
  'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=30925%20W%20Fairmount%20Ave%2C%20Buckeye%2C%20AZ%2085396&key=AIzaSyA89BdPRdEMhtWENaL6m3-Wmmkbggl6XRk'
),(
    1,
    '1548 S 228th Ct, Buckeye, AZ 85326',
    368000, 335000, 0,
    'Single Family', 3, 2, 1603, 2002,
    '2018-06-05T00:00:00.000Z', 185000,
    1185, 219600, 100, 1800, 3.00,
    NULL,
    'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=1548%20S%20228th%20Ct,%20Buckeye,%20AZ%2085326&key=AIzaSyA89BdPRdEMhtWENaL6m3-Wmmkbggl6XRk'
  ),
  (
    1,
    '23100 W Papago St, Buckeye, AZ 85326',
    378000, 360000, 0,
    'Single Family', 4, 3, 1920, 2003,
    '2020-05-12T00:00:00.000Z', 225000,
    0, 0, 100, 1800, 0.00,
    NULL,
    'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=23100%20W%20Papago%20St,%20Buckeye,%20AZ%2085326&key=AIzaSyA89BdPRdEMhtWENaL6m3-Wmmkbggl6XRk'
  ),
  (1, '24475 W Atlanta Ave, Buckeye, AZ 85326', 371000, 355000, 0, 'Single Family', 3, 3, 1551, 2017, '2022-01-12T00:00:00.000Z', 364900, 0, 0, 100, 1800, 0.00, NULL, 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=24475%20W%20Atlanta%20Ave,%20Buckeye,%20AZ%2085326&key=AIzaSyA89BdPRdEMhtWENaL6m3-Wmmkbggl6XRk'),
(1, '23973 W Hidalgo Ave, Buckeye, AZ 85326', 375000, 354000, 0, 'Single Family', 4, 3, 1569, 2008, '2018-09-25T00:00:00.000Z', 191000, 0, 0, 100, 1800, 0.00, 'Test', 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=23973%20W%20Hidalgo%20Ave,%20Buckeye,%20AZ%2085326&key=AIzaSyA89BdPRdEMhtWENaL6m3-Wmmkbggl6XRk');



-- Accounts Data
INSERT INTO "accounts" (id, name, institution, balance, previous_balance, change_percent, last_updated) VALUES
  ('acc1', '401(k)', 'Fidelity', 1870450, 1786500, 4.7, '2023-12-31'),
  ('acc2', 'Roth IRA', 'Vanguard', 962300, 924500, 4.1, '2023-12-31'),
  ('acc3', 'Brokerage', 'Charles Schwab', 1294900, 1234800, 4.9, '2023-12-31');

-- Holdings Data
INSERT INTO "holdings" (id, symbol, name, category, shares, price, value, cost_basis, gain, gain_percent) VALUES
  ('h1', 'VTI', 'Vanguard Total Stock Market ETF', 'ETF', 3240, 248.72, 805852.8, 712000, 93852.8, 13.2),
  ('h2', 'AAPL', 'Apple Inc.', 'Stock', 1850, 182.63, 337865.5, 275000, 62865.5, 22.9),
  ('h3', 'MSFT', 'Microsoft Corporation', 'Stock', 825, 402.95, 332433.75, 240000, 92433.75, 38.5),
  ('h4', 'BND', 'Vanguard Total Bond Market ETF', 'ETF', 5240, 72.84, 381681.6, 395000, -13318.4, -3.4),
  ('h5', 'VNQ', 'Vanguard Real Estate ETF', 'ETF', 985, 85.32, 84040.2, 79800, 4240.2, 5.3);

-- Performance Data
INSERT INTO "performance" (date, portfolio, sp500) VALUES
  ('2023-01', 3650000, 3650000),
  ('2023-02', 3685000, 3726300),
  ('2023-03', 3720000, 3694200),
  ('2023-04', 3708000, 3730500),
  ('2023-05', 3775000, 3796800),
  ('2023-06', 3820000, 3831000),
  ('2023-07', 3865000, 3875200),
  ('2023-08', 3888000, 3788900),
  ('2023-09', 3920000, 3843100),
  ('2023-10', 3965000, 3929400),
  ('2023-11', 4020000, 3986600),
  ('2023-12', 4127650, 4072000);

-- Upcoming Tasks
INSERT INTO "tasks" (id, title, description, due_date, amount, priority, category) VALUES
  (1, 'Property Tax Payment', 'Annual property tax for 123 Main St', '2024-07-15', 8750, 'high', 'tax'),
  (2, 'HOA Annual Review', 'Review HOA financial statements and budget for Oakwood Community', '2024-06-30', NULL, 'medium', 'review'),
  (3, 'Investment Portfolio Rebalancing', 'Quarterly review and rebalancing of investment allocations', '2024-07-01', NULL, 'medium', 'investment'),
  (4, 'Insurance Premium Payment', 'Homeowner''s insurance for mountain vacation property', '2024-08-15', 2450, 'high', 'insurance'),
  (5, 'Rental Property Inspection', 'Schedule annual inspection for 456 Oak Avenue', '2024-09-01', NULL, 'low', 'property');

-- Interest Income
-- This is more suitable for being computed on-the-fly but if needed:
INSERT INTO "interest_income" (type, balance, rate, monthly_income) VALUES
  ('cash', 547232, 4.75, 2163),
  ('bonds', 908083, 5.25, 3973),
  ('stockDividends', 2486590, 1.85, 3834);
