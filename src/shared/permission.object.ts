const PermissionsStore = {
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
} as const;

type PermissionKey = keyof typeof PermissionsStore;
type PermissionValue = (typeof PermissionsStore)[PermissionKey];

export { PermissionsStore, PermissionKey, PermissionValue };
