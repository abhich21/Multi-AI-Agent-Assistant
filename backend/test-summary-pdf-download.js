const http = require('http');
const fs = require('fs');

console.log('═══════════════════════════════════════════════════════');
console.log('   Testing PDF Download for Summary Query');
console.log('═══════════════════════════════════════════════════════\n');

const testQuery = {
  message: "Summarize October sales"
};

const data = JSON.stringify(testQuery);

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

console.log('Requesting PDF for summary query...');
console.log(`Query: "${testQuery.message}"\n`);

const req = http.request(options, (res) => {
  const chunks = [];

  res.on('data', (chunk) => {
    chunks.push(chunk);
  });

  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Content-Type:', res.headers['content-type']);
    
    if (res.statusCode === 200) {
      const buffer = Buffer.concat(chunks);
      const filename = 'sales-summary-test.pdf';
      fs.writeFileSync(filename, buffer);
      console.log(`\n✅ PDF Generated Successfully!`);
      console.log(`   Filename: ${filename}`);
      console.log(`   Size: ${buffer.length} bytes`);
      console.log(`\n✅ Summary queries can now download PDFs!`);
    } else {
      const errorData = buffer.toString();
      console.log(`\n❌ PDF Generation Failed`);
      console.log(`   Error: ${errorData}`);
    }
    
    console.log('\n' + '═'.repeat(60) + '\n');
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
