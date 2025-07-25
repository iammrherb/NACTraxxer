#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Portnox Deployment Tracker - Environment Setup\n');

const questions = [
  {
    key: 'SUPABASE_URL',
    question: 'Enter your Supabase URL (https://your-project.supabase.co): ',
    required: true
  },
  {
    key: 'SUPABASE_ANON_KEY',
    question: 'Enter your Supabase Anon Key: ',
    required: true
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    question: 'Enter your Supabase Service Role Key: ',
    required: true
  }
];

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setupEnvironment() {
  const envVars = {};
  
  console.log('Please provide your Supabase credentials:\n');
  
  for (const q of questions) {
    let answer = '';
    while (!answer && q.required) {
      answer = await askQuestion(q.question);
      if (!answer && q.required) {
        console.log('❌ This field is required. Please try again.\n');
      }
    }
    envVars[q.key] = answer;
  }
  
  // Generate JWT secret
  const jwtSecret = crypto.randomBytes(64).toString('hex');
  envVars.JWT_SECRET = jwtSecret;
  
  // Set default values
  envVars.PORT = '3001';
  envVars.NODE_ENV = 'development';
  envVars.VITE_API_URL = 'http://localhost:3001';
  envVars.VITE_SUPABASE_URL = envVars.SUPABASE_URL;
  envVars.VITE_SUPABASE_ANON_KEY = envVars.SUPABASE_ANON_KEY;
  
  // Create .env file
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync('.env', envContent);
  
  console.log('\n✅ Environment file created successfully!');
  console.log('📁 Created: .env');
  console.log('\n🔑 Generated secure JWT secret');
  console.log('\n🚀 You can now run: npm run dev');
  console.log('\n📖 For more details, see: docs/ENVIRONMENT-SETUP.md');
  
  rl.close();
}

// Check if .env already exists
if (fs.existsSync('.env')) {
  rl.question('\n⚠️  .env file already exists. Overwrite? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      setupEnvironment();
    } else {
      console.log('Setup cancelled. Existing .env file preserved.');
      rl.close();
    }
  });
} else {
  setupEnvironment();
}