# CCA-Migrations

A powerful PostgreSQL migration tool with support for TypeORM and NestJS. This tool helps you manage database migrations with ease and provides a simple CLI interface.

## Features

- PostgreSQL database support
- TypeORM integration
- Migration management (run, revert, fix, force)
- Support for custom migration files
- Transaction support
- Detailed logging

## Configuration

Create a `db.config.json` file in your project root:

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "your_username",
  "password": "your_password",
  "database": "your_database"
}
```

## Creating Migrations

1. Create a `migrations` directory in your project root:
```bash
mkdir migrations
```

2. Create a new migration file in the migrations directory. Migration files should follow this format:
```javascript
module.exports = class YourMigrationName {
  name = 'YourMigrationName'

  async up(queryRunner) {
    // Your migration code here
  }

  async down(queryRunner) {
    // Your rollback code here
  }
}
```

## Usage

### Running Migrations

```bash
npx cca-migrations run
```

### Reverting Migrations

```bash
npx cca-migrations revert
```

### Fixing Migrations

```bash
npx cca-migrations fix
```

### Force Running Migrations

```bash
npx cca-migrations force
```

## Example Migration

Here's an example migration that creates users and auth tables:

```javascript
module.exports = class CreateUserAndAuthTables {
  name = 'CreateUserAndAuthTables'

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" varchar NOT NULL,
        "name" varchar NOT NULL,
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
```

## Error Handling

The tool provides detailed error messages and logging. If you encounter any issues:

1. Check your database configuration
2. Ensure migrations directory exists
3. Verify migration file syntax
4. Check database permissions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Mindaugas Baltrunas <mindaugaskul@gmail.com>

## Support

For support, email mindaugaskul@gmail.com or create an issue at [https://github.com/minde8888/cca-migrations/issues](https://github.com/minde8888/cca-migrations/issues)
