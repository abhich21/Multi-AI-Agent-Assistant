const { getSalesDataByMonth } = require('../utils/salesData');

class ReportAgent {
  constructor() {
    this.name = 'Report Agent';
  }

  /**
   * Process sales data and create structured report
   * @param {object} salesData - Data from Sales Agent
   * @returns {object} - Structured report with analytics
   */
  async process(salesData) {
    console.log(`[${this.name}] Creating report from sales data`);

    if (!salesData || !salesData.data) {
      return {
        success: false,
        message: 'No sales data provided to create report',
        report: null
      };
    }

    const { month, weeks, total } = salesData.data;

    // Calculate analytics
    const analytics = this.calculateAnalytics(month, weeks, total);

    // Create structured report
    const report = this.createReport(month, weeks, total, analytics);

    return {
      success: true,
      message: report.summary,
      report: report
    };
  }

  /**
   * Calculate analytics from sales data
   * @param {string} month - Month name
   * @param {array} weeks - Weekly data
   * @param {number} total - Total revenue
   * @returns {object} - Analytics object
   */
  calculateAnalytics(month, weeks, total) {
    const average = total / weeks.length;
    
    // Get previous month data for comparison
    const previousMonth = this.getPreviousMonth(month);
    let growth = 0;
    let growthPercentage = 0;

    if (previousMonth) {
      const prevData = getSalesDataByMonth(previousMonth);
      if (prevData) {
        growth = total - prevData.total;
        growthPercentage = ((growth / prevData.total) * 100).toFixed(1);
      }
    }

    // Find highest and lowest performing weeks
    const highest = weeks.reduce((max, w) => w.revenue > max.revenue ? w : max, weeks[0]);
    const lowest = weeks.reduce((min, w) => w.revenue < min.revenue ? w : min, weeks[0]);

    return {
      average,
      growth,
      growthPercentage,
      previousMonth,
      highest,
      lowest
    };
  }

  /**
   * Get the previous month name
   * @param {string} month - Current month
   * @returns {string|null} - Previous month or null
   */
  getPreviousMonth(month) {
    const monthOrder = ['September', 'October', 'November', 'December'];
    const index = monthOrder.indexOf(month);
    return index > 0 ? monthOrder[index - 1] : null;
  }

  /**
   * Create structured report
   * @param {string} month - Month name
   * @param {array} weeks - Weekly data
   * @param {number} total - Total revenue
   * @param {object} analytics - Analytics data
   * @returns {object} - Structured report
   */
  createReport(month, weeks, total, analytics) {
    const summary = this.formatSummary(month, total, analytics);

    return {
      month,
      total,
      weeklyData: weeks,
      analytics: {
        averageWeekly: analytics.average,
        growth: analytics.growth,
        growthPercentage: analytics.growthPercentage,
        previousMonth: analytics.previousMonth,
        highestWeek: analytics.highest,
        lowestWeek: analytics.lowest
      },
      summary
    };
  }

  /**
   * Format report summary
   * @param {string} month - Month name
   * @param {number} total - Total revenue
   * @param {object} analytics - Analytics data
   * @returns {string} - Formatted summary
   */
  formatSummary(month, total, analytics) {
    const growthText = analytics.previousMonth 
      ? ` Growth: ${analytics.growthPercentage > 0 ? '+' : ''}${analytics.growthPercentage}% vs. ${analytics.previousMonth}.`
      : '';

    return `${month} Total: $${total.toLocaleString()}. Average weekly: $${analytics.average.toLocaleString()}.${growthText}`;
  }
}

module.exports = ReportAgent;
