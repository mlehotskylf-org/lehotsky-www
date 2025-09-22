import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

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
  res.type("html").send(`<h1>lehotsky-www</h1>
<p><a href="https://intercom-auth.lehotsky.net/login?return_to=${encodeURIComponent("https://www.lehotsky.net/complete-login")}">Login</a></p>
<p>Try <a href="/test">/test</a> after login.</p>`);
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
  res.type("html").send(`<h2>Authenticated</h2>
<p>Payload host: ${payload.host}</p>
<p>Return URL: ${payload.url}</p>
<p><a href="${payload.url}">Continue</a> | <a href="/">Home</a></p>`);
});

// A simple page to hit directly after login if you want:
app.get("/test", (req, res) => {
  res.type("html").send(`<h2>/test</h2><p>If you came here via /complete-login, you should be authenticated.</p>`);
});

// Railway: bind to provided PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("listening on :" + PORT));
