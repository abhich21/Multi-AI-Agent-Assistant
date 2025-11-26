const http = require('http');

// Test data
const testMessage = {
  message: "What were the sales in October?"
};

const data = JSON.stringify(testMessage);

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

console.log('Testing Multi-AI Agent Chatbot API...\n');
console.log('Request:', testMessage);
console.log('\n' + '='.repeat(60) + '\n');

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('\nResponse Body:');
    const parsed = JSON.parse(responseData);
    console.log(JSON.stringify(parsed, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('\nFinal Summary:');
    console.log(parsed.message);
    console.log('\n' + '='.repeat(60) + '\n');
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
