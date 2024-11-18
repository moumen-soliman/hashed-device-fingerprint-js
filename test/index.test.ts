import { generateHashedFingerprint } from '../src/index';

async function runTests() {
    console.log('Starting tests for hashed-fingerprint...');

    // Test 1: Default Behavior
    console.log('\nTest 1: Default Behavior');
    try {
        const hash = await generateHashedFingerprint();
        console.log('Generated Fingerprint Hash:', hash);
    } catch (error) {
        console.error('Test 1 Failed:', error);
    }

    // Test 2: Exclude IP Address
    console.log('\nTest 2: Exclude IP Address');
    try {
        const hash = await generateHashedFingerprint({ useIP: false });
        console.log('Generated Fingerprint Hash (No IP):', hash);
    } catch (error) {
        console.error('Test 2 Failed:', error);
    }

    // Test 3: Provide User IP Address
    console.log('\nTest 3: Provide User IP Address');
    try {
        const hash = await generateHashedFingerprint({ userIP: '203.0.113.45' });
        console.log('Generated Fingerprint Hash (With Provided IP):', hash);
    } catch (error) {
        console.error('Test 3 Failed:', error);
    }

    // Test 4: Save to Cookie
    console.log('\nTest 4: Save to Cookie');
    try {
        const hash = await generateHashedFingerprint({ saveToCookie: true, cookieExpiryDays: 5 });
        console.log('Generated Fingerprint Hash (Saved in Cookie):', hash);
    } catch (error) {
        console.error('Test 4 Failed:', error);
    }

    // Test 5: Exclude Multiple Data Points
    console.log('\nTest 5: Exclude Multiple Data Points');
    try {
        const hash = await generateHashedFingerprint({
            useUserAgent: false,
            useLanguage: false,
        });
        console.log('Generated Fingerprint Hash (Excluded Data Points):', hash);
    } catch (error) {
        console.error('Test 5 Failed:', error);
    }

    // Test 6: Combine Multiple Customizations
    console.log('\nTest 6: Combine Multiple Customizations');
    try {
        const hash = await generateHashedFingerprint({
            saveToCookie: true,
            cookieExpiryDays: 10,
            useIP: true,
            userIP: '192.168.1.1',
        });
        console.log('Generated Fingerprint Hash (Combined Options):', hash);
    } catch (error) {
        console.error('Test 6 Failed:', error);
    }

    console.log('\nAll tests completed!');
}

runTests();