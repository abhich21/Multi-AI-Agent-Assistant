const { getSalesDataByMonth, getAvailableMonths } = require('../utils/salesData');

class SalesAgent {
  constructor() {
    this.name = 'Sales Agent';
  }

  /**
   * Process user query and fetch relevant sales data
   * @param {string} query - User query
   * @param {object} context - Additional context (e.g., month to query)
   * @returns {object} - Result containing sales data
   */
  async process(query, context = {}) {
    console.log(`[${this.name}] Processing query: "${query}"`);

    // Extract month from context or query
    const month = context.month || this.extractMonth(query);
    
    if (!month) {
      return {
        success: false,
        message: `No specific month found. Available months: ${getAvailableMonths().join(', ')}`,
        data: null
      };
    }

    // Fetch sales data
    const salesData = getSalesDataByMonth(month);

    if (!salesData) {
      return {
        success: false,
        message: `No data found for ${month}. Available months: ${getAvailableMonths().join(', ')}`,
        data: null
      };
    }

    // Format the data for the next agent
    const formattedData = this.formatData(month, salesData);

    return {
      success: true,
      message: formattedData,
      data: {
        month,
        weeks: salesData.weeks,
        total: salesData.total
      }
    };
  }

  /**
   * Extract month from user query
   * @param {string} query - User query
   * @returns {string|null} - Extracted month name or null
   */
  extractMonth(query) {
    const months = getAvailableMonths();
    const lowerQuery = query.toLowerCase();

    for (const month of months) {
      if (lowerQuery.includes(month.toLowerCase())) {
        return month;
      }
    }

    return null;
  }

  /**
   * Format sales data into a human-readable string
   * @param {string} month - Month name
   * @param {object} salesData - Sales data object
   * @returns {string} - Formatted string
   */
  formatData(month, salesData) {
    const weeklyBreakdown = salesData.weeks
      .map(w => `Week ${w.week} - $${w.revenue.toLocaleString()}`)
      .join(', ');

    return `Here's the ${month} data: ${weeklyBreakdown}.`;
  }
}

module.exports = SalesAgent;
