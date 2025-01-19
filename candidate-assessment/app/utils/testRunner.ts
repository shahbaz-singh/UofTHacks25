export interface TestResult {
  passedTests: number;
  totalTests: number;
  failedTests: { name: string; error: string }[];
  coverage: number;
  creativity: number;
  feedback: string;
}

export function runTests(files: { [key: string]: string }): string {
  try {
    const testFile = files['tests/socialMedia.test.js'];
    console.log('\n=== Starting Test Run ===');
    console.log('Test file content:', testFile);

    // Reset globals
    delete (global as any).test;
    delete (global as any).expect;
    delete (global as any).Post;
    delete (global as any).User;
    delete (global as any).Feed;

    let passedTests = 0;
    let totalTests = 0;
    let failedTests: { name: string; error: string }[] = [];

    // Define test framework
    (global as any).test = (name: string, fn: () => void) => {
      totalTests++;
      console.log(`\nRunning test: "${name}"`);
      try {
        fn();
        passedTests++;
        console.log(`✓ PASS: ${name}`);
      } catch (error) {
        console.log(`✗ FAIL: ${name}`);
        console.log(`  Error: ${error instanceof Error ? error.message : error}`);
        failedTests.push({
          name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };

    (global as any).expect = (actual: any) => ({
      toBe: (expected: any) => {
        console.log('  Expecting:', { actual, expected });
        if (actual !== expected) {
          throw new Error(`Expected ${expected} but got ${actual}`);
        }
      },
      toThrow: (expectedMessage: string) => {
        console.log('  Expecting to throw:', expectedMessage);
        try {
          actual();
          console.log('  Function did not throw');
          throw new Error(`Expected "${expectedMessage}" but got no error`);
        } catch (e: any) {
          console.log('  Function threw:', e.message);
          if (e.message !== expectedMessage) {
            throw new Error(`Expected "${expectedMessage}" but got "${e.message}"`);
          }
        }
      }
    });

    // Run the code
    const context = `
      ${files['src/Post.js']}
      ${files['src/User.js']}
      ${files['src/Feed.js']}
      ${testFile}
    `;
    
    eval(context);

    // Print summary
    console.log('\n=== Test Results ===');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests.length}`);
    if (failedTests.length > 0) {
      console.log('\nFailed Tests:');
      failedTests.forEach(({ name, error }) => {
        console.log(`✗ ${name}: ${error}`);
      });
    }
    console.log('==================\n');

    // Return stringified results for the UI
    return JSON.stringify({
      passedTests,
      totalTests,
      failedTests,
      coverage: totalTests > 0 ? Math.min(100, (passedTests / totalTests) * 100) : 0,
      creativity: totalTests > 0 ? Math.min(100, (totalTests / 5) * 100) : 0,
      feedback: totalTests === 0 
        ? 'No tests written yet'
        : failedTests.length > 0 
          ? `${failedTests.length} tests failed: ${failedTests.map(f => f.name).join(', ')}`
          : `All ${passedTests} tests passed successfully!`
    });
  } catch (error) {
    console.error('\n=== Test Runner Error ===');
    console.error(error);
    console.error('=====================\n');
    // Return stringified error results
    return JSON.stringify({
      passedTests: 0,
      totalTests: 0,
      failedTests: [{ 
        name: 'Test Setup', 
        error: error instanceof Error ? error.message : 'Failed to run tests' 
      }],
      coverage: 0,
      creativity: 0,
      feedback: 'Failed to run tests due to setup error'
    });
  }
} 