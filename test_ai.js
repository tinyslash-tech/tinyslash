const axios = require('axios');
async function test() {
  try {
    const res = await axios.post('http://localhost:8080/api/ai/pages/generate', {
      category: 'BUSINESS_TECH',
      prompt: 'A tech startup building AI tools'
    }, {
      headers: {
        'X-Request-Id': 'test-12345',
        'Authorization': 'Bearer test-token-to-bypass-but-fail-auth'
      }
    });
    console.log(res.data);
  } catch(e) {
    console.error(e.response ? e.response.status + ' ' + e.response.data : e.message);
  }
}
test();
