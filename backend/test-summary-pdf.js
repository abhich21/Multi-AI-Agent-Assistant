const http = require('http');

console.log('═══════════════════════════════════════════════════════');
console.log('   Testing PDF URL in Summary Response');
console.log('═══════════════════════════════════════════════════════\n');

// Test summary query to see if it includes PDF URL
const testQuery = {
  message: "Summarize October sales"
};

const data = JSON.stringify(testQuery);

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

console.log('Testing Summary Query...');
console.log(`Query: "${testQuery.message}"\n`);

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('\nResponse:\n');
    
    const result = JSON.parse(responseData);
    console.log(JSON.stringify(result, null, 2));

    console.log('\n' + '─'.repeat(60));
    
    if (result.pdfAvailable) {
      console.log('✅ PDF Download Available!');
      console.log(`   URL: ${result.pdfDownloadUrl}`);
      console.log(`   Note: ${result.pdfNote}`);
    } else {
      console.log('❌ PDF not available in response');
    }
    
    console.log('─'.repeat(60) + '\n');
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
