const PermissionISP = {
  GET_EMPLOYEE: 'getEmployee',
  UPDATE_EMPLOYEE: 'updateEmployee',
  DELETE_EMPLOYEE: 'deleteEmployee',
  CREATE_EMPLOYEE: 'createEmployee',

  GET_EMPLOYEE_PERMISSION: 'getEmployeePermission',
  UPDATE_EMPLOYEE_PERMISSION: 'updateEmployeePermission',
  DELETE_EMPLOYEE_PERMISSION: 'deleteEmployeePermission',
  CREATE_EMPLOYEE_PERMISSION: 'createEmployeePermission',

  GET_PERMISSION: 'getPermission',
  UPDATE_PERMISSION: 'updatePermission',
  DELETE_PERMISSION: 'deletePermission',
  CREATE_PERMISSION: 'createPermission',

  GET_EXPENSE: 'getExpense',
  UPDATE_EXPENSE: 'updateExpense',
  DELETE_EXPENSE: 'deleteExpense',
  CREATE_EXPENSE: 'createExpense',

  GET_EXPENSE_TYPE: 'getExpenseType',
  UPDATE_EXPENSE_TYPE: 'updateExpenseType',
  DELETE_EXPENSE_TYPE: 'deleteExpenseType',
  CREATE_EXPENSE_TYPE: 'createExpenseType',

  GET_POINT: 'getPoint',
  UPDATE_POINT: 'updatePoint',
  DELETE_POINT: 'deletePoint',
  CREATE_POINT: 'createPoint',

  GET_PLAN: 'getPlan',
  UPDATE_PLAN: 'updatePlan',
  DELETE_PLAN: 'deletePlan',
  CREATE_PLAN: 'createPlan',

  GET_NETWORK: 'getNetwork',
  UPDATE_NETWORK: 'updateNetwork',
  DELETE_NETWORK: 'deleteNetwork',
  CREATE_NETWORK: 'createNetwork',

  GET_PAYMENT: 'getPayment',
  UPDATE_PAYMENT: 'updatePayment',
  DELETE_PAYMENT: 'deletePayment',
  CREATE_PAYMENT: 'createPayment',

  GET_CUSTOMER: 'getCustomer',
  UPDATE_CUSTOMER: 'updateCustomer',
  DELETE_CUSTOMER: 'deleteCustomer',
  CREATE_CUSTOMER: 'createCustomer',

  GET_SUBSCRIPTION: 'getSubscription',
  UPDATE_SUBSCRIPTION: 'updateSubscription',
  DELETE_SUBSCRIPTION: 'deleteSubscription',
  CREATE_SUBSCRIPTION: 'createSubscription',

  GET_USER: 'getUser',
  UPDATE_USER: 'updateUser',
  DELETE_USER: 'deleteUser',
  CREATE_USER: 'createUser',

  GET_PRODUCT: 'getProduct',
  UPDATE_PRODUCT: 'updateProduct',
  DELETE_PRODUCT: 'deleteProduct',
  CREATE_PRODUCT: 'createProduct',

  GET_SOLD: 'getSold',
  UPDATE_SOLD: 'updateSold',
  DELETE_SOLD: 'deleteSold',
  CREATE_SOLD: 'createSold',

  GET_ALERT: 'getAlert',
  UPDATE_ALERT: 'updateAlert',
  DELETE_ALERT: 'deleteAlert',
  CREATE_ALERT: 'createAlert',

  GET_DOMAIN: 'getDomain',
  UPDATE_DOMAIN: 'updateDomain',
  DELETE_DOMAIN: 'deleteDomain',
  CREATE_DOMAIN: 'createDomain',

  GET_CONSTANT: 'getConstant',
  UPDATE_CONSTANT: 'updateConstant',
  DELETE_CONSTANT: 'deleteConstant',
  CREATE_CONSTANT: 'createConstant',

  GET_NAS_NETWORK_RADIUS: 'getNasNetworkRadius',
  UPDATE_NAS_NETWORK_RADIUS: 'updateNasNetworkRadius',
  DELETE_NAS_NETWORK_RADIUS: 'deleteNasNetworkRadius',
  CREATE_NAS_NETWORK_RADIUS: 'createNasNetworkRadius',

  GET_RAD_CHECK: 'getRadCheck',
  UPDATE_RAD_CHECK: 'updateRadCheck',
  DELETE_RAD_CHECK: 'deleteRadCheck',
  CREATE_RAD_CHECK: 'createRadCheck',

  GET_GROUP_NETWORK_RADIUS: 'getGroupNetworkRadius',
  UPDATE_GROUP_NETWORK_RADIUS: 'updateGroupNetworkRadius',
  DELETE_GROUP_NETWORK_RADIUS: 'deleteGroupNetworkRadius',
  CREATE_GROUP_NETWORK_RADIUS: 'createGroupNetworkRadius',

  GET_RAD_ACCT: 'getRadAcct',
  UPDATE_RAD_ACCT: 'updateRadAcct',
  DELETE_RAD_ACCT: 'deleteRadAcct',
  CREATE_RAD_ACCT: 'createRadAcct',

  GET_RAD_GROUP_CHECK: 'getRadGroupCheck',
  UPDATE_RAD_GROUP_CHECK: 'updateRadGroupCheck',
  DELETE_RAD_GROUP_CHECK: 'deleteRadGroupCheck',
  CREATE_RAD_GROUP_CHECK: 'createRadGroupCheck',

  GET_RAD_GROUP_REPLY: 'getRadGroupReply',
  UPDATE_RAD_GROUP_REPLY: 'updateRadGroupReply',
  DELETE_RAD_GROUP_REPLY: 'deleteRadGroupReply',
  CREATE_RAD_GROUP_REPLY: 'createRadGroupReply',

  GET_RAD_POST_AUTH: 'getRadPostAuth',
  UPDATE_RAD_POST_AUTH: 'updateRadPostAuth',
  DELETE_RAD_POST_AUTH: 'deleteRadPostAuth',
  CREATE_RAD_POST_AUTH: 'createRadPostAuth',

  GET_RAD_REPLY: 'getRadReply',
  UPDATE_RAD_REPLY: 'updateRadReply',
  DELETE_RAD_REPLY: 'deleteRadReply',
  CREATE_RAD_REPLY: 'createRadReply',

  GET_RAD_USER_GROUP: 'getRadUserGroup',
  UPDATE_RAD_USER_GROUP: 'updateRadUserGroup',
  DELETE_RAD_USER_GROUP: 'deleteRadUserGroup',
  CREATE_RAD_USER_GROUP: 'createRadUserGroup',

  GET_TEMPLATE: 'getTemplate',
  UPDATE_TEMPLATE: 'updateTemplate',
  DELETE_TEMPLATE: 'deleteTemplate',
  CREATE_TEMPLATE: 'createTemplate',
} as const;

