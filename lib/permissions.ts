export type Role = 'admin' | 'dispatcher' | 'driver';

export const permissions = {
  admin: {
    canEditClients: true,
    canEditVehicles: true,
    canViewReports: true,
    canExport: true,
    canManageUsers: true,
    canToggleFeatures: true,
  },
  dispatcher: {
    canEditClients: true,
    canEditVehicles: true,
    canViewReports: true,
    canExport: true,
    canManageUsers: false,
    canToggleFeatures: false,
  },
  driver: {
    canEditClients: false,
    canEditVehicles: false,
    canViewReports: false,
    canExport: false,
    canManageUsers: false,
    canToggleFeatures: false,
  },
};

export function hasPermission(role: Role, action: keyof typeof permissions.admin) {
  return permissions[role]?.[action] || false;
}