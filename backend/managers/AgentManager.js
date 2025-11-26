const SalesAgent = require('../agents/SalesAgent');
const ReportAgent = require('../agents/ReportAgent');
const SummaryAgent = require('../agents/SummaryAgent');

class AgentManager {
  constructor() {
    this.salesAgent = new SalesAgent();
    this.reportAgent = new ReportAgent();
    this.summaryAgent = new SummaryAgent();
  }

  /**
   * Process user message and orchestrate agents
   * @param {string} message - User message
   * @returns {object} - Collaborative response from appropriate agents
   */
  async processMessage(message) {
    console.log('\n=== Agent Manager Processing Message ===');
    console.log(`Message: "${message}"\n`);

    // Determine the query intent
    const queryIntent = this.determineQueryIntent(message);
    console.log(`Query Intent: ${queryIntent}\n`);

    const executionFlow = [];
    let result = {
      success: true,
      finalResponse: '',
      queryIntent: queryIntent,
      agentsUsed: [],
      executionFlow: executionFlow
    };

    try {
      // SALES INTENT: Sales Agent only
      if (queryIntent === 'sales') {
        console.log('→ Invoking Sales Agent...');
        const salesResult = await this.salesAgent.process(message);
        
        executionFlow.push({
          agent: 'Sales Agent',
          action: 'Fetch revenue data',
          result: salesResult.message,
          success: salesResult.success
        });

        result.agentsUsed = ['sales'];
        result.finalResponse = salesResult.message;
        result.success = salesResult.success;

        if (salesResult.success) {
          result.data = salesResult.data;
        }
      }
      
      // REPORT INTENT: Sales → Report
      else if (queryIntent === 'report') {
        // Step 1: Sales Agent
        console.log('→ Invoking Sales Agent...');
        const salesResult = await this.salesAgent.process(message);
        
        executionFlow.push({
          agent: 'Sales Agent',
          action: 'Fetch revenue data',
          result: salesResult.message,
          success: salesResult.success
        });

        if (!salesResult.success) {
          result.success = false;
          result.finalResponse = salesResult.message;
          result.agentsUsed = ['sales'];
          return result;
        }

        // Step 2: Report Agent
        console.log('→ Invoking Report Agent...');
        const reportResult = await this.reportAgent.process(salesResult);
        
        executionFlow.push({
          agent: 'Report Agent',
          action: 'Create structured report',
          result: reportResult.message,
          success: reportResult.success
        });

        result.agentsUsed = ['sales', 'report'];
        result.finalResponse = reportResult.message;
        result.success = reportResult.success;

        if (reportResult.success) {
          result.detailedReport = reportResult.report;
        }
      }
      
      // SUMMARY INTENT: Sales → Report → Summary
      else if (queryIntent === 'summary') {
        // Step 1: Sales Agent
        console.log('→ Invoking Sales Agent...');
        const salesResult = await this.salesAgent.process(message);
        
        executionFlow.push({
          agent: 'Sales Agent',
          action: 'Fetch revenue data',
          result: salesResult.message,
          success: salesResult.success
        });

        if (!salesResult.success) {
          result.success = false;
          result.finalResponse = salesResult.message;
          result.agentsUsed = ['sales'];
          return result;
        }

        // Step 2: Report Agent
        console.log('→ Invoking Report Agent...');
        const reportResult = await this.reportAgent.process(salesResult);
        
        executionFlow.push({
          agent: 'Report Agent',
          action: 'Create structured report',
          result: reportResult.message,
          success: reportResult.success
        });

        if (!reportResult.success) {
          result.success = false;
          result.finalResponse = reportResult.message;
          result.agentsUsed = ['sales', 'report'];
          return result;
        }

        // Step 3: Summary Agent
        console.log('→ Invoking Summary Agent...');
        const summaryResult = await this.summaryAgent.process(reportResult);
        
        executionFlow.push({
          agent: 'Summary Agent',
          action: 'Summarize and format response',
          result: summaryResult.message,
          success: summaryResult.success
        });

        result.agentsUsed = ['sales', 'report', 'summary'];
        result.finalResponse = summaryResult.message;
        result.success = summaryResult.success;

        if (summaryResult.success) {
          result.detailedReport = summaryResult.fullReport;
        }
      }

      console.log('\n=== Final Response ===');
      console.log(result.finalResponse);
      console.log('======================\n');

      return result;

    } catch (error) {
      console.error('Error in agent orchestration:', error);
      result.success = false;
      result.finalResponse = 'An error occurred while processing your request.';
      result.error = error.message;
      return result;
    }
  }

  /**
   * Determine the query intent from user message
   * @param {string} message - User message
   * @returns {string} - Query intent: 'sales', 'report', or 'summary'
   */
  determineQueryIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Summary keywords - highest priority
    const summaryKeywords = ['summary', 'summarize', 'overview', 'brief', 'concise', 'quick look'];
    const hasSummaryKeyword = summaryKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // Report keywords - medium priority
    const reportKeywords = ['report', 'analytics', 'analysis', 'breakdown', 'detailed', 'stats', 'statistics', 'performance'];
    const hasReportKeyword = reportKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // Sales data keywords - default for basic queries
    const salesKeywords = ['sales', 'revenue', 'what were', 'show me', 'get me', 'give me the data', 'fetch'];
    const hasSalesKeyword = salesKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // Determine intent based on priority
    if (hasSummaryKeyword) {
      return 'summary';
    } else if (hasReportKeyword) {
      return 'report';
    } else if (hasSalesKeyword) {
      // Check if it's asking for raw data or report
      if (lowerMessage.includes('data') && !hasReportKeyword) {
        return 'sales';
      }
      // Questions like "what were the sales" are treated as sales queries
      if (lowerMessage.includes('what were') || lowerMessage.includes('show me')) {
        return 'sales';
      }
      // Default to report for sales queries
      return 'report';
    }
    
    // Default to summary if no specific keywords found
    return 'summary';
  }

  /**
   * Get detailed execution information
   * @param {object} result - Result from processMessage
   * @returns {string} - Formatted execution details
   */
  getExecutionDetails(result) {
    if (!result.executionFlow || result.executionFlow.length === 0) {
      return 'No agents were executed.';
    }

    let details = 'Execution Flow:\n';
    result.executionFlow.forEach((step, index) => {
      details += `${index + 1}. ${step.agent}: ${step.action}\n`;
      details += `   Result: ${step.result}\n`;
    });

    return details;
  }
}

module.exports = AgentManager;
