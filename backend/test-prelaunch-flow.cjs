const http = require('http');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
          json,
        });
      });
    });
    req.on('error', reject);
    if (body) {
      if (typeof body === 'string') {
        req.write(body);
      } else {
        req.write(JSON.stringify(body));
      }
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== Starting Oretna.ai Pre-Launch Integration Tests ===\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${message}`);
    }
  }

  const timestamp = Date.now();
  const testEmail = `researcher_${timestamp}@oretna.ai`;
  const validPassword = `ResearchPass123!@#`;
  const weakPassword = `weak`;

  // 1. Public Landing Page via Next.js (port 3000)
  console.log('--- 1. Testing Public Landing Page (Port 3000) ---');
  try {
    const landingRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
    });
    assert(landingRes.statusCode === 200, `Landing page returns 200 OK (got ${landingRes.statusCode})`);
    assert(landingRes.data.includes('Oretna') || landingRes.data.includes('oretna'), 'Landing page contains Oretna branding');
  } catch (err) {
    assert(false, `Landing page request failed: ${err.message}`);
  }

  // 2. Unauthenticated Workspace Protection via Middleware
  console.log('\n--- 2. Testing Route Protection (/workspace without session) ---');
  try {
    const wsRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/workspace',
      method: 'GET',
    });
    assert(
      wsRes.statusCode === 307 || wsRes.statusCode === 308 || wsRes.statusCode === 302,
      `Unauthenticated /workspace is redirected (HTTP ${wsRes.statusCode})`
    );
    assert(
      wsRes.headers.location && wsRes.headers.location.includes('/login'),
      `Redirect target is /login (got: ${wsRes.headers.location})`
    );
  } catch (err) {
    assert(false, `Workspace protection test failed: ${err.message}`);
  }

  // 3. Backend Research Query Protection
  console.log('\n--- 3. Testing Backend Research Assistant Protection ---');
  try {
    const unauthQueryRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/research/query',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { query: 'test query' }
    );
    assert(unauthQueryRes.statusCode === 401, `Unauthenticated query returns 401 Unauthorized (got ${unauthQueryRes.statusCode})`);
  } catch (err) {
    assert(false, `Unauth research query test failed: ${err.message}`);
  }

  // 4. Password validation constraints on signup
  console.log('\n--- 4. Testing Password Validation Rules ---');
  try {
    const weakSignupRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/signup',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        email: `weak_${timestamp}@oretna.ai`,
        password: weakPassword,
        firstName: 'Weak',
        lastName: 'Pass',
      }
    );
    assert(
      weakSignupRes.statusCode === 400,
      `Weak password rejected with 400 Bad Request (got ${weakSignupRes.statusCode})`
    );
  } catch (err) {
    assert(false, `Weak password test failed: ${err.message}`);
  }

  // 5. User Signup with Valid Password
  console.log('\n--- 5. Testing User Signup ---');
  let sessionCookie = '';
  try {
    const signupRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/signup',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        email: testEmail,
        password: validPassword,
        firstName: 'Test',
        lastName: 'Researcher',
      }
    );
    assert(signupRes.statusCode === 201, `Valid signup succeeds with 201 Created (got ${signupRes.statusCode})`);
    assert(
      signupRes.json && signupRes.json.redirectTo === '/onboarding/survey',
      `Signup returns redirectTo: '/onboarding/survey'`
    );

    const cookies = signupRes.headers['set-cookie'];
    if (cookies) {
      sessionCookie = cookies[0].split(';')[0];
      assert(sessionCookie.includes('oretna_session='), `Session cookie set: ${sessionCookie.slice(0, 25)}...`);
    } else {
      assert(false, 'No session cookie returned on signup');
    }
  } catch (err) {
    assert(false, `Signup failed: ${err.message}`);
  }

  // 6. Survey Status for New User (Unverified)
  console.log('\n--- 6. Testing Survey Status for New User ---');
  try {
    const statusRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/survey/status',
      method: 'GET',
      headers: { Cookie: sessionCookie },
    });
    assert(statusRes.statusCode === 200, `Survey status returns 200 OK`);
    assert(statusRes.json && statusRes.json.authenticated === true, `User is authenticated`);
    assert(statusRes.json && statusRes.json.surveyCompleted === false, `Survey completion is FALSE for new user`);
  } catch (err) {
    assert(false, `Survey status check failed: ${err.message}`);
  }

  // 7. Research Access for Unverified User (Must be 403)
  console.log('\n--- 7. Testing Research Access Restriction for Unverified User ---');
  try {
    const unverifiedQueryRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/research/query',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
        },
      },
      { query: 'test query' }
    );
    assert(
      unverifiedQueryRes.statusCode === 403,
      `Unverified user query returns 403 Forbidden (got ${unverifiedQueryRes.statusCode})`
    );
    assert(
      unverifiedQueryRes.json && unverifiedQueryRes.json.surveyRequired === true,
      `Error response has surveyRequired: true`
    );
  } catch (err) {
    assert(false, `Unverified query test failed: ${err.message}`);
  }

  // 8. Google Form Webhook Authentication & Processing
  console.log('\n--- 8. Testing Google Form Webhook Integration ---');
  const secret = process.env.SURVEY_WEBHOOK_SECRET || 'oretna_survey_secret_2026_x7k9';
  try {
    // 8a. Invalid secret
    const badSecretRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/survey/webhook',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-survey-secret': 'invalid_secret',
        },
      },
      { email: testEmail }
    );
    assert(badSecretRes.statusCode === 401, `Webhook rejects invalid secret with 401 (got ${badSecretRes.statusCode})`);

    // 8b. Valid submission
    const validWebhookRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/survey/webhook',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-survey-secret': secret,
        },
      },
      {
        email: testEmail,
        fullName: 'Test Researcher',
        category: 'researcher/academic',
        researchFrequency: 'Daily',
        mostValuableFeature: 'citation-backed answers',
        responseReference: `gform_response_${timestamp}`,
      }
    );
    assert(
      validWebhookRes.statusCode === 200,
      `Webhook accepts valid submission with 200 OK (got ${validWebhookRes.statusCode})`
    );
    assert(
      validWebhookRes.json && validWebhookRes.json.success === true,
      `Webhook response confirms success: true`
    );
  } catch (err) {
    assert(false, `Webhook test failed: ${err.message}`);
  }

  // 9. Verified Survey Status Check
  console.log('\n--- 9. Testing Survey Status After Verified Submission ---');
  try {
    const verifiedStatusRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/survey/status',
      method: 'GET',
      headers: { Cookie: sessionCookie },
    });
    assert(
      verifiedStatusRes.json && verifiedStatusRes.json.surveyCompleted === true,
      `Survey status is now verified TRUE in Neon DB`
    );
  } catch (err) {
    assert(false, `Verified status check failed: ${err.message}`);
  }

  // 10. Research Access for Verified User (Must be restricted during pre-launch)
  console.log('\n--- 10. Testing Research Access During Pre-Launch (Chatbox Closed to All) ---');
  try {
    const verifiedQueryRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/research/query',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
        },
      },
      { query: 'Explain monetary policy in emerging markets' }
    );
    assert(
      verifiedQueryRes.statusCode === 403,
      `Chatbox query blocked during pre-launch with 403 Forbidden (got ${verifiedQueryRes.statusCode})`
    );
    assert(
      verifiedQueryRes.json && verifiedQueryRes.json.prelaunchActive === true,
      `Error response confirms prelaunchActive: true`
    );
  } catch (err) {
    assert(false, `Verified query test failed: ${err.message}`);
  }

  // 11. Returning User Login (Survey already verified -> redirectTo: '/onboarding/thank-you')
  console.log('\n--- 11. Testing Returning User Login with Verified Survey ---');
  try {
    const loginRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        email: testEmail,
        password: validPassword,
      }
    );
    assert(loginRes.statusCode === 200, `Login succeeds with 200 OK`);
    assert(
      loginRes.json && loginRes.json.redirectTo === '/onboarding/thank-you',
      `Returning verified user redirectTo is '/onboarding/thank-you' (chatbox closed)`
    );
    assert(
      loginRes.json && loginRes.json.user.surveyCompleted === true,
      `User object has surveyCompleted: true`
    );
  } catch (err) {
    assert(false, `Returning user login test failed: ${err.message}`);
  }

  // 12. Pre-Registration Survey Submission Flow (User submits form first, signs up later)
  console.log('\n--- 12. Testing Pre-Registration Submission Flow ---');
  const futureEmail = `earlybird_${timestamp}@oretna.ai`;
  try {
    // Webhook receives submission for future user
    const futureWebhookRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/survey/webhook',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-survey-secret': secret,
        },
      },
      {
        email: futureEmail,
        fullName: 'Early Bird',
        responseReference: `gform_future_${timestamp}`,
      }
    );
    assert(futureWebhookRes.statusCode === 200, `Webhook records pre-registration response`);

    // User now signs up
    const futureSignupRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/signup',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        email: futureEmail,
        password: validPassword,
        firstName: 'Early',
        lastName: 'Bird',
      }
    );
    assert(futureSignupRes.statusCode === 201, `Pre-surveyed user signs up with 201 Created`);
    assert(
      futureSignupRes.json && futureSignupRes.json.redirectTo === '/onboarding/thank-you',
      `Pre-surveyed user gets redirectTo: '/onboarding/thank-you'`
    );
    assert(
      futureSignupRes.json && futureSignupRes.json.user.surveyCompleted === true,
      `Pre-surveyed user automatically has surveyCompleted: true`
    );
  } catch (err) {
    assert(false, `Pre-registration test failed: ${err.message}`);
  }

  console.log(`\n========================================`);
  console.log(`Results: ${passed} / ${total} tests passed.`);
  console.log(`========================================\n`);

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
