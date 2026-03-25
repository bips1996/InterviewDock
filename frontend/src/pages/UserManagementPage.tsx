import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Shield,
  ShieldOff,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  Check,
} from "lucide-react";
import { adminApi } from "@/services/api";
import { Admin } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";

export const UserManagementPage = () => {
  const navigate = useNavigate();
  const { admin: currentAdmin } = useAuthStore();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    userId: "",
    pin: "",
    confirmPin: "",
    name: "",
    isSuperAdmin: false,
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAll();
      setAdmins(data);
    } catch (error) {
      console.error("Failed to load admins:", error);
      showMessage("error", "Failed to load admin users");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCreateNew = () => {
    setEditingAdmin(null);
    setFormData({
      userId: "",
      pin: "",
      confirmPin: "",
      name: "",
      isSuperAdmin: false,
    });
    setShowForm(true);
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      userId: admin.userId,
      pin: "",
      confirmPin: "",
      name: admin.name || "",
      isSuperAdmin: admin.isSuperAdmin,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAdmin(null);
    setFormData({
      userId: "",
      pin: "",
      confirmPin: "",
      name: "",
      isSuperAdmin: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!editingAdmin) {
      if (!formData.userId.trim()) {
        showMessage("error", "User ID is required");
        return;
      }
      if (!formData.pin) {
        showMessage("error", "PIN is required");
        return;
      }
      if (!/^\d{4,6}$/.test(formData.pin)) {
        showMessage("error", "PIN must be 4-6 digits");
        return;
      }
      if (formData.pin !== formData.confirmPin) {
        showMessage("error", "PINs do not match");
        return;
      }
    } else {
      // If updating and PIN is provided
      if (formData.pin && formData.pin !== formData.confirmPin) {
        showMessage("error", "PINs do not match");
        return;
      }
      if (formData.pin && !/^\d{4,6}$/.test(formData.pin)) {
        showMessage("error", "PIN must be 4-6 digits");
        return;
      }
    }

    try {
      setSubmitting(true);

      if (editingAdmin) {
        // Update existing admin
        await adminApi.update(editingAdmin.id, {
          name: formData.name,
          pin: formData.pin || undefined,
        });
        showMessage("success", "Admin updated successfully!");
      } else {
        // Create new admin
        await adminApi.create({
          userId: formData.userId,
          pin: formData.pin,
          name: formData.name,
          isSuperAdmin: formData.isSuperAdmin,
        });
        showMessage("success", "Admin created successfully!");
      }

      handleCancel();
      loadAdmins();
    } catch (error: any) {
      console.error("Failed to save admin:", error);
      showMessage(
        "error",
        error.response?.data?.message || "Failed to save admin",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (admin: Admin) => {
    if (admin.id === currentAdmin?.id) {
      showMessage("error", "You cannot deactivate your own account");
      return;
    }

    if (admin.isSuperAdmin) {
      showMessage("error", "Super admin accounts cannot be deactivated");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to deactivate ${admin.name || admin.userId}?`,
      )
    ) {
      return;
    }

    try {
      setSubmitting(true);
      await adminApi.deactivate(admin.id);
      showMessage("success", "Admin deactivated successfully!");
      loadAdmins();
    } catch (error: any) {
      console.error("Failed to deactivate admin:", error);
      showMessage(
        "error",
        error.response?.data?.message || "Failed to deactivate admin",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivate = async (admin: Admin) => {
    if (
      !confirm(
        `Are you sure you want to activate ${admin.name || admin.userId}?`,
      )
    ) {
      return;
    }

    try {
      setSubmitting(true);
      await adminApi.activate(admin.id);
      showMessage("success", "Admin activated successfully!");
      loadAdmins();
    } catch (error: any) {
      console.error("Failed to activate admin:", error);
      showMessage(
        "error",
        error.response?.data?.message || "Failed to activate admin",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Panel
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 mr-2 sm:mr-3 flex-shrink-0" />
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  User Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Manage admin accounts and permissions
                </p>
              </div>
            </div>

            {!showForm && currentAdmin?.isSuperAdmin && (
              <button
                onClick={handleCreateNew}
                className="flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Create New Admin
              </button>
            )}
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg flex items-start ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            )}
            <span className="text-sm sm:text-base">{message.text}</span>
          </div>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
              {editingAdmin ? "Edit Admin" : "Create New Admin"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User ID *
                  </label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={(e) =>
                      setFormData({ ...formData, userId: e.target.value })
                    }
                    disabled={!!editingAdmin}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
                    placeholder="Enter user ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {editingAdmin
                      ? "New PIN (leave empty to keep current)"
                      : "PIN *"}
                  </label>
                  <input
                    type="password"
                    value={formData.pin}
                    onChange={(e) =>
                      setFormData({ ...formData, pin: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                    placeholder="4-6 digit PIN"
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter 4-6 digits</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm PIN {!editingAdmin && "*"}
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPin}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPin: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                    placeholder="Confirm PIN"
                    maxLength={6}
                  />
                </div>
              </div>

              {!editingAdmin && currentAdmin?.isSuperAdmin && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isSuperAdmin"
                    checked={formData.isSuperAdmin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isSuperAdmin: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isSuperAdmin"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Grant Super Admin privileges
                  </label>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  {submitting && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingAdmin ? "Update Admin" : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Admins List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Admin Users
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading admin users...</p>
            </div>
          ) : admins.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No admin users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Last Login
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Created
                    </th>
                    {currentAdmin?.isSuperAdmin && (
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {admin.name || "—"}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {admin.userId}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            admin.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {admin.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {admin.isSuperAdmin ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Shield className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">
                              Super Admin
                            </span>
                            <span className="sm:hidden">Super</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <ShieldOff className="h-3 w-3 mr-1" />
                            Admin
                          </span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        {admin.lastLoginAt
                          ? formatDate(admin.lastLoginAt)
                          : "Never"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {formatDate(admin.createdAt)}
                      </td>
                      {currentAdmin?.isSuperAdmin && (
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleEdit(admin)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit admin"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            {admin.id !== currentAdmin?.id &&
                              admin.isActive &&
                              !admin.isSuperAdmin && (
                                <button
                                  onClick={() => handleDeactivate(admin)}
                                  disabled={submitting}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Deactivate admin"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            {!admin.isActive && (
                              <button
                                onClick={() => handleActivate(admin)}
                                disabled={submitting}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Activate admin"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
