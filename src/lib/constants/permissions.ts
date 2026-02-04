export type PermissionItem = {
  key: string;
  label: string;
};

export type PermissionGroup = {
  key: string;
  label: string;
  permissions: PermissionItem[];
};

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    key: "menus",
    label: "Menus",
    permissions: [
      { key: "manage_menus", label: "Manage Menus" },
      { key: "view_menus", label: "View Menus" },
      { key: "add_menus", label: "Add Menus" },
      { key: "edit_menus", label: "Edit Menus" },
      { key: "delete_menus", label: "Delete Menus" },
    ],
  },
  {
    key: "categories",
    label: "Categories",
    permissions: [
      { key: "manage_categories", label: "Manage Categories" },
      { key: "view_categories", label: "View Categories" },
      { key: "add_categories", label: "Add Categories" },
      { key: "edit_categories", label: "Edit Categories" },
      { key: "delete_categories", label: "Delete Categories" },
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    permissions: [
      { key: "manage_inventory", label: "Manage Inventory" },
      { key: "view_inventory", label: "View Inventory" },
      { key: "add_inventory", label: "Add Inventory" },
      { key: "edit_inventory", label: "Edit Inventory" },
      { key: "delete_inventory", label: "Delete Inventory" },
    ],
  },
  {
    key: "suppliers",
    label: "Suppliers",
    permissions: [
      { key: "manage_suppliers", label: "Manage Suppliers" },
      { key: "view_suppliers", label: "View Suppliers" },
      { key: "add_suppliers", label: "Add Suppliers" },
      { key: "edit_suppliers", label: "Edit Suppliers" },
      { key: "delete_suppliers", label: "Delete Suppliers" },
    ],
  },
  {
    key: "promotions",
    label: "Promotions",
    permissions: [
      { key: "manage_promotions", label: "Manage Promotions" },
      { key: "view_promotions", label: "View Promotions" },
      { key: "add_promotions", label: "Add Promotions" },
      { key: "edit_promotions", label: "Edit Promotions" },
      { key: "delete_promotions", label: "Delete Promotions" },
    ],
  },
  {
    key: "orders",
    label: "Orders",
    permissions: [
      { key: "manage_orders", label: "Manage Orders" },
      { key: "view_orders", label: "View Orders" },
      { key: "add_orders", label: "Add Orders" },
      { key: "edit_orders", label: "Edit Orders" },
      { key: "delete_orders", label: "Delete Orders" },
    ],
  },
  {
    key: "payments",
    label: "Payments",
    permissions: [
      { key: "manage_payments", label: "Manage Payments" },
      { key: "view_payments", label: "View Payments" },
      { key: "add_payments", label: "Add Payments" },
      { key: "edit_payments", label: "Edit Payments" },
      { key: "delete_payments", label: "Delete Payments" },
    ],
  },
  {
    key: "places",
    label: "Places",
    permissions: [
      { key: "manage_places", label: "Manage Places" },
      { key: "view_places", label: "View Places" },
      { key: "add_places", label: "Add Places" },
      { key: "edit_places", label: "Edit Places" },
      { key: "delete_places", label: "Delete Places" },
    ],
  },
  {
    key: "tables",
    label: "Tables",
    permissions: [
      { key: "manage_tables", label: "Manage Tables" },
      { key: "view_tables", label: "View Tables" },
      { key: "add_tables", label: "Add Tables" },
      { key: "edit_tables", label: "Edit Tables" },
      { key: "delete_tables", label: "Delete Tables" },
    ],
  },
  {
    key: "delivery_channels",
    label: "Delivery Channels",
    permissions: [
      { key: "manage_delivery_channels", label: "Manage Delivery Channels" },
      { key: "view_delivery_channels", label: "View Delivery Channels" },
      { key: "add_delivery_channels", label: "Add Delivery Channels" },
      { key: "edit_delivery_channels", label: "Edit Delivery Channels" },
      { key: "delete_delivery_channels", label: "Delete Delivery Channels" },
    ],
  },
  {
    key: "kitchen_operations",
    label: "Kitchen Operations",
    permissions: [
      { key: "manage_kitchen_operations", label: "Manage Kitchen Operations" },
      { key: "view_kitchen_operations", label: "View Kitchen Operations" },
      { key: "add_kitchen_operations", label: "Add Kitchen Operations" },
      { key: "edit_kitchen_operations", label: "Edit Kitchen Operations" },
      { key: "delete_kitchen_operations", label: "Delete Kitchen Operations" },
    ],
  },
  {
    key: "staff",
    label: "Staff",
    permissions: [
      { key: "manage_staff", label: "Manage Staff" },
      { key: "view_staff", label: "View Staff" },
      { key: "add_staff", label: "Add Staff" },
      { key: "edit_staff", label: "Edit Staff" },
      { key: "delete_staff", label: "Delete Staff" },
    ],
  },
  {
    key: "roles_permissions",
    label: "Roles & Permissions",
    permissions: [
      { key: "manage_roles_permissions", label: "Manage Roles & Permissions" },
      { key: "view_roles", label: "View Roles" },
      { key: "add_roles", label: "Add Roles" },
      { key: "edit_roles", label: "Edit Roles" },
      { key: "delete_roles", label: "Delete Roles" },
      { key: "view_permissions", label: "View Permissions" },
      { key: "add_permissions", label: "Add Permissions" },
      { key: "edit_permissions", label: "Edit Permissions" },
      { key: "delete_permissions", label: "Delete Permissions" },
    ],
  },
  {
    key: "reports",
    label: "Reports",
    permissions: [
      { key: "manage_reports", label: "Manage Reports" },
      { key: "view_reports", label: "View Reports" },
      { key: "add_reports", label: "Add Reports" },
      { key: "edit_reports", label: "Edit Reports" },
      { key: "delete_reports", label: "Delete Reports" },
    ],
  },
  {
    key: "company",
    label: "Company",
    permissions: [
      { key: "manage_company_profile", label: "Manage Company Profile" },
      { key: "manage_customer_data", label: "Manage Customer Data" },
    ],
  },
];

export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((group) =>
  group.permissions.map((permission) => permission.key)
);
