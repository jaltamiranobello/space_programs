CREATE TABLE IF NOT EXISTS Signatures (
  treaty_title VARCHAR(150),
  country_name VARCHAR(60),
  signed_date DATE,
  signed_year YEAR,
  bound_date DATE,
  bound_year YEAR,
  PRIMARY KEY (treaty_title, country_name),
  CONSTRAINT fk_signature_treaty
    FOREIGN KEY (treaty_title)
    REFERENCES Treaties(treaty_title),
  CONSTRAINT fk_signature_country
    FOREIGN KEY (country_name)
    REFERENCES Countries(country_name)
);
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
);CREATE TABLE IF NOT EXISTS Countries (
  country_name VARCHAR(60) PRIMARY KEY,
  country_code VARCHAR(4) UNIQUE,
  has_program BOOLEAN
);

CREATE TABLE IF NOT EXISTS Programs (
  program_name VARCHAR(100) PRIMARY KEY,
  country_name VARCHAR(60),
  program_type VARCHAR(50),
  date_established DATE,
  year_established YEAR,
  num_of_satellites INT,
  num_of_astronauts INT,
  CONSTRAINT fk_program_country
    FOREIGN KEY (country_name)
    REFERENCES Countries(country_name)
);

CREATE TABLE IF NOT EXISTS Treaties (
  treaty_title VARCHAR(150) PRIMARY KEY,
  treaty_abbreviation VARCHAR(50),
  date_created DATE,
  year_created YEAR
);

CREATE TABLE IF NOT EXISTS Satellites (
  satellite_id INT AUTO_INCREMENT PRIMARY KEY,
  serial_number VARCHAR(100) UNIQUE,
  currently_in_orbit BOOLEAN,
  year_made YEAR
);

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

CREATE TABLE IF NOT EXISTS Signatures (
  treaty_title VARCHAR(150),
  country_name VARCHAR(60),
  signed_date DATE,
  signed_year YEAR,
  bound_date DATE,
  bound_year YEAR,
  PRIMARY KEY (treaty_title, country_name),
  CONSTRAINT fk_signature_treaty
    FOREIGN KEY (treaty_title)
    REFERENCES Treaties(treaty_title),
  CONSTRAINT fk_signature_country
    FOREIGN KEY (country_name)
    REFERENCES Countries(country_name)
);