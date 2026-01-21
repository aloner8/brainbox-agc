const ldap = require('ldapjs');

const {
  LDAP_HOST,
  LDAP_PORT,
  LDAP_USERNAME,
  LDAP_TIMEOUT,
  LDAP_SSL,
  LDAP_TLS,
  LDAP_LOGGING,
  LDAP_ENABLED
} = process.env;

/**
 * Authenticate user with LDAP
 * @returns boolean (true = success, false = invalid credentials)
 */
async function authenticateLDAP(username, password) {
  // 🔕 LDAP disabled (fallback to local auth)
  if (LDAP_ENABLED !== 'true') {
    return false;
  }

  const url = `${LDAP_SSL === 'true' ? 'ldaps' : 'ldap'}://${LDAP_HOST}:${LDAP_PORT}`;
  const bindDN = LDAP_USERNAME.replace('{username}', username);

  const client = ldap.createClient({
    url,
    timeout: Number(LDAP_TIMEOUT || 5) * 1000,
    connectTimeout: Number(LDAP_TIMEOUT || 5) * 1000,
    tlsOptions: LDAP_TLS === 'true' ? {} : undefined
  });

  if (LDAP_LOGGING === 'true') {
    console.log(`[LDAP] Connecting to ${url}`);
    console.log(`[LDAP] Bind DN: ${bindDN}`);
  }

  return new Promise((resolve) => {
    client.bind(bindDN, password, (err) => {
      if (err) {
        if (LDAP_LOGGING === 'true') {
          console.warn('[LDAP] ❌ Authentication failed');
        }
        cleanup(client);
        return resolve(false); // ❗ auth fail = false (ไม่ throw)
      }

      if (LDAP_LOGGING === 'true') {
        console.log('[LDAP] ✅ Authentication success');
      }

      cleanup(client);
      resolve(true);
    });

    // safety net
    client.on('error', (err) => {
      console.error('[LDAP] 🔥 Client error:', err.message);
      cleanup(client);
      resolve(false);
    });
  });
}

/* clean ldap connection */
function cleanup(client) {
  try {
    client.unbind();
  } catch (_) {}
  try {
    client.destroy();
  } catch (_) {}
}

module.exports = {
  authenticateLDAP
};
