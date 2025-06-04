const RESERVED_PARAMS = ["limit", "sort", "page"];
const OPERATOR_MAP = {
  eq: "$eq",
  lt: "$lt",
  lte: "$lte",
  gt: "$gt",
  gte: "$gte",
  ne: "$ne",
  re: "$regex",
};

export const checkFilters = (params) => {
  const query = {};
  Object.entries(params).forEach(([key, value]) => {
    if (RESERVED_PARAMS.includes(key)) return;
    const [field, operator] = key.split(".");
    if (!operator) query[key] = value;
    if (!OPERATOR_MAP[operator]) return;
    query[field] ??= {};
    query[field][OPERATOR_MAP[operator]] = value;
  });
  return query;
};

const SORT_DIRECTION_TO_VALUE = { desc: -1, asc: 1 };

export const checkSort = (sort) => {
  if (!sort) return { createdAt: -1 };
  const options = sort.split(",").map((field) => {
    const [name, direction = "asc"] = field.split(":");
    const value = SORT_DIRECTION_TO_VALUE[direction.toLowerCase()];
    if (!value) {
      throw new Error("Invalid sort direction. Use 'asc' or 'desc'");
    }
    return [name, value];
  });
  return Object.fromEntries(options);
};

export const checkLimit = (limit) => (limit ? parseInt(limit) : 20);