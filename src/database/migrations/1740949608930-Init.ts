import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1740949608930 implements MigrationInterface {
  name = 'Init1740949608930';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "image" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "filename" character varying,
                "imageType" character varying,
                "messageId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "invite" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "token" character varying NOT NULL,
                "uses" integer NOT NULL DEFAULT '0',
                "maxUses" integer,
                "userId" uuid NOT NULL,
                "expiresAt" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_fc9fa190e5a3c5d80604a4f63e1" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."permission_action_enum" AS ENUM('create', 'read', 'update', 'delete', 'manage')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."permission_subject_enum" AS ENUM(
                'ServerConfig',
                'Channel',
                'Message',
                'Invite',
                'Role',
                'all'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "permission" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "action" "public"."permission_action_enum" NOT NULL,
                "subject" "public"."permission_subject_enum" NOT NULL,
                "roleId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_f81e83ebc05e9a49e8ab5a2303d" UNIQUE ("roleId", "action", "subject"),
                CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "role" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "color" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "displayName" character varying,
                "email" character varying,
                "password" character varying,
                "bio" character varying,
                "anonymous" boolean NOT NULL DEFAULT false,
                "locked" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "message" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "body" character varying,
                "userId" uuid NOT NULL,
                "channelId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "channel" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "channel_member" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "lastMessageReadId" integer,
                "userId" uuid NOT NULL,
                "channelId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_a4a716289e5b0468f55f8e8d225" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "role_members_user" (
                "roleId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_b47ecc28f78e95361c666b11fa8" PRIMARY KEY ("roleId", "userId")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_bc4c45c917cd69cef0574dc3c0" ON "role_members_user" ("roleId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_8ebd83d04eb1d0270c6e1d9d62" ON "role_members_user" ("userId")
        `);
    await queryRunner.query(`
            ALTER TABLE "image"
            ADD CONSTRAINT "FK_f69c7f02013805481ec0edcf3ea" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "invite"
            ADD CONSTRAINT "FK_91bfeec7a9574f458e5b592472d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "permission"
            ADD CONSTRAINT "FK_cdb4db95384a1cf7a837c4c683e" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "message"
            ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "message"
            ADD CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "channel_member"
            ADD CONSTRAINT "FK_245da03cfde01c653c492d83a0d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "channel_member"
            ADD CONSTRAINT "FK_01ae975cf03c76e7ebfb14f22f0" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "role_members_user"
            ADD CONSTRAINT "FK_bc4c45c917cd69cef0574dc3c0a" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "role_members_user"
            ADD CONSTRAINT "FK_8ebd83d04eb1d0270c6e1d9d620" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "role_members_user" DROP CONSTRAINT "FK_8ebd83d04eb1d0270c6e1d9d620"
        `);
    await queryRunner.query(`
            ALTER TABLE "role_members_user" DROP CONSTRAINT "FK_bc4c45c917cd69cef0574dc3c0a"
        `);
    await queryRunner.query(`
            ALTER TABLE "channel_member" DROP CONSTRAINT "FK_01ae975cf03c76e7ebfb14f22f0"
        `);
    await queryRunner.query(`
            ALTER TABLE "channel_member" DROP CONSTRAINT "FK_245da03cfde01c653c492d83a0d"
        `);
    await queryRunner.query(`
            ALTER TABLE "message" DROP CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f"
        `);
    await queryRunner.query(`
            ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"
        `);
    await queryRunner.query(`
            ALTER TABLE "permission" DROP CONSTRAINT "FK_cdb4db95384a1cf7a837c4c683e"
        `);
    await queryRunner.query(`
            ALTER TABLE "invite" DROP CONSTRAINT "FK_91bfeec7a9574f458e5b592472d"
        `);
    await queryRunner.query(`
            ALTER TABLE "image" DROP CONSTRAINT "FK_f69c7f02013805481ec0edcf3ea"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_8ebd83d04eb1d0270c6e1d9d62"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_bc4c45c917cd69cef0574dc3c0"
        `);
    await queryRunner.query(`
            DROP TABLE "role_members_user"
        `);
    await queryRunner.query(`
            DROP TABLE "channel_member"
        `);
    await queryRunner.query(`
            DROP TABLE "channel"
        `);
    await queryRunner.query(`
            DROP TABLE "message"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TABLE "role"
        `);
    await queryRunner.query(`
            DROP TABLE "permission"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."permission_subject_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."permission_action_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "invite"
        `);
    await queryRunner.query(`
            DROP TABLE "image"
        `);
  }
}
