// Fixed sales data for demonstration
const salesData = {
  months: {
    'September': {
      weeks: [
        { week: 1, revenue: 4500 },
        { week: 2, revenue: 4800 },
        { week: 3, revenue: 4200 },
        { week: 4, revenue: 5000 }
      ],
      total: 18500
    },
    'October': {
      weeks: [
        { week: 1, revenue: 5000 },
        { week: 2, revenue: 6200 },
        { week: 3, revenue: 4800 },
        { week: 4, revenue: 7000 }
      ],
      total: 23000
    },
    'November': {
      weeks: [
        { week: 1, revenue: 7500 },
        { week: 2, revenue: 6800 },
        { week: 3, revenue: 7200 },
        { week: 4, revenue: 8000 }
      ],
      total: 29500
    }
  }
};

/**
 * Get sales data for a specific month
 * @param {string} month - Month name (e.g., 'October')
 * @returns {object|null} - Sales data for the month or null if not found
 */
function getSalesDataByMonth(month) {
  const monthData = salesData.months[month];
  if (!monthData) {
    return null;
  }
  return monthData;
}

/**
 * Get all available months
 * @returns {string[]} - Array of month names
 */
function getAvailableMonths() {
  return Object.keys(salesData.months);
}

module.exports = {
  salesData,
  getSalesDataByMonth,
  getAvailableMonths
};
