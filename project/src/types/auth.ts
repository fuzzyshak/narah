export type UserRole = 'admin' | 'manager' | 'staff' | 'user';

export interface UserPermissions {
  canViewDashboard: boolean;
  canManageUsers: boolean;
  canManageVenues: boolean;
  canManageBookings: boolean;
  canViewReports: boolean;
  canEditContent: boolean;
  canAccessSettings: boolean;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  permissions: UserPermissions;
  firstName: string;
  lastName: string;
  createdAt: string;
  lastLogin: string;
}

export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: {
    canViewDashboard: true,
    canManageUsers: true,
    canManageVenues: true,
    canManageBookings: true,
    canViewReports: true,
    canEditContent: true,
    canAccessSettings: true,
  },
  manager: {
    canViewDashboard: true,
    canManageUsers: false,
    canManageVenues: true,
    canManageBookings: true,
    canViewReports: true,
    canEditContent: true,
    canAccessSettings: false,
  },
  staff: {
    canViewDashboard: true,
    canManageUsers: false,
    canManageVenues: false,
    canManageBookings: true,
    canViewReports: false,
    canEditContent: false,
    canAccessSettings: false,
  },
  user: {
    canViewDashboard: false,
    canManageUsers: false,
    canManageVenues: false,
    canManageBookings: false,
    canViewReports: false,
    canEditContent: false,
    canAccessSettings: false,
  },
}