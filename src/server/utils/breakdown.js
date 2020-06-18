/**
 * Aggregation function for composition details
 */
const reduce = (components, filter) => components.reduce((p, c) => {
  const found = p.find(el => el.key === c[filter]);
  if (found === undefined) {
    p.push({
      key: c[filter],
      percentage: c.percentage
    });
  } else {
    found.percentage += c.percentage;
  }
  return p;
}, []);

/**
 * This function returns the array in descending order based on percentage value
 */
const sortDescending = arr => arr.sort((a, b) => b.percentage - a.percentage);

/**
 * Gets the breakdown by calling the reduce and sort functions
 * @param {*} filter : one of ['year', 'region', 'variety']
 * @param {*} components : the wine specific compositional data
 */
exports.getBreakdown = (filter, components) => ({
  breakdownType: filter,
  breakdown: sortDescending(reduce(components, filter))
});
