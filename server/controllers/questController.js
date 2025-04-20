import { questModel } from "../models/questModel.js";

const RESERVED_PARAMS = ["limit", "sort"];
const OPERATOR_MAP = {
  eq: "$eq",
  lt: "$lt",
  lte: "$lte",
  gt: "$gt",
  gte: "$gte",
  ne: "$ne",
  re: "$regex",
};

const checkFilters = (params) => {
  const query = {}
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

const checkSort = (sort) => {
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

const checkLimit = (limit) => (limit ? parseInt(limit) : 20);

export const getQuests = async (query, reply) => {
  const limitValue = checkLimit(query.limit);
  const sort = checkSort(query.sort);
  const filters = checkFilters(query);
  const quests = await questModel.find(filters).sort(sort).limit(limitValue);
  return reply.code(201).send({
    status: "success",
    data: quests,
  });
};

export const createQuest = async (request, reply) => {
  try {
    const newQuest = await questModel.create(request.body);

    console.log("New quest created:", newQuest);

    console.log("Request body:", request.body);
    return reply.code(201).send({
      status: "success",
      data: newQuest,
    });
  } catch (err) {
    return reply.code(500).send({
      status: "failed",
      msg: "an error occurred while creating a new quest",
    });
  }
};
