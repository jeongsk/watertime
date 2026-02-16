-- DropIndex
DROP INDEX "devices_userId_fcmToken_key";

-- DropIndex
DROP INDEX "devices_userId_apnsToken_key";

-- CreateIndex
CREATE UNIQUE INDEX "devices_fcmToken_key" ON "devices"("fcmToken");

-- CreateIndex
CREATE UNIQUE INDEX "devices_apnsToken_key" ON "devices"("apnsToken");
