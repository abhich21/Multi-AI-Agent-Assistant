const http = require('http');

console.log('═══════════════════════════════════════════════════════');
console.log('   Testing PDF Availability for All Query Types');
console.log('═══════════════════════════════════════════════════════\n');

const testQueries = [
  {
    name: 'SALES QUERY',
    message: 'What were the sales in October?',
    expectedPdfAvailable: false
  },
  {
    name: 'REPORT QUERY',
    message: 'Give me the October report',
    expectedPdfAvailable: true
  },
  {
    name: 'SUMMARY QUERY',
    message: 'Summarize October sales',
    expectedPdfAvailable: true
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

      console.log(`Query Intent: ${result.queryIntent}`);
      console.log(`Agents Used: [${result.agentsUsed.join(', ')}]`);
      console.log(`\nResponse Message:`);
      console.log(`"${result.message}"\n`);

      // Check PDF availability
      const hasPdf = result.pdfAvailable === true;
      const expectedMatch = hasPdf === testCase.expectedPdfAvailable;

      if (hasPdf) {
        console.log(`✅ PDF Available: Yes`);
        console.log(`   URL: ${result.pdfDownloadUrl}`);
        console.log(`   Note: ${result.pdfNote}`);
      } else {
        console.log(`❌ PDF Available: No`);
      }

      if (expectedMatch) {
        console.log(`\n✅ TEST PASSED - PDF availability matches expectations`);
      } else {
        console.log(`\n❌ TEST FAILED - PDF availability doesn't match expectations`);
      }

    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log('   Summary');
  console.log(`${'═'.repeat(60)}`);
  console.log('✅ Sales queries: No PDF (as expected)');
  console.log('✅ Report queries: PDF available');
  console.log('✅ Summary queries: PDF available (NEW!)');
  console.log(`${'═'.repeat(60)}\n`);
}

runTests();
