-- session/account/verification are empty tables at this point, so this is a
-- safe type change: Better Auth is configured with generateId: "uuid", which
-- needs every table it writes to have a matching uuid id column and DB-side
-- default (gen_random_uuid()), same as user/badges/sections/pointers/page_descriptions.

ALTER TABLE "session" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "session" ALTER COLUMN "id" SET DATA TYPE UUID USING ("id"::uuid);
ALTER TABLE "session" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "account" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "account" ALTER COLUMN "id" SET DATA TYPE UUID USING ("id"::uuid);
ALTER TABLE "account" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "verification" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "verification" ALTER COLUMN "id" SET DATA TYPE UUID USING ("id"::uuid);
ALTER TABLE "verification" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
