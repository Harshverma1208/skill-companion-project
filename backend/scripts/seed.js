require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

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

// Define the directory where models are stored
const modelsDir = path.join(__dirname, '../models');

// Get all model files from the models directory
const getModelFiles = () => {
  try {
    return fs.readdirSync(modelsDir).filter(file => file.endsWith('.js'));
  } catch (error) {
    console.error(`${colors.red}Error reading models directory: ${error.message}${colors.reset}`);
    return [];
  }
};

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error(`${colors.red}MONGODB_URI is not defined in environment variables${colors.reset}`);
      process.exit(1);
    }

    console.log(`${colors.cyan}Connecting to MongoDB...${colors.reset}`);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`${colors.green}Connected to MongoDB: ${mongoose.connection.name}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Failed to connect to MongoDB: ${error.message}${colors.reset}`);
    return false;
  }
};

// Seed data for each model
const seedData = async () => {
  console.log(`${colors.bright}${colors.blue}Starting database seeding...${colors.reset}\n`);
  
  // Get model files
  const modelFiles = getModelFiles();
  
  if (modelFiles.length === 0) {
    console.log(`${colors.yellow}No model files found. Nothing to seed.${colors.reset}`);
    return false;
  }
  
  console.log(`${colors.cyan}Found ${modelFiles.length} models to seed${colors.reset}`);
  
  try {
    // Dynamically import and seed each model
    for (const file of modelFiles) {
      const modelName = path.basename(file, '.js');
      console.log(`\n${colors.cyan}Processing ${modelName}...${colors.reset}`);
      
      try {
        // Import the model
        const Model = require(path.join(modelsDir, file));
        
        // Check if this model has seed data
        const seedDataPath = path.join(__dirname, 'seedData', `${modelName}.json`);
        
        if (fs.existsSync(seedDataPath)) {
          // Read seed data
          console.log(`  Reading seed data from ${seedDataPath}`);
          const seeds = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
          
          // Count existing records
          const existingCount = await Model.countDocuments();
          console.log(`  Found ${existingCount} existing records`);
          
          if (existingCount > 0) {
            console.log(`  ${colors.yellow}⚠ Collection already has data. Skipping to avoid duplicates.${colors.reset}`);
            continue;
          }
          
          // Insert seed data
          console.log(`  Inserting ${seeds.length} records`);
          const result = await Model.insertMany(seeds);
          console.log(`  ${colors.green}✓ Successfully inserted ${result.length} records${colors.reset}`);
        } else {
          console.log(`  ${colors.yellow}⚠ No seed data found for ${modelName}${colors.reset}`);
        }
      } catch (error) {
        console.error(`  ${colors.red}✗ Error processing ${modelName}: ${error.message}${colors.reset}`);
      }
    }
    
    console.log(`\n${colors.green}✓ Database seeding completed${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`\n${colors.red}✗ Database seeding failed: ${error.message}${colors.reset}`);
    return false;
  }
};

// Run the seeding process
(async () => {
  const connected = await connectToDatabase();
  
  if (connected) {
    const success = await seedData();
    
    // Disconnect from MongoDB
    console.log(`${colors.cyan}Disconnecting from MongoDB...${colors.reset}`);
    await mongoose.disconnect();
    console.log(`${colors.green}Disconnected from MongoDB${colors.reset}`);
    
    // Exit with appropriate code
    process.exit(success ? 0 : 1);
  } else {
    process.exit(1);
  }
})(); 