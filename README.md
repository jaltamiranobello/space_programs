# 🛰️ Space Programs

This uses MySQL for the database to store information on space programs. This was created for Bozena Welbourne and their students to store and access data regarding space programs

## Features
- Filter data by countries
- Insert data into tables
- Download csv files with existing data for future analysis

## Technical
- Node.js and Express package
- MySQL Database

## Schema

### Tables:
- **Countries**
  - `country_name` (PK)
  - `country_code` (unique)
  - `has_program`

- **Programs**
  - `program_name` (PK)
  - `country_name` (PK, FK)
  - `program_type`, `program_abbreviation`
  - `date_established`, `year_established`
  - `num_of_satellites`, `num_of_astronauts`
 
- **Treaties**
  - `treaty_title` (PK)
  - `treaty_abbreviation` (unique)
  - `date_created`, `year_created`

- **Satellites**
  - `satellite_id` (PK)
  - `serial_number` (unique)
  - `currently_in_orbit`, `year_made`

- **Launches**
  - `program_name` (PK, FK)
  - `satellite_id` (PK, FK)
  - `launch_location`, `launch_date`
  - `launch_year`, `return_date`, `return_year`

- **Signatures**
  - `treaty_title` (PK, FK)
  - `country_name` (PK, FK)
  - `signed_date`, `signed_year`
  - `bound_date`, `bound_year`
 
## Set Up the Database
```bash
mysql -u root -p -e "CREATE DATABASE space_programs;"
```

## Set Up Instructions

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/space_programs.git
cd space_programs
```

### 2. Configure environment
```env
Create a .env file in the space_app/backend:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=space_programs
```
### 3. Create Tables
- run database/refinedSchema.sql file

### 4. (Optional) Seed Starter Data
- run database/seed.sql file

### 5. Start the backend server (make sure you are in the backend folder)
```bash
node server.js
```

### 6. Start the frontend server (make sure you are in the frontend folder)
```bash
npm start
```

### 7. Open Website
- open http://localhost:3000/ to view the site!

### NOTE
- the site runs the backend on port 5001 this works on mac if on windows use port 5000