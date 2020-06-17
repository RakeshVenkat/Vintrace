const components = [
	{
		percentage: 5.0,
		year: 2011,
		variety: 'Pinot Noir',
		region: 'Mornington'
	},
	{
		percentage: 80.0,
		year: 2011,
		variety: 'Chardonnay',
		region: 'Yarra Valley'
	},
	{
		percentage: 5.0,
		year: 2010,
		variety: 'Pinot Noir',
		region: 'Macedon'
	},
	{
		percentage: 10.0,
		year: 2010,
		variety: 'Chardonnay',
		region: 'Macedon'
	}
];

const filterKey = 'variety';
const keys = { PERCENTAGE: 'percentage', YEAR: 'year', REGION: 'region', VARIETY: 'variety' };

const reduce = (components, filter) => components.reduce((p, c) => {
	let found = p.find((el) => {
		return el.key === c[filter];
	});
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

const sortDescending = (arr) => {
	return arr.sort((a, b) => b['percentage'] - a['percentage']);
};

const getBreakdown = (filter, components) => {
	return {
		breakdownType: filter,
		breakdown: sortDescending(reduce(components, filter))
	};
};

const breakdownByYear = getBreakdown(keys.YEAR, components);
console.log(breakdownByYear)

const breakdownByRegion = getBreakdown(keys.REGION, components);
console.log(breakdownByRegion)

const breakdownByVariety = getBreakdown(keys.VARIETY, components);
console.log(breakdownByVariety)