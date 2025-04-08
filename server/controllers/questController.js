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
        };

        if (operatorMap[operator]) {
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

const checkLimit = (limit) => limit ? parseInt(limit) : 20;

const getQuests = async (req, res) => {
  try {
    const query = checkFilters(req.query);
    let questQuery = questModel.find(query);
    questQuery = questQuery.sort(checkSort(req.query.sort));
    const limitValue = checkLimit(req.query.limit);
    questQuery = questQuery.limit(limitValue);
    const quests = await questQuery;
    res.status(200).json({ status: "success", data: quests });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      msg: "an error occurred while getting quests",
    });
  }
};

export { getQuests };