/**
 * Type of the Permission keys
 */
type PermissionKey = keyof typeof PermissionISP;

/**
 * Type of the Permission values
 */
type PermissionValue = (typeof PermissionISP)[PermissionKey];

/**
 * Permission metadata
 */
type PermissionMetadata = {
  description: string;
  translation: string;
  visual_for_user: boolean;
};

/**
 * Resources that should be visible to the user.
 *
 * RADIUS/internal permissions are hidden from the user.
 */
const hiddenResources = new Set([
  'NAS_NETWORK_RADIUS',
  'RAD_CHECK',
  'GROUP_NETWORK_RADIUS',
  'RAD_ACCT',
  'RAD_GROUP_CHECK',
  'RAD_GROUP_REPLY',
  'RAD_POST_AUTH',
  'RAD_REPLY',
  'RAD_USER_GROUP',
]);

/**
 * Human readable resource names.
 */
const resourceTranslations: Record<string, string> = {
  EMPLOYEE: 'الموظفين',
  EMPLOYEE_PERMISSION: 'صلاحيات الموظفين',
  PERMISSION: 'الصلاحيات',
  EXPENSE: 'المصاريف',
  EXPENSE_TYPE: 'أنواع المصاريف',
  POINT: 'النقاط',
  PLAN: 'الخطط',
  NETWORK: 'الشبكات',
  PAYMENT: 'الدفعات',
  CUSTOMER: 'العملاء',
  SUBSCRIPTION: 'الاشتراكات',
  USER: 'المستخدمين',
  PRODUCT: 'المنتجات',
  SOLD: 'المبيعات',
  ALERT: 'التنبيهات',
  DOMAIN: 'النطاقات',
  CONSTANT: 'الثوابت',

  NAS_NETWORK_RADIUS: 'إعدادات NAS Network Radius',
  RAD_CHECK: 'سجلات RADIUS Check',
  GROUP_NETWORK_RADIUS: 'مجموعات Network Radius',
  RAD_ACCT: 'سجلات RADIUS Accounting',
  RAD_GROUP_CHECK: 'سجلات RADIUS Group Check',
  RAD_GROUP_REPLY: 'سجلات RADIUS Group Reply',
  RAD_POST_AUTH: 'سجلات RADIUS Post Auth',
  RAD_REPLY: 'سجلات RADIUS Reply',
  RAD_USER_GROUP: 'مجموعات مستخدمي RADIUS',
  TEMPLATE: 'قوالب',
};

