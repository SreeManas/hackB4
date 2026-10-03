-- Web Push: a subscription is an endpoint plus the two keys used to encrypt payloads.
-- Renames device_token -> endpoint in place (keeps existing rows and the unique index) and adds the keys.
-- Legacy placeholder rows get NULL keys; the sender ignores rows without keys.
ALTER TABLE "push_subscriptions" RENAME COLUMN "device_token" TO "endpoint";
ALTER INDEX "push_subscriptions_device_token_key" RENAME TO "push_subscriptions_endpoint_key";
ALTER TABLE "push_subscriptions" ADD COLUMN "p256dh" TEXT, ADD COLUMN "auth" TEXT;
