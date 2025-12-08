export const buildMongoQuery = (filters) => {
  const query = {};

  // Search
  if (filters.search) {
    const regex = new RegExp(filters.search, "i");
    query.$or = [
      { "customer.name": regex },
      { "customer.phone": regex },
    ];
  }

  // Multi-select fields
  const multiFilters = {
    region: "customer.region",
    gender: "customer.gender",
    category: "product.category",
    paymentMethod: "meta.paymentMethod",
    tags: "product.tags",
  };

  Object.entries(multiFilters).forEach(([key, path]) => {
    if (filters[key]) {
      query[path] = { $in: filters[key].split(",") };
    }
  });

  // Age range
  if (filters.minAge || filters.maxAge) {
    query["customer.age"] = {};
    if (filters.minAge) query["customer.age"].$gte = Number(filters.minAge);
    if (filters.maxAge) query["customer.age"].$lte = Number(filters.maxAge);
  }

  // Date range
  if (filters.startDate || filters.endDate) {
    query["meta.date"] = {};
    if (filters.startDate) query["meta.date"].$gte = new Date(filters.startDate);
    if (filters.endDate) query["meta.date"].$lte = new Date(filters.endDate);
  }

  return query;
};