/**
 * English resource names.
 */
const resourceDescriptions: Record<string, string> = {
  EMPLOYEE: 'employees',
  EMPLOYEE_PERMISSION: 'employee permissions',
  PERMISSION: 'permissions',
  EXPENSE: 'expenses',
  EXPENSE_TYPE: 'expense types',
  POINT: 'points',
  PLAN: 'plans',
  NETWORK: 'networks',
  PAYMENT: 'payments',
  CUSTOMER: 'customers',
  SUBSCRIPTION: 'subscriptions',
  USER: 'users',
  PRODUCT: 'products',
  SOLD: 'sales',
  ALERT: 'alerts',
  DOMAIN: 'domains',
  CONSTANT: 'constants',

  NAS_NETWORK_RADIUS: 'NAS network radius',
  RAD_CHECK: 'RADIUS check records',
  GROUP_NETWORK_RADIUS: 'group network radius',
  RAD_ACCT: 'RADIUS accounting records',
  RAD_GROUP_CHECK: 'RADIUS group check records',
  RAD_GROUP_REPLY: 'RADIUS group reply records',
  RAD_POST_AUTH: 'RADIUS post-authentication records',
  RAD_REPLY: 'RADIUS reply records',
  RAD_USER_GROUP: 'RADIUS user groups',
  TEMPLATE: 'templates',
};

/**
 * Action translations.
 */
const actionTranslations: Record<string, string> = {
  GET: 'عرض',
  UPDATE: 'تعديل',
  DELETE: 'حذف',
  CREATE: 'إنشاء',
};

/**
 * Action descriptions.
 */
const actionDescriptions: Record<string, string> = {
  GET: 'View',
  UPDATE: 'Update',
  DELETE: 'Delete',
  CREATE: 'Create',
};

/**
 * Generate metadata automatically for every permission.
 */
const PermissionMetadata = Object.fromEntries(
  Object.keys(PermissionISP).map((key) => {
    const [action, ...resourceParts] = key.split('_');

    const resource = resourceParts.join('_');

    const resourceDescription = resourceDescriptions[resource] ?? resource;

    const resourceTranslation = resourceTranslations[resource] ?? resource;

    return [
      key,
      {
        description: `${actionDescriptions[action]} ${resourceDescription}`,
        translation: `${actionTranslations[action]} ${resourceTranslation}`,
        visual_for_user: !hiddenResources.has(resource),
      },
    ];
  }),
) as Record<PermissionKey, PermissionMetadata>;

export { PermissionISP, PermissionMetadata, PermissionKey, PermissionValue };
