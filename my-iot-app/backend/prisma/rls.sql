-- Enable RLS on sensitive tables
ALTER TABLE "Patient" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GaitMetric" ENABLE ROW LEVEL SECURITY;

-- Policy: clinicians only see patients in their clinic
CREATE POLICY patient_clinic_isolation
ON "Patient"
USING ("clinicId"::uuid = current_setting('app.current_clinic')::uuid);

-- Policy: sessions limited to clinic
CREATE POLICY session_clinic_isolation
ON "Session"
USING ("patientId" IN (
  SELECT id FROM "Patient" WHERE "clinicId"::uuid = current_setting('app.current_clinic')::uuid
));

-- Metrics isolation
CREATE POLICY metric_clinic_isolation
ON "GaitMetric"
USING ("sessionId" IN (
  SELECT id FROM "Session"
  WHERE "patientId" IN (SELECT id FROM "Patient" WHERE "clinicId"::uuid = current_setting('app.current_clinic')::uuid)
));
