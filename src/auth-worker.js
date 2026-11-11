// HTTP Basic Authentication for Lenin's Birthday
// Credentials are stored securely in Cloudflare Secrets.

function unauthorized() {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate":
        'Basic realm="Lenin Birthday", charset="UTF-8"',
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

async function secureCompare(received, expected) {
  const encoder = new TextEncoder();

  const [receivedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest(
      "SHA-256",
      encoder.encode(received)
    ),
    crypto.subtle.digest(
      "SHA-256",
      encoder.encode(expected)
    ),
  ]);

  return crypto.subtle.timingSafeEqual(
    receivedHash,
    expectedHash
  );
}

export default {
  async fetch(request, env) {

    // Block access if secrets are not configured
    if (
      !env.BASIC_AUTH_USERNAME ||
      !env.BASIC_AUTH_PASSWORD
    ) {
      return new Response(
        "Authentication is not configured.",
        {
          status: 503,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    // Read Authorization header
    const authorization =
      request.headers.get("Authorization") || "";

    // Ask for username and password
    if (!authorization.startsWith("Basic ")) {
      return unauthorized();
    }

    let username;
    let password;

    try {
      const decoded = atob(
        authorization.slice(6).trim()
      );

      const separator = decoded.indexOf(":");

      if (separator === -1) {
        return unauthorized();
      }

      username = decoded.slice(0, separator);
      password = decoded.slice(separator + 1);

    } catch {
      return unauthorized();
    }

    // Validate credentials against Cloudflare Secrets
    const [validUsername, validPassword] =
      await Promise.all([
        secureCompare(
          username,
          env.BASIC_AUTH_USERNAME
        ),
        secureCompare(
          password,
          env.BASIC_AUTH_PASSWORD
        ),
      ]);

    if (!validUsername || !validPassword) {
      return unauthorized();
    }

    // Authentication successful!
    // Serve the requested page, image, or other asset.
    return env.ASSETS.fetch(request);
  },
};