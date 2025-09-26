import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

// Store authenticated users in memory (in production, use proper session storage)
const sessions = new Map();

// MVP: only *decode* payload part (first base64url segment) so you can see fields.
// NOTE: this does NOT verify the HMAC (safe enough for a demo page).
function decodePayload(cookieVal) {
  try {
    const [p] = String(cookieVal || "").split(".");
    if (!p) return null;
    const b64 = p.replace(/-/g, "+").replace(/_/g, "/");
    const buf = Buffer.from(b64, "base64");
    return JSON.parse(buf.toString("utf8"));
  } catch {
    return null;
  }
}

app.get("/", (req, res) => {
  const sessionId = req.cookies.session;
  const session = sessionId ? sessions.get(sessionId) : null;

  let intercomSettings;
  if (session) {
    // User is authenticated
    intercomSettings = `window.intercomSettings = {
    api_base: "https://api-iam.intercom.io",
    app_id: "rr2dqmfv",
    ${session.intercomJwt ? `intercom_user_jwt: "${session.intercomJwt}",` : ''}
    user_id: "${session.userId}",
    email: "${session.email}",
    name: "${session.name}"
  };`;
  } else {
    // User is not authenticated
    intercomSettings = `window.intercomSettings = {
    api_base: "https://api-iam.intercom.io",
    app_id: "rr2dqmfv",
  };`;
  }

  const authSection = session
    ? `<p>Welcome, ${session.name}!</p>\n<p><a href="/logout">Logout</a></p>`
    : `<p><a href="https://intercom-auth.lehotsky.net/login?return_to=${encodeURIComponent("https://app.lehotsky.net/complete-login")}">Login</a></p>`;

  res.type("html").send(`<h1>lehotsky-www</h1>
${authSection}
<p>Try <a href="/test">/test</a> after login.</p>

<script>
  ${intercomSettings}
</script>

<script>
  // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/rr2dqmfv'
  (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/rr2dqmfv';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
</script>`);
});

// This endpoint "consumes" the ic_redirect cookie and shows status.
// (For production, verify HMAC + set your own session cookie, then redirect.)
app.get("/complete-login", (req, res) => {
  const c = req.cookies.ic_redirect;
  const payload = decodePayload(c);
  if (!payload) {
    return res.status(400).send("No valid redirect cookie found.");
  }
  // Clear the one-time cookie
  res.cookie("ic_redirect", "", {
    domain: ".lehotsky.net",
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0)
  });
  // Extract user information from the cookie payload
  const userId = payload.user_id || payload.sub;
  const email = payload.email;
  const name = payload.name;
  const intercomJwt = payload.intercom_jwt || payload.intercom_user_jwt;
  const returnUrl = payload.url || payload.return_to;

  // Store user session
  const sessionId = Math.random().toString(36).substring(7);
  sessions.set(sessionId, {
    userId,
    email,
    name,
    intercomJwt
  });

  // Set session cookie
  res.cookie("session", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.type("html").send(`<h2>Authenticated</h2>
<p>User: ${name} (${email})</p>
<p>Return URL: ${returnUrl}</p>
<p><a href="${returnUrl}">Continue</a> | <a href="/">Home</a></p>

<script>
  window.intercomSettings = {
    api_base: "https://api-iam.intercom.io",
    app_id: "rr2dqmfv",
    ${intercomJwt ? `intercom_user_jwt: "${intercomJwt}",` : ''}
    user_id: "${userId}",
    email: "${email}",
    name: "${name}"
  };
</script>

<script>
  // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/rr2dqmfv'
  (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/rr2dqmfv';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
</script>`);
});

// A simple page to hit directly after login if you want:
app.get("/test", (req, res) => {
  const sessionId = req.cookies.session;
  const session = sessionId ? sessions.get(sessionId) : null;

  let intercomScript = '';
  if (session) {
    intercomScript = `
<script>
  window.intercomSettings = {
    api_base: "https://api-iam.intercom.io",
    app_id: "rr2dqmfv",
    ${session.intercomJwt ? `intercom_user_jwt: "${session.intercomJwt}",` : ''}
    user_id: "${session.userId}",
    email: "${session.email}",
    name: "${session.name}"
  };
</script>

<script>
  // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/rr2dqmfv'
  (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/rr2dqmfv';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
</script>`;
  }

  const authStatus = session
    ? `<p>Authenticated as: ${session.name} (${session.email})</p>`
    : `<p>Not authenticated. <a href="/">Go to home to login</a></p>`;

  res.type("html").send(`<h2>/test</h2>
${authStatus}
<p><a href="/">Home</a></p>${intercomScript}`);
});

// Add logout route
app.get("/logout", (req, res) => {
  const sessionId = req.cookies.session;
  if (sessionId) {
    sessions.delete(sessionId);
    res.clearCookie("session");
  }
  res.redirect("/");
});

// Railway: bind to provided PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("listening on :" + PORT));
