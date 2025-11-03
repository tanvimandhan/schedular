const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Setup...\n');

// Check Node.js
try {
  const nodeVersion = process.version;
  console.log(`✅ Node.js: ${nodeVersion}`);
} catch (e) {
  console.log('❌ Node.js not found');
}

// Check Backend
const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');

console.log('\n📦 Backend Checks:');
const backendNodeModules = path.join(backendDir, 'node_modules');
if (fs.existsSync(backendNodeModules)) {
  console.log('✅ Backend dependencies installed');
} else {
  console.log('❌ Backend dependencies NOT installed');
  console.log('   Run: cd backend && npm install');
}

const backendEnv = path.join(backendDir, '.env');
if (fs.existsSync(backendEnv)) {
  console.log('✅ Backend .env file exists');
} else {
  console.log('❌ Backend .env file NOT found');
  console.log('   Run: cd backend && cp env.example .env');
  console.log('   Then edit .env with your database credentials');
}

// Check Frontend
console.log('\n📦 Frontend Checks:');
const frontendNodeModules = path.join(frontendDir, 'node_modules');
if (fs.existsSync(frontendNodeModules)) {
  console.log('✅ Frontend dependencies installed');
} else {
  console.log('❌ Frontend dependencies NOT installed');
  console.log('   Run: cd frontend && npm install --legacy-peer-deps');
}

// Check package.json scripts
console.log('\n📋 Next Steps:');
console.log('1. If backend dependencies missing: cd backend && npm install');
console.log('2. If .env missing: cd backend && cp env.example .env (then edit it)');
console.log('3. Run migrations: cd backend && npm run db:migrate');
console.log('4. Start backend: cd backend && npm run dev');
console.log('5. Start frontend (new terminal): cd frontend && npm start');
console.log('\n🌐 Then open: http://localhost:3000');
