export class AuthUserTables1732369546334 {
  name = "AuthUserTables1732369546334";
 
  async up(queryRunner) {
    try {
      // Drop existing objects if they exist
      await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_role_enum" CASCADE`);
      await queryRunner.query(`DROP TABLE IF EXISTS "auth" CASCADE`);
      await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
 
      // Create extension
      await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
 
      // Create ENUM type
      await queryRunner.query(
        `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user', 'guest')`
      );
 
      // Create users table
      await queryRunner.query(
        `CREATE TABLE "users" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "createdAt" TIMESTAMP DEFAULT now(),
          "updatedAt" TIMESTAMP DEFAULT now(), 
          "email" character varying NOT NULL,
          "name" character varying NOT NULL,
          "role" "public"."users_role_enum" NOT NULL DEFAULT 'user',
          "refreshToken" text,
          "is_deleted" boolean NOT NULL DEFAULT false,
          CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
          CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
        )`
      );
 
      // Create auth table
      await queryRunner.query(
        `CREATE TABLE "auth" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "createdAt" TIMESTAMP DEFAULT now(),
          "updatedAt" TIMESTAMP DEFAULT now(),
          "email" character varying NOT NULL, 
          "name" character varying NOT NULL,
          "password" character varying NOT NULL,
          "user_id" uuid,
          CONSTRAINT "UQ_b54f616411ef3824f6a5c06ea46" UNIQUE ("email"),
          CONSTRAINT "REL_9922406dc7d70e20423aeffadf" UNIQUE ("user_id"),
          CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id")
        )`
      );
 
      // Add foreign key constraint
      await queryRunner.query(
        `ALTER TABLE "auth" ADD CONSTRAINT "FK_9922406dc7d70e20423aeffadf3"
         FOREIGN KEY ("user_id") REFERENCES "users"("id") 
         ON DELETE NO ACTION ON UPDATE NO ACTION`
      );
 
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  }
 
  async down(queryRunner) {
    try {
      // Remove constraints first
      await queryRunner.query(
        `ALTER TABLE "auth" DROP CONSTRAINT IF EXISTS "FK_9922406dc7d70e20423aeffadf3"`
      );
      
      // Drop tables
      await queryRunner.query(`DROP TABLE IF EXISTS "auth"`);
      await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
      
      // Drop enum type
      await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_role_enum"`);
      
      // Drop extension if not needed
      await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
      
    } catch (error) {
      console.error("Migration rollback failed:", error);
      throw error;
    }
  }
 }