import { UserManagementTable } from "@/components/features/admin/user-management-table";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, assign roles, and control access to the platform.
        </p>
      </div>

      {/* User management table */}
      <UserManagementTable />
    </div>
  );
}
