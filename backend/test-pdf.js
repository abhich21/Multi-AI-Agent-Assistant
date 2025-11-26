const http = require('http');
const fs = require('fs');

// Test data
const testMessage = {
  message: "Give me October sales summary"
};

const data = JSON.stringify(testMessage);

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

console.log('Testing PDF Generation...\n');
console.log('Request:', testMessage);
console.log('\n' + '='.repeat(60) + '\n');

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
      console.log(`\n✅ PDF generated successfully: ${filename}`);
      console.log(`📄 File size: ${buffer.length} bytes`);
    } else {
      console.error('Error:', chunks.toString());
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
