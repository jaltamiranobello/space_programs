-- CREATE TABLE IF NOT EXISTS Signatures (
--   treaty_title VARCHAR(150),
--   country_name VARCHAR(60),
--   signed_date DATE,
--   signed_year YEAR,
--   bound_date DATE,
--   bound_year YEAR,
--   PRIMARY KEY (treaty_title, country_name),
--   CONSTRAINT fk_signature_treaty
--     FOREIGN KEY (treaty_title)
--     REFERENCES Treaties(treaty_title),
--   CONSTRAINT fk_signature_country
--     FOREIGN KEY (country_name)
--     REFERENCES Countries(country_name)
-- );
CREATE TABLE IF NOT EXISTS Launches (
  program_name VARCHAR(100),
  satellite_id INT,
  launch_location VARCHAR(100),
  launch_date DATE,
  launch_year YEAR,
  return_date DATE,
  return_year YEAR,
  PRIMARY KEY (program_name, satellite_id),
  CONSTRAINT fk_launch_program
    FOREIGN KEY (program_name)
    REFERENCES Programs(program_name),
  CONSTRAINT fk_launch_satellite
    FOREIGN KEY (satellite_id)
    REFERENCES Satellites(satellite_id)
);
-- CREATE TABLE IF NOT EXISTS Countries (
--   country_name VARCHAR(60) PRIMARY KEY,
--   country_code VARCHAR(4) UNIQUE,
--   has_program BOOLEAN
-- );
CREATE TABLE IF NOT EXISTS Countries(
  country_name VARCHAR(60) PRIMARY KEY,
  country_code VARCHAR(4),
  has_program BOOLEAN,
  CONSTRAINT uc_countries_code UNIQUE(country_code)
);

CREATE TABLE  IF NOT EXISTS Programs(
  program_name VARCHAR(200) PRIMARY KEY,
  country_name VARCHAR(60) NOT NULL,
  program_type VARCHAR(100),
  program_abbreviation VARCHAR(10),
  date_established DATE,
  year_established YEAR,
  num_of_satellites INT,
  num_of_astronauts INT,
  CONSTRAINT fk_programs_country FOREIGN KEY (country_name) REFERENCES Countries(country_name),
  CONSTRAINT uc_programs_abb UNIQUE(program_abbreviation)
);

CREATE TABLE  IF NOT EXISTS Treaties(
  treaty_title VARCHAR(255) PRIMARY KEY,
  treaty_abbreviation VARCHAR(10),
  date_created DATE,
  year_created YEAR,
  CONSTRAINT uc_treaties_abb UNIQUE(treaty_abbreviation)
);

CREATE TABLE  IF NOT EXISTS Satellites(
  satellite_id INT AUTO_INCREMENT PRIMARY KEY,
  serial_number VARCHAR(100) UNIQUE,
  serial_number VARCHAR(20),
  currently_in_orbit BOOLEAN,
  year_made YEAR,
  CONSTRAINT uc_satellites_serial UNIQUE(serial_number)
);

CREATE TABLE  IF NOT EXISTS Launches(
  program_name VARCHAR(200),
  satellite_id INT,
  launch_location VARCHAR(60),
  launch_date DATE,
  launch_year YEAR,
  return_date DATE,
  return_year YEAR,
  CONSTRAINT pk_launch PRIMARY KEY (program_name, satellite_id),
  CONSTRAINT fk_launches_program FOREIGN KEY (program_name) REFERENCES Programs(program_name),
  CONSTRAINT fk_launches_satellite FOREIGN KEY (satellite_id) REFERENCES Satellites(satellite_id)
);

CREATE TABLE  IF NOT EXISTS Signatures(
  treaty_title VARCHAR(255),
  country_name VARCHAR(60),
  signed_date DATE,
  signed_year YEAR,
  bound_date DATE,
  bound_year YEAR,
  CONSTRAINT pk_signature PRIMARY KEY (treaty_title, country_name),
  CONSTRAINT fk_treaty FOREIGN KEY (treaty_title) REFERENCES Treaties(treaty_title),
  CONSTRAINT fk_country FOREIGN KEY (country_name) REFERENCES Countries(country_name)
);