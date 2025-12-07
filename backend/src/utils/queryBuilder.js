export const buildMongoQuery = (filters) => {
  const query = {};

  if (filters.search) {
    const searchRegex = new RegExp(filters.search, 'i');
    query.$or = [
      { "customer.name": searchRegex },
      { "customer.phone": searchRegex }
    ];
  }

  if (filters.region) query["customer.region"] = { $in: filters.region.split(',') };
  if (filters.gender) query["customer.gender"] = { $in: filters.gender.split(',') };
  if (filters.category) query["product.category"] = { $in: filters.category.split(',') };
  if (filters.paymentMethod) query["meta.paymentMethod"] = { $in: filters.paymentMethod.split(',') };

  if (filters.tags) {
    query["product.tags"] = { $in: filters.tags.split(',') };
  }

  if (filters.minAge || filters.maxAge) {
    query["customer.age"] = {};
    if (filters.minAge) query["customer.age"].$gte = Number(filters.minAge);
    if (filters.maxAge) query["customer.age"].$lte = Number(filters.maxAge);
  }

  if (filters.startDate || filters.endDate) {
    query["meta.date"] = {};
    if (filters.startDate) query["meta.date"].$gte = new Date(filters.startDate);
    if (filters.endDate) query["meta.date"].$lte = new Date(filters.endDate);
  }

  return query;
};

