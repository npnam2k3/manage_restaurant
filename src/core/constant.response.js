const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
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
    INVALID_TOKEN: "Invalid token",
    TOKEN_EXPIRED: "Token expired",
    INVALID_CREDENTIALS: "Invalid credentials",
    UNAUTHORIZED: "Unauthorized access",
  },

  // User messages
  USER: {
    CREATE_SUCCESS: "User created successfully",
    UPDATE_SUCCESS: "User updated successfully",
    DELETE_SUCCESS: "User deleted successfully",
    NOT_FOUND: "User not found",
    EXISTS: "User already exists",
    INVALID_EMAIL: "Invalid email format",
    INVALID_PASSWORD: "Invalid password format",
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
