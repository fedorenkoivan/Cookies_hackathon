import { questModel } from "../models/questModel.js";

const checkFilters = (params) => {
  let query = {};
  const reservedParams = ["limit", "sort"];

  Object.keys(params).forEach((key) => {
    if (!reservedParams.includes(key)) {
      if (key.includes(".")) {
        const [field, operator] = key.split(".");
        if (!query[field]) query[field] = {};

        const operatorMap = {
          eq: "$eq",
          lt: "$lt",
          lte: "$lte",
          gt: "$gt",
          gte: "$gte",
          ne: "$ne",
          re: "$regex"
        };

        if (operator === "regex") {
          query[field] = {
            $regex: params[key]
          }
        } else if (operatorMap[operator]) {
          query[field][operatorMap[operator]] = params[key];
        }
      } else {
        query[key] = params[key];
      }
    }
  });
  return query;
};

const checkSort = (sort) => {
  let sortOptions = {};

  if (sort) {
    sort.split(",").forEach((field) => {
      if (field.includes(":")) {
        const [name, direction] = field.split(":");
        if (direction.toLowerCase() === "desc") {
          sortOptions[name] = -1;
        } else if (direction.toLowerCase() === "asc") {
          sortOptions[name] = 1;
        } else {
          throw new Error("Invalid sort direction. Use 'asc' or 'desc'");
        }
      } else {
        sortOptions[field] = 1;
      }
    });
  } else {
    sortOptions = { createdAt: -1 };
  }
  return sortOptions;
};

const checkLimit = (limit) => (limit ? parseInt(limit) : 20);

export const getQuests = async (request, reply) => {
  try {
    const query = checkFilters(request.query);
    let questQuery = questModel.find(query);
    questQuery = questQuery.sort(checkSort(request.query.sort));
    const limitValue = checkLimit(request.query.limit);
    questQuery = questQuery.limit(limitValue);
    const quests = await questQuery;

    return {
      status: "success",
      data: quests,
    };
  } catch (err) {
    return reply.code(500).send({
      status: "failed",
      msg: "an error occurred while getting quests",
    });
  }
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
