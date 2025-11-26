# Multi-AI Agent Chatbot Backend

A Node.js Express backend featuring three collaborative AI agents with **intelligent query routing** that executes only the necessary agents based on user intent.

## 🤖 Agents

### Sales Agent

Fetches raw revenue data from the database.

### Report Agent

Analyzes sales data and creates structured analytics reports.

### Summary Agent

Formats reports into concise, user-friendly summaries.

## 🎯 Intelligent Query Routing

The system intelligently detects your intent and routes queries to the appropriate agents:

### 📊 Sales Queries

**Example:** "What were the sales in October?"

- **Agents Used**: Sales Agent only
- **Response**: Raw weekly revenue data
- **PDF Available**: ❌ No

### 📈 Report Queries

**Example:** "Give me the October report"

- **Agents Used**: Sales Agent → Report Agent
- **Response**: Structured analytics with totals, averages, and growth metrics
- **PDF Available**: ✅ Yes

### 📝 Summary Queries

**Example:** "Summarize October sales"

- **Agents Used**: Sales Agent → Report Agent → Summary Agent
- **Response**: Concise, user-friendly overview with key insights
- **PDF Available**: ✅ Yes (Optional download)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start server
node server.js
```

Server runs on `http://localhost:3000`

## 📡 API Endpoints

### POST /api/chat

Returns JSON response with results from the appropriate agents based on query intent.

**Request:**

```json
{
  "message": "Give me the October report"
}
```

**Response for Report or Summary queries** (includes PDF URL):

```json
{
  "success": true,
  "message": "October Total: $23,000. Average weekly: $5,750. Growth: +24.3% vs. September.",
  "queryIntent": "report",
  "detailedReport": {...},
  "executionFlow": [...],
  "agentsUsed": ["sales", "report"],
  "pdfDownloadUrl": "/api/chat/pdf",
  "pdfAvailable": true,
  "pdfNote": "You can download a PDF version by making a POST request to the pdfDownloadUrl with the same message."
}
```

### POST /api/chat/pdf

Returns downloadable PDF report. **Works for report and summary queries.**

**Request:**

```json
{
  "message": "Summarize October sales"
}
```

**Response:** PDF file download (filename: `sales-{intent}-{timestamp}.pdf`)

**Error for sales queries:**

```json
{
  "success": false,
  "error": "PDF generation is only available for report and summary queries...",
  "queryIntent": "sales"
}
```

## 🧪 Testing

Multiple test scripts are included:

```bash
# Test intelligent routing
node test-routing.js

# Test PDF availability across query types
node test-pdf-availability.js

# Test summary with PDF URL
node test-summary-pdf.js
```

## 📊 Sample Queries

### Sales Intent

- "What were the sales in October?"
- "Show me the revenue data for September"

### Report Intent

- "Give me the October report"
- "Show me the analytics for September"
- "Provide a detailed breakdown of November sales"

### Summary Intent

- "Summarize October sales"
- "Give me a brief overview of September revenue"
- "Quick summary of November performance"

## 🔄 PDF Behavior Summary

| Query Type  | Agents Used              | PDF in Response           | PDF Download |
| ----------- | ------------------------ | ------------------------- | ------------ |
| **Sales**   | Sales                    | ❌ No                     | ❌ Blocked   |
| **Report**  | Sales + Report           | ✅ Yes (`pdfDownloadUrl`) | ✅ Allowed   |
| **Summary** | Sales + Report + Summary | ✅ Yes (`pdfDownloadUrl`) | ✅ Allowed   |

## 🏗️ Architecture

```
User Query → Agent Manager (Detects Intent)
    ↓
┌─────────────┬──────────────┬───────────────┐
│   Sales     │   Report     │   Summary     │
├─────────────┼──────────────┼───────────────┤
│ Sales Agent │ Sales Agent  │ Sales Agent   │
│      ↓      │      ↓       │      ↓        │
│  Raw Data   │ Report Agent │ Report Agent  │
│  No PDF     │      ↓       │      ↓        │
│             │  Analytics   │ Summary Agent │
│             │  + PDF URL   │      ↓        │
│             │              │   Overview    │
│             │              │   + PDF URL   │
└─────────────┴──────────────┴───────────────┘
```

## 📦 Dependencies

- `express` - Web framework
- `pdfkit` - PDF generation
- `cors` - Cross-origin resource sharing
- `body-parser` - Request body parsing

## 🎯 Key Features

✅ **Intelligent Intent Detection** - Automatically classifies queries  
✅ **Optimized Agent Execution** - Only necessary agents run  
✅ **Context-Aware Responses** - Different outputs for different intents  
✅ **Optional PDF Downloads** - Available for report and summary queries  
✅ **PDF URL in Response** - Clients can decide to download PDF or not  
✅ **Transparent Execution** - Full execution flow in response

## 📝 Available Data

Sample data included for:

- **September**: $18,500 total
- **October**: $23,000 total (+24.3% growth)
- **November**: $29,500 total

## 📝 License

ISC
