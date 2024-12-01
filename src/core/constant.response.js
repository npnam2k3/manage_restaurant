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
    SEND_MAIL: "Send mail successfully",
  },

  // error message
  ERROR: {
    NOT_FOUND: "Not found",
    FORBIDDEN: "Access forbidden",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    BAD_REQUEST: "Bad request",
    INVALID_INPUT: "Invalid input data",
    VALIDATION_DATA: "Validate failure",
    CONFLICT: "Conflict request",
    SEND_MAIL: "Send mail failure",
  },

  // Auth message
  AUTH: {
    LOGIN_SUCCESS: "Login successfully",
    LOGIN_FAILED: "Login failed",
    LOGOUT_SUCCESS: "Logout successfully",
    CHANGE_PASSWORD_SUCCESS: "Change password successfully",
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
    RESET_PASSWORD_SUCCESS: "Reset password successfully",
    NOT_FOUND: "User not found",
    EXISTS: "Email or phone number already exists",
    EMAIL_EXISTS: "Email already exists",
    PHONE_NUMBER_EXISTS: "Phone number already exists",
    INVALID_EMAIL: "Invalid email format",
    INVALID_PASSWORD: "Invalid password format",
    MISSING_ID_USER: "User ID is required",
    RESET_TOKEN: "Token for reset password is required",
  },
  CUSTOMER: {
    EXISTS: "Customer already exists",
    NOT_FOUND: "Customer not found",
    PHONE_NUMBER_EXISTS: "Phone number already exists",
  },
  TABLE: {
    TABLE_ID: "Invalid table id",
    EXISTS: "Table already exists",
    NOT_FOUND: "Table not found",
    BOOKING_FAIL: "Booking table failure - Somethings went wrong",
    BOOKING_SUCCESSFULLY: "Booking table successfully",
    ORDER_FOOD_FAIL: "Order food failure",
    ORDER_FOOD_SUCCESS: "Order food successfully",
    UPDATE_ORDER_FOOD_SUCCESS: "Update order food successfully",
  },
  FOOD: {
    EXISTS: "Food already exists",
    NOT_FOUND: "Food not found",
  },
  UNIT: {
    EXISTS: "Unit already exists",
    NOT_FOUND: "Unit not found",
  },
  FOOD_CATEGORY: {
    EXISTS: "FoodCategory already exists",
    NOT_FOUND: "FoodCategory not found",
  },
  PERMISSION: {
    DENIED: "You don't have permission to access!",
  },
  DISCOUNT: {
    EXISTS: "Discount already exists",
    NOT_FOUND: "Discount not found",
    INVALID: "Discount invalid",
    MAX_PERCENTAGE:
      "The discount value by percentage must be less than or equal to 70%",
    MIN_AMOUNT:
      "The discount value in cash must be greater than or equal to 50K",
    ID: "Discount id is required",
    TOTAL_MONEY_SPENT:
      "The total purchase amount is required when this discount code is for loyal customers.",
    VALUE_DISCOUNT_LOYALTY_CUS_EXISTS:
      "The discount with this value for loyal customers already exists",
    VALUE_DISCOUNT_NORMAL_EXISTS: "The discount with this value already exists",
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
