// Quick fix for production patient login - simplified query
export async function patientLogin(req, res) {
  try {
    const { patientName, dateOfBirth } = req.body;
    const prisma = await getPrisma();

    if (!patientName || !dateOfBirth) {
      return res.status(400).json({ message: 'Patient name and date of birth are required' });
    }

    const nameParts = patientName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    // Find patient by name and date of birth across all clinics
    const patient = await prisma.patient.findFirst({
      where: {
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: new Date(dateOfBirth)
      },
      include: {
        clinic: true
      }
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Use patient ID as subject for direct patient login
    const accessPayload = { 
      sub: patient.id, 
      pid: patient.id, 
      cid: patient.clinicId 
    };
    const accessToken = sign(accessPayload, env.JWT_ACCESS_SECRET, {
      issuer: env.JWT_ISSUER,
      expiresIn: env.JWT_ACCESS_EXPIRES,
    });
    const refreshToken = sign(accessPayload, env.JWT_REFRESH_SECRET, {
      issuer: env.JWT_ISSUER,
      expiresIn: env.JWT_REFRESH_EXPIRES,
    });

    return res.json({ patient, token: accessToken, refreshToken });
  } catch (error) {
    console.error('Patient login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
