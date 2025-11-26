const express = require('express');
const router = express.Router();
const AgentManager = require('../managers/AgentManager');
const { generatePDF } = require('../utils/pdfGenerator');

const agentManager = new AgentManager();

/**
 * POST /api/chat
 * Process user message and return collaborative agent response
 */
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Process message through Agent Manager
    const result = await agentManager.processMessage(message);

    const response = {
      success: result.success,
      message: result.finalResponse,
      queryIntent: result.queryIntent,
      detailedReport: result.detailedReport,
      data: result.data,
      executionFlow: result.executionFlow,
      agentsUsed: result.agentsUsed
    };

    // Add PDF download URL for report and summary queries
    if (result.queryIntent === 'report' || result.queryIntent === 'summary') {
      response.pdfDownloadUrl = '/api/chat/pdf';
      response.pdfAvailable = true;
      response.pdfNote = 'You can download a PDF version by making a POST request to the pdfDownloadUrl with the same message.';
    }

    res.json(response);

  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * POST /api/chat/pdf
 * Process user message and return PDF (only for report and summary queries)
 */
router.post('/chat/pdf', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Process message through Agent Manager
    const result = await agentManager.processMessage(message);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.finalResponse
      });
    }

    // Validate that query intent is 'report' or 'summary'
    if (result.queryIntent !== 'report' && result.queryIntent !== 'summary') {
      return res.status(400).json({
        success: false,
        error: `PDF generation is only available for report and summary queries. Your query was classified as '${result.queryIntent}'. Please ask for a report or summary.`,
        queryIntent: result.queryIntent,
        suggestion: 'Try asking for a "report", "summary", or "analysis" instead.'
      });
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(result.detailedReport ? { report: result.detailedReport } : null, result.finalResponse);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=sales-${result.queryIntent}-${Date.now()}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate PDF',
      message: error.message
    });
  }
});

module.exports = router;
