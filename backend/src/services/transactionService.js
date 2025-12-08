import Transaction from '../models/Transaction.js';
import { buildMongoQuery } from '../utils/queryBuilder.js';

// SORT MAP
const SORT_FIELDS = {
  date: "meta.date",
  quantity: "sales.quantity",
  name: "customer.name",
};

// FETCH TRANSACTIONS
export const fetchTransactions = async (params) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "date",
    order = "desc",
  } = params;

  const query = buildMongoQuery(params);
  const skip = (page - 1) * limit;
  
  const sortField = SORT_FIELDS[sortBy] || SORT_FIELDS.date;
  const sortDirection = order === "asc" ? 1 : -1;

  const baseQuery = Transaction.find(query)
    .select("-__v -updatedAt")
    .sort({ [sortField]: sortDirection })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const [data, total] = await Promise.all([
    baseQuery,
    Transaction.countDocuments(query),
  ]);

  return {
    data,
    meta: {
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      limit: Number(limit),
    },
  };
};

// FETCH FILTER OPTIONS
export const fetchFilterOptions = async () => {
  const fields = [
    'customer.region',
    'product.category',
    'meta.paymentMethod',
    'product.tags',
  ];

  const results = await Promise.all(
    fields.map((f) => Transaction.distinct(f))
  );

  return {
    regions: results[0],
    categories: results[1],
    paymentMethods: results[2],
    tags: results[3],
  };
};
