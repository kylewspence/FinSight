-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);


INSERT INTO users (id, username, password_hash)
VALUES
  (1, 'kdubs1', '$argon2id$v=19$m=65536,t=3,p=4$hJZ+bXoGbVpKLDy/OBtaTg$lpDtMvEx+Im5T5BzwbELTnHFwif8wiEzha6cy5flMLc');

  