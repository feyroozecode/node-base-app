const http = require('http');

// Test if server starts and responds
function testServer() {
  console.log('🧪 Testing server startup...');
  
  // Start the server process
  const { spawn } = require('child_process');
  const serverProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe',
    cwd: __dirname
  });

  let serverStarted = false;
  
  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('Server output:', output);
    
    if (output.includes('Server running on port') && !serverStarted) {
      serverStarted = true;
      console.log('✅ Server started successfully!');
      
      // Test health endpoint
      setTimeout(() => {
        testHealthEndpoint(() => {
          serverProcess.kill();
          console.log('✅ Test completed successfully!');
        });
      }, 2000);
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.error('Server error:', data.toString());
  });

  // Timeout after 30 seconds
  setTimeout(() => {
    if (!serverStarted) {
      console.error('❌ Server failed to start within 30 seconds');
      serverProcess.kill();
      process.exit(1);
    }
  }, 30000);
}

function testHealthEndpoint(callback) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.success && res.statusCode === 200) {
          console.log('✅ Health endpoint working correctly');
          console.log('Response:', response);
        } else {
          console.error('❌ Health endpoint returned unexpected response');
        }
      } catch (error) {
        console.error('❌ Failed to parse health endpoint response');
      }
      callback();
    });
  });

  req.on('error', (error) => {
    console.error('❌ Failed to connect to health endpoint:', error.message);
    callback();
  });

  req.end();
}

testServer();

