-- USERS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PROJECTS
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  project_number TEXT NOT NULL UNIQUE,
  description TEXT,
  client TEXT,
  status TEXT,
  duration INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE
);

-- EQUIPMENT TYPES
CREATE TABLE equipment_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT
);

-- INVOICES
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  equipment_type_id INTEGER NOT NULL REFERENCES equipment_types(id) ON DELETE CASCADE,
  invoice_number TEXT,
  date DATE NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT,
  notes TEXT
);

-- EXPENSES
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  category TEXT,
  amount INTEGER NOT NULL,
  description TEXT,
  date DATE NOT NULL
);
