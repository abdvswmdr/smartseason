USE smartseason-db;

-- passwords are bcrypt hashes
INSERT INTO
  users (name, email, password_hash, role)
VALUES
  (
    'Tabitha Mkubwa',
    'admin@smartseason.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'admin'
  ),
  (
    'Alice Wonder',
    'bob@smartseason.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'agent'
  ),
  (
    'Carol Wanjiku',
    'carol@smartseason.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'agent'
  );

INSERT INTO
  fields (
    name,
    crop_type,
    planting_date,
    stage,
    assigned_to,
    created_by
  )
VALUES
  (
    'Kamakis Plot A',
    'Maize',
    '2026-03-01',
    'Growing',
    2,
    1
  ),
  (
    'Lanet Farm 1',
    'Wheat',
    '2026-01-10',
    'Planted',
    3,
    1
  ),
  (
    'Kilifi Block',
    'Barley',
    '2026-02-15',
    'Ready',
    2,
    1
  ),
  (
    'Thika Highlands',
    'Potato',
    '2025-12-20',
    'Harvested',
    3,
    1
  );
