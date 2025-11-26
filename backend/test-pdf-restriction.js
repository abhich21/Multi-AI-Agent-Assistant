const http = require('http');

console.log('═══════════════════════════════════════════════════════');
console.log('   Testing PDF Generation Restrictions');
console.log('═══════════════════════════════════════════════════════\n');

// Test PDF generation for different query types
const testQueries = [
  {
    name: 'PDF for REPORT Query (Should Work)',
    message: 'Give me the October report',
    expectedToWork: true
  },
  {
    name: 'PDF for SALES Query (Should Fail)',
    message: 'What were the sales in October?',
    expectedToWork: false
  },
  {
    name: 'PDF for SUMMARY Query (Should Fail)',
    message: 'Summarize October sales',
    expectedToWork: false
  }
];

function makeRequest(testCase) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ message: testCase.message });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/chat/pdf',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      const chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        
        if (res.statusCode === 200) {
          // PDF generated successfully
          resolve({ 
            testCase, 
            success: true, 
            statusCode: res.statusCode,
            pdfSize: buffer.length
          });
        } else {
          // Error response
          try {
            const errorData = JSON.parse(buffer.toString());
            resolve({ 
              testCase, 
              success: false, 
              statusCode: res.statusCode,
              error: errorData
            });
          } catch (e) {
            reject(e);
          }
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
      const result = await makeRequest(testCase);

      if (testCase.expectedToWork) {
        if (result.success) {
          console.log(`✅ PDF Generated Successfully`);
          console.log(`   Status: ${result.statusCode}`);
          console.log(`   Size: ${result.pdfSize} bytes`);
          console.log(`\n✅ TEST PASSED - PDF generation worked as expected`);
        } else {
          console.log(`❌ PDF Generation Failed`);
          console.log(`   Status: ${result.statusCode}`);
          console.log(`   Error: ${result.error.error}`);
          console.log(`\n❌ TEST FAILED - Expected PDF to generate`);
        }
      } else {
        if (!result.success) {
          console.log(`✅ PDF Generation Blocked (as expected)`);
          console.log(`   Status: ${result.statusCode}`);
          console.log(`   Query Intent: ${result.error.queryIntent}`);
          console.log(`   Error: ${result.error.error}`);
          console.log(`   Suggestion: ${result.error.suggestion}`);
          console.log(`\n✅ TEST PASSED - PDF generation correctly restricted`);
        } else {
          console.log(`❌ PDF Generated (should have been blocked)`);
          console.log(`   Status: ${result.statusCode}`);
          console.log(`   Size: ${result.pdfSize} bytes`);
          console.log(`\n❌ TEST FAILED - PDF should not have been generated`);
        }
      }

    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log('   All PDF Restriction Tests Completed');
  console.log(`${'═'.repeat(60)}\n`);
}

runTests();
