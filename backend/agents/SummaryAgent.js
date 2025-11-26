class SummaryAgent {
  constructor() {
    this.name = 'Summary Agent';
  }

  /**
   * Process report and create user-friendly summary
   * @param {object} reportData - Report from Report Agent
   * @returns {object} - Final summarized response
   */
  async process(reportData) {
    console.log(`[${this.name}] Summarizing report`);

    if (!reportData || !reportData.report) {
      return {
        success: false,
        message: 'No report data provided to summarize',
        summary: null
      };
    }

    const { report } = reportData;
    
    // Create concise, user-friendly summary
    const summary = this.createSummary(report);

    return {
      success: true,
      message: summary,
      fullReport: report,
      summary
    };
  }

  /**
   * Create concise summary from report
   * @param {object} report - Structured report
   * @returns {string} - User-friendly summary
   */
  createSummary(report) {
    const { month, total, analytics } = report;
    
    // Determine trend
    const trend = this.determineTrend(analytics);
    
    // Format total with K suffix
    const totalFormatted = this.formatCurrency(total);
    
    // Create growth text
    const growthText = analytics.previousMonth 
      ? ` (${analytics.growthPercentage > 0 ? '+' : ''}${analytics.growthPercentage}% from last month)`
      : '';

    // Construct summary
    let summary = `Revenue ${trend} this month — total ${totalFormatted}${growthText}.`;

    // Add insight about performance
    if (analytics.highestWeek && analytics.lowestWeek) {
      summary += ` Best performance in Week ${analytics.highestWeek.week} ($${analytics.highestWeek.revenue.toLocaleString()}).`;
    }

    return summary;
  }

  /**
   * Determine revenue trend
   * @param {object} analytics - Analytics data
   * @returns {string} - Trend description
   */
  determineTrend(analytics) {
    if (!analytics.previousMonth) {
      return 'performed well';
    }

    const growth = parseFloat(analytics.growthPercentage);
    
    if (growth > 10) {
      return 'grew strongly';
    } else if (growth > 0) {
      return 'grew steadily';
    } else if (growth === 0) {
      return 'remained stable';
    } else if (growth > -10) {
      return 'declined slightly';
    } else {
      return 'declined';
    }
  }

  /**
   * Format currency with K suffix for thousands
   * @param {number} amount - Amount to format
   * @returns {string} - Formatted string
   */
  formatCurrency(amount) {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  }
}

module.exports = SummaryAgent;
