const http = require('http');

const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/api/users`;

// Helper function to make HTTP requests
function makeRequest(method, url, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAPI() {
  console.log('🧪 Testing ExpressJS CRUD API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await makeRequest('GET', `${BASE_URL}/health`);
    console.log(`   Status: ${healthResponse.status}`);
    console.log(`   Response: ${JSON.stringify(healthResponse.data, null, 2)}\n`);

    // Test 2: Create User
    console.log('2. Testing Create User...');
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    };
    const createResponse = await makeRequest('POST', API_URL, newUser);
    console.log(`   Status: ${createResponse.status}`);
    console.log(`   Response: ${JSON.stringify(createResponse.data, null, 2)}\n`);

    const userId = createResponse.data.data?.id;
    if (!userId) {
      console.log('❌ Failed to create user, stopping tests');
      return;
    }

    // Test 3: Get All Users
    console.log('3. Testing Get All Users...');
    const getAllResponse = await makeRequest('GET', API_URL);
    console.log(`   Status: ${getAllResponse.status}`);
    console.log(`   Response: ${JSON.stringify(getAllResponse.data, null, 2)}\n`);

    // Test 4: Get User by ID
    console.log('4. Testing Get User by ID...');
    const getByIdResponse = await makeRequest('GET', `${API_URL}/${userId}`);
    console.log(`   Status: ${getByIdResponse.status}`);
    console.log(`   Response: ${JSON.stringify(getByIdResponse.data, null, 2)}\n`);

    // Test 5: Update User
    console.log('5. Testing Update User...');
    const updateData = {
      name: 'John Smith',
      age: 31
    };
    const updateResponse = await makeRequest('PATCH', `${API_URL}/${userId}`, updateData);
    console.log(`   Status: ${updateResponse.status}`);
    console.log(`   Response: ${JSON.stringify(updateResponse.data, null, 2)}\n`);

    // Test 6: Test Filtering
    console.log('6. Testing User Filtering...');
    const filterResponse = await makeRequest('GET', `${API_URL}?name=John&minAge=25`);
    console.log(`   Status: ${filterResponse.status}`);
    console.log(`   Response: ${JSON.stringify(filterResponse.data, null, 2)}\n`);

    // Test 7: Delete User
    console.log('7. Testing Delete User...');
    const deleteResponse = await makeRequest('DELETE', `${API_URL}/${userId}`);
    console.log(`   Status: ${deleteResponse.status}`);
    console.log(`   Response: ${JSON.stringify(deleteResponse.data, null, 2)}\n`);

    // Test 8: Verify User Deleted
    console.log('8. Verifying User Deleted...');
    const verifyDeleteResponse = await makeRequest('GET', `${API_URL}/${userId}`);
    console.log(`   Status: ${verifyDeleteResponse.status}`);
    console.log(`   Response: ${JSON.stringify(verifyDeleteResponse.data, null, 2)}\n`);

    console.log('✅ All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Check if server is running
makeRequest('GET', `${BASE_URL}/health`)
  .then(() => {
    testAPI();
  })
  .catch(() => {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   npm run dev');
  });
