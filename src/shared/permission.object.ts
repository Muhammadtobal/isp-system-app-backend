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
} as const;

type PermissionKey = keyof typeof PermissionsStore;
type PermissionValue = (typeof PermissionsStore)[PermissionKey];

export { PermissionsStore, PermissionKey, PermissionValue };
