CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceTitle" TEXT NOT NULL DEFAULT 'We''ll be back soon!',
    "maintenanceMessage" TEXT NOT NULL DEFAULT 'Our website is currently undergoing scheduled maintenance. We''re working to improve your experience.',
    "maintenanceUntil" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedById" TEXT,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "SiteSettings" ("id") VALUES ('global');

CREATE INDEX "SiteSettings_updatedById_idx" ON "SiteSettings"("updatedById");

ALTER TABLE "SiteSettings"
ADD CONSTRAINT "SiteSettings_updatedById_fkey"
FOREIGN KEY ("updatedById") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
