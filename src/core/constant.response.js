const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

const MESSAGES = {
  // success message
  SUCCESS: {
    CREATED: "Created successfully",
    UPDATE: "Updated successfully",
    DELETE: "Deleted successfully",
    GET: "Retrieved successfully",
  },

  // error message
  ERROR: {
    NOT_FOUND: "Not found",
    FORBIDDEN: "Access forbidden",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    BAD_REQUEST: "Bad request",
    INVALID_INPUT: "Invalid input data",
    CONFLICT: "Conflict request",
  },

  // Auth message
  AUTH: {
    LOGIN_SUCCESS: "Login successfully",
    LOGIN_FAILED: "Login failed",
    LOGOUT_SUCCESS: "Logout successfully",
    INVALID_TOKEN: "Invalid access token",
    INVALID_REFRESH_TOKEN: "Invalid refresh token",
    TOKEN_EXPIRED: "Access token has expired",
    INVALID_CREDENTIALS: "Invalid credentials",
    UNAUTHENTICATED: "Unauthenticated - Please login",
    INCORRECT_PASSWORD: "Incorrect password",
    REFRESH_TOKEN_REQUIRED: "Refresh token is required",
    REFRESH_TOKEN_EXPIRED: "Refresh token expired, please login again",
  },

  // operate  database
  OPERATION_FAILED: {
    CREATE_FAILURE: "Somethings went wrong - create failed",
    UPDATE_FAILURE: "Somethings went wrong - update failed",
    DELETE_FAILURE: "Somethings went wrong - delete failed",
    COMMON: "Somethings went wrong",
  },
  // User messages
  USER: {
    CREATE_SUCCESS: "User created successfully",
    UPDATE_SUCCESS: "User updated successfully",
    DELETE_SUCCESS: "User deleted successfully",
    NOT_FOUND: "User not found",
    EXISTS: "User already exists",
    EMAIL_EXISTS: "Email already exists",
    INVALID_EMAIL: "Invalid email format",
    INVALID_PASSWORD: "Invalid password format",
    MISSING_ID_USER: "User ID is required",
  },
  CUSTOMER: {
    EXISTS: "Customer already exists",
    NOT_FOUND: "Customer not found",
  },
  TABLE: {
    EXISTS: "Table already exists",
    NOT_FOUND: "Table not found",
  },
  PERMISSION: {
    DENIED: "You don't have permission to access!",
  },
};
// Response Types
const RESPONSE_TYPE = {
  SUCCESS: "Success",
  ERROR: "Error",
  INFO: "Info",
};

module.exports = {
  HTTP_STATUS_CODE,
  MESSAGES,
  RESPONSE_TYPE,
};
