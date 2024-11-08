const PERMISSIONS = {
  USER: {
    CREATE: "user:create",
    UPDATE: "user:update",
    DELETE: "user:delete",
    READ: "user:read",
    READ_ALL: "user:read-all",
    SEARCH: "user:search",
  },
  TABLE: {
    CREATE: "table:create",
    READ: "table:read",
    UPDATE: "table:update",
    DELETE: "table:delete",
  },
  CUSTOMER: {
    CREATE: "customer:create",
    READ: "customer:read",
    UPDATE: "customer:update",
    DELETE: "customer:delete",
  },
  MENU: {
    CREATE: "menu:create",
    READ: "menu:read",
    UPDATE: "menu:update",
    DELETE: "menu:delete",
  },
  ORDER: {
    CREATE: "order:create",
    READ: "order:read",
    UPDATE: "order:update",
    SEARCH: "order:search",
    SEND_REALTIME: "order:send-realtime",
    PRINT: "order:print",
  },
  REVENUE: {
    VIEW: "revenue:view",
  },
  DISCOUNT: {
    CREATE: "discount:create",
    READ: "discount:read",
    UPDATE: "discount:update",
    DELETE: "discount:delete",
    APPLY: "discount:apply",
  },
  ALL: "*",
};

module.exports = { PERMISSIONS };
