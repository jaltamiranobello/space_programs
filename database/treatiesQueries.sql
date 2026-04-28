-- Seeder data for Treaties
INSERT INTO Treaties(treaty_title)
VALUES
('Moon Treaty'),
('Outer Space Treaty'),
('Artemis Accords');

-- Seeder data for Signatures
INSERT INTO Signatures(treaty_id, country_name, bound_date, bound_year)
VALUES
('Outer Space Treaty', 'Algeria', '1992-01-27', 1992),
('Outer Space Treaty', 'China', '1983-12-30', 1983),
('Outer Space Treaty', 'United States of America', '1967-10-10', 1967);