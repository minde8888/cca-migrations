# PostgreSQL Migrations Commands Guide

## Basic Commands & Their Functions

### 1. Run Migrations
```bash
npx cca-migrations run
```
Purpose:
- Executes all pending migrations in order
- Creates new database tables
- Applies schema changes
- Updates database structure

### 2. Revert Migrations
```bash
npx cca-migrations revert
```
Purpose:
- Reverts the last executed migration
- Rolls back recent database changes
- Executes the `down()` function in migration file
- Removes last applied changes

### 3. Fix Migration Issues
```bash
npx cca-migrations fix
```
Purpose:
- Repairs broken migration states
- Synchronizes migration history
- Fixes migration table inconsistencies
- Resolves stuck migrations

### 4. Force Migrations
```bash
npx cca-migrations force
```
Purpose:
- Forces migration execution regardless of state
- Bypasses migration checks
- Useful for resolving locked migrations
- Should be used with caution

## Project Structure
```
project/
├── migrations/
│   └── YYYYMMDDHHMMSS-create-table.js
└── cca.config.json
```

## Configuration File
```json
{
  "type": "postgresql",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "your_password",
  "database": "your_database"
}
```

## Migration File Template
```javascript
export const up = async (queryRunner) => {
  await queryRunner.query(`
    // Your PostgreSQL table creation/modification code
  `);
};

export const down = async (queryRunner) => {
  await queryRunner.query(`
    // Your PostgreSQL table deletion/rollback code
  `);
};
```# PostgreSQL Migrations Commands Guide

## Basic Commands & Their Functions

### 1. Run Migrations
```bash
npx cca-migrations run
```
Purpose:
- Executes all pending migrations in order
- Creates new database tables
- Applies schema changes
- Updates database structure

### 2. Revert Migrations
```bash
npx cca-migrations revert
```
Purpose:
- Reverts the last executed migration
- Rolls back recent database changes
- Executes the `down()` function in migration file
- Removes last applied changes

### 3. Fix Migration Issues
```bash
npx cca-migrations fix
```
Purpose:
- Repairs broken migration states
- Synchronizes migration history
- Fixes migration table inconsistencies
- Resolves stuck migrations

### 4. Force Migrations
```bash
npx cca-migrations force
```
Purpose:
- Forces migration execution regardless of state
- Bypasses migration checks
- Useful for resolving locked migrations
- Should be used with caution

## Project Structure
```
project/
├── migrations/
│   └── YYYYMMDDHHMMSS-create-table.js
└── cca.config.json
```

## Configuration File
```json
{
  "type": "postgresql",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "your_password",
  "database": "your_database"
}
```

## Migration File Template
```javascript
export const up = async (queryRunner) => {
  await queryRunner.query(`
    // Your PostgreSQL table creation/modification code
  `);
};

export const down = async (queryRunner) => {
  await queryRunner.query(`
    // Your PostgreSQL table deletion/rollback code
  `);
};
```
