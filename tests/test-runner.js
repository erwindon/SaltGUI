#!/usr/bin/env node
/* global console process */

import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const functionalDir = join(__dirname, 'functional');
const mochaPath = join(projectRoot, 'node_modules', '.bin', 'mocha');

// Default test to run when no arguments provided
const DEFAULT_TEST = 'login.js';

const testArgs = process.argv.slice(2);

// Get sorted list of available test files
const availableTests = fs.readdirSync(functionalDir)
  .filter(file => file.endsWith('.js'))
  .sort();

// Extract describe() block name from a test file
const getDescribeName = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/describe\s*\(\s*["']([^"']+)["']/);
  return match ? match[1] : null;
};

// Show available tests
const showAvailableTests = () => {
  /* eslint-disable no-console */
  console.log('Available tests:');
  /* eslint-enable no-console */
  const maxLen = Math.max(...availableTests.map(fileName => fileName.replace('.js', '').length));
  availableTests.forEach(file => {
    const describeName = getDescribeName(join(functionalDir, file));
    const name = file.replace('.js', '').padEnd(maxLen);
    /* eslint-disable no-console */
    console.log(`  ${name}  "${describeName}"`);
    /* eslint-enable no-console */
  });
  const exampleTests = availableTests.slice(0, 2).map(fileName => fileName.replace('.js', '')).join(' ');
  /* eslint-disable no-console */
  console.log('\nUsage: npm run test:functional -- [test1] [test2] ... | all');
  console.log(`Example: npm run test:functional -- ${exampleTests}\n`);
  /* eslint-enable no-console */
};

// Determine what to run
let testFiles = [DEFAULT_TEST];

if (testArgs.length > 0) {
  if (testArgs.includes('all')) {
    // Run all test files
    const mochaArgs = [
      '--bail',
      '--trace-warnings',
      '--check-leaks',
      '--reporter', 'spec',
      `${functionalDir}/`
    ];
    const result = spawnSync(mochaPath, mochaArgs, { stdio: 'inherit' });
    process.exit(result.status);
  }

  // Validate and collect all test files
  testFiles = [];
  const invalidArgs = [];

  testArgs.forEach(testArg => {
    let targetFile = testArg.endsWith('.js') ? testArg : `${testArg}.js`;
    if (availableTests.includes(targetFile)) {
      testFiles.push(targetFile);
    } else {
      invalidArgs.push(testArg);
    }
  });

  if (invalidArgs.length > 0) {
    /* eslint-disable no-console */
    console.error(`❌ Unknown test(s): ${invalidArgs.join(', ')}\n`);
    /* eslint-enable no-console */
    showAvailableTests();
    process.exit(1);
  }
}

// Show available tests and info if running default
if (testArgs.length === 0) {
  const defaultTest = DEFAULT_TEST.replace('.js', '');
  const defaultTestDescription = getDescribeName(join(functionalDir, DEFAULT_TEST));
  /* eslint-disable no-console */
  console.log(`ℹ️  Running default: ${defaultTest} "${defaultTestDescription}" only\n`);
  /* eslint-enable no-console */
  showAvailableTests();
}

// Build grep pattern matching any of the selected describe blocks
const describeNames = testFiles.map(file => {
  const filePath = join(functionalDir, file);
  return getDescribeName(filePath);
}).filter(Boolean);

const grepPattern = describeNames.length === 1
  ? describeNames[0]
  : `(${describeNames.join('|')})`;

const mochaArgs = [
  '--bail',
  '--trace-warnings',
  '--check-leaks',
  '--reporter', 'spec',
  '--grep', grepPattern,
  `${functionalDir}/`
];

const result = spawnSync(mochaPath, mochaArgs, { stdio: 'inherit' });
process.exit(result.status);
