import { useAuth } from "../../context/AuthContext";

/**
 * Can component for conditional rendering of actions / UI elements
 * based on the user's dynamically loaded permissions.
 *
 * Usage:
 *   <Can permission="CATEGORIES_CREATE">
 *     <button>Add Category</button>
 *   </Can>
 */
export default function Can({ permission, permissions, fallback = null, children }) {
  const { hasPermission, hasAnyPermission } = useAuth();

  if (permission && !hasPermission(permission)) {
    return fallback;
  }

  if (permissions && permissions.length > 0 && !hasAnyPermission(permissions)) {
    return fallback;
  }

  return children;
}
