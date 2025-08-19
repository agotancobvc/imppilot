// backend/src/services/audit.service.ts
import { PrismaClient } from '@prisma/client';

interface AuditLogData {
  tableName: string;
  recordId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  oldValues?: any;
  newValues?: any;
  userId?: string;
  userType?: 'clinician' | 'system';
  ipAddress?: string;
  userAgent?: string;
}

/** Create audit log entry for HIPAA compliance */
export async function auditLog(prisma: PrismaClient, data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        tableName: data.tableName,
        recordId: data.recordId,
        action: data.action,
        oldValues: data.oldValues ? JSON.stringify(data.oldValues) : null,
        newValues: data.newValues ? JSON.stringify(data.newValues) : null,
        userId: data.userId || null,
        userType: data.userType || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
    });
  } catch (error) {
    console.error('Audit logging error:', error);
    // Don't throw - audit logging shouldn't break main operations
  }
}

/** Get audit logs for a specific record */
export async function getAuditLogs(
  prisma: PrismaClient,
  tableName: string,
  recordId: string,
  limit: number = 50
) {
  return prisma.auditLog.findMany({
    where: {
      tableName,
      recordId,
    },
    orderBy: {
      timestamp: 'desc',
    },
    take: limit,
  });
}

/** Get audit logs for a user */
export async function getUserAuditLogs(
  prisma: PrismaClient,
  userId: string,
  limit: number = 100
) {
  return prisma.auditLog.findMany({
    where: {
      userId,
    },
    orderBy: {
      timestamp: 'desc',
    },
    take: limit,
  });
}
