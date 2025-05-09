require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.blue}Starting connection verification...${colors.reset}\n`);

async function verifyDatabaseConnection() {
  try {
    console.log(`${colors.cyan}Checking MongoDB connection...${colors.reset}`);
    
    if (!process.env.MONGODB_URI) {
      console.log(`${colors.red}ERROR: MONGODB_URI not found in environment variables${colors.reset}`);
      return false;
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`${colors.green}✓ Successfully connected to MongoDB: ${colors.reset}${mongoose.connection.name}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ Failed to connect to MongoDB: ${error.message}${colors.reset}`);
    return false;
  } finally {
    await mongoose.disconnect();
  }
}

async function verifyApiEndpoint(endpoint, description) {
  try {
    console.log(`${colors.cyan}Checking ${description}...${colors.reset}`);
    
    const port = process.env.PORT || 5000;
    const url = `http://localhost:${port}${endpoint}`;
    
    console.log(`  Requesting: ${url}`);
    const response = await axios.get(url);
    
    if (response.status === 200) {
      console.log(`${colors.green}✓ ${description} is available (Status: ${response.status})${colors.reset}`);
      return true;
    } else {
      console.log(`${colors.yellow}⚠ ${description} returned status ${response.status}${colors.reset}`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ ${description} check failed: ${error.message}${colors.reset}`);
    return false;
  }
}

async function runVerification() {
  console.log(`${colors.yellow}Starting server for testing...${colors.reset}`);
  // Import the server but don't start listening (we'll do that manually)
  const app = require('../server.js');
  
  const port = process.env.PORT || 5000;
  const server = app.listen(port, async () => {
    console.log(`${colors.green}Server started on port ${port} for testing${colors.reset}`);
    
    // Give the server a moment to initialize
    await sleep(1000);
    
    let dbSuccess = await verifyDatabaseConnection();
    console.log(); // Empty line for readability
    
    let apiRootSuccess = await verifyApiEndpoint('/', 'API root endpoint');
    console.log();
    
    let healthCheckSuccess = await verifyApiEndpoint('/api/health', 'Health check endpoint');
    console.log();
    
    console.log(`${colors.bright}${colors.blue}Connection Verification Summary:${colors.reset}`);
    console.log(`${dbSuccess ? colors.green + '✓' : colors.red + '✗'} Database Connection${colors.reset}`);
    console.log(`${apiRootSuccess ? colors.green + '✓' : colors.red + '✗'} API Root Endpoint${colors.reset}`);
    console.log(`${healthCheckSuccess ? colors.green + '✓' : colors.red + '✗'} Health Check Endpoint${colors.reset}`);
    
    // Close the server and exit
    server.close(() => {
      console.log(`\n${colors.bright}${colors.blue}Verification complete. Exiting.${colors.reset}`);
      process.exit(0);
    });
  });
}

runVerification().catch(err => {
  console.error(`${colors.red}Verification failed with error: ${err.message}${colors.reset}`);
  process.exit(1);
}); 