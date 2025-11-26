const http = require('http');

console.log('═══════════════════════════════════════════════════════');
console.log('   Testing Intelligent Agent Routing System');
console.log('═══════════════════════════════════════════════════════\n');

// Test queries for each intent type
const testQueries = [
  {
    name: 'SALES QUERY',
    message: 'What were the sales in October?',
    expectedIntent: 'sales',
    expectedAgents: ['sales']
  },
  {
    name: 'REPORT QUERY',
    message: 'Give me the October report',
    expectedIntent: 'report',
    expectedAgents: ['sales', 'report']
  },
  {
    name: 'SUMMARY QUERY',
    message: 'Summarize October sales',
    expectedIntent: 'summary',
    expectedAgents: ['sales', 'report', 'summary']
  }
];

function makeRequest(testCase) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ message: testCase.message });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve({ testCase, result, statusCode: res.statusCode });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function runTests() {
  for (const testCase of testQueries) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`TEST: ${testCase.name}`);
    console.log(`${'─'.repeat(60)}`);
    console.log(`Query: "${testCase.message}"\n`);

    try {
      const { result } = await makeRequest(testCase);

      // Verify intent
      const intentMatch = result.queryIntent === testCase.expectedIntent;
      console.log(`✓ Expected Intent: ${testCase.expectedIntent}`);
      console.log(`${intentMatch ? '✓' : '✗'} Actual Intent:   ${result.queryIntent} ${intentMatch ? '✅' : '❌'}\n`);

      // Verify agents used
      const agentsMatch = JSON.stringify(result.agentsUsed) === JSON.stringify(testCase.expectedAgents);
      console.log(`✓ Expected Agents: [${testCase.expectedAgents.join(', ')}]`);
      console.log(`${agentsMatch ? '✓' : '✗'} Actual Agents:   [${result.agentsUsed.join(', ')}] ${agentsMatch ? '✅' : '❌'}\n`);

      // Show response
      console.log('Response Message:');
      console.log(`"${result.message}"\n`);

      // Show execution flow
      console.log('Execution Flow:');
      result.executionFlow.forEach((step, index) => {
        console.log(`  ${index + 1}. ${step.agent} → ${step.success ? '✓' : '✗'}`);
      });

      if (intentMatch && agentsMatch) {
        console.log(`\n✅ TEST PASSED`);
      } else {
        console.log(`\n❌ TEST FAILED`);
      }

    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log('   All Tests Completed');
  console.log(`${'═'.repeat(60)}\n`);
}

runTests();
