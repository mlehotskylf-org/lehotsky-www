import express from "express";

const app = express();

// Set Referrer-Policy to include path in referer header for cross-origin requests
// Using 'no-referrer-when-downgrade' to send full URL for HTTPS→HTTPS navigation
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

app.get("/", (req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html>
<head>
  <title>Lehotsky App</title>
</head>
<body>
  <h1>app.lehotsky.net</h1>
  <h2>Dashboard</h2>
  <p><a href="https://intercom-auth.lehotsky.net/login?return_to=https://app.lehotsky.net/" target="_blank" rel="opener">Login</a></p>

  <script>
    // Store current page URL in localStorage for auth redirects
    // This persists across tabs and survives Intercom widget link clicks
    if (!window.location.search.includes('login')) {
      localStorage.setItem('pre_login_url', window.location.href);
      console.log('Stored current page for login redirect:', window.location.href);
    }

    // Check if this page was opened for login (from Intercom widget)
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('login')) {
      // Get where user came from - try multiple sources in order:
      // 1. localStorage (most reliable - survives tab switches)
      // 2. document.referrer (if available)
      // 3. Fallback to domain root
      var returnTo = localStorage.getItem('pre_login_url') ||
                     document.referrer ||
                     (window.location.origin + '/');

      console.log('Login triggered, returning to:', returnTo);
      console.log('  - from localStorage:', localStorage.getItem('pre_login_url'));
      console.log('  - from referrer:', document.referrer);

      // Clear the stored URL after reading
      localStorage.removeItem('pre_login_url');

      // Redirect to auth service with the original page as return_to
      var authUrl = 'https://intercom-auth.lehotsky.net/login?return_to=' + encodeURIComponent(returnTo);
      window.location.replace(authUrl);
    }

    // Note: After login, user will have 2 tabs open
    // They can manually close the extra tab if desired
  </script>

  <script>
    window.intercomSettings = {
      api_base: "https://api-iam.intercom.io",
      app_id: "rr2dqmfv"
    };
  </script>

  <script>
    // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/rr2dqmfv'
    (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/rr2dqmfv';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
  </script>

  <script>
    // Note: Cross-tab communication removed - using simple 2-tab approach
    // User will have 2 tabs after login and can manually close the extra one

</body>
</html>`);
});

app.get("/members", (req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html>
<head>
  <title>Lehotsky App</title>
</head>
<body>
  <h1>app.lehotsky.net</h1>
  <h2>Members</h2>
  <p><a href="https://intercom-auth.lehotsky.net/login?return_to=https://app.lehotsky.net/" target="_blank" rel="opener">Login</a></p>

  <script>
    // Store current page URL in localStorage for auth redirects
    // This persists across tabs and survives Intercom widget link clicks
    if (!window.location.search.includes('login')) {
      localStorage.setItem('pre_login_url', window.location.href);
      console.log('Stored current page for login redirect:', window.location.href);
    }

    // Check if this page was opened for login (from Intercom widget)
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('login')) {
      // Get where user came from - try multiple sources in order:
      // 1. localStorage (most reliable - survives tab switches)
      // 2. document.referrer (if available)
      // 3. Fallback to domain root
      var returnTo = localStorage.getItem('pre_login_url') ||
                     document.referrer ||
                     (window.location.origin + '/');

      console.log('Login triggered, returning to:', returnTo);
      console.log('  - from localStorage:', localStorage.getItem('pre_login_url'));
      console.log('  - from referrer:', document.referrer);

      // Clear the stored URL after reading
      localStorage.removeItem('pre_login_url');

      // Redirect to auth service with the original page as return_to
      var authUrl = 'https://intercom-auth.lehotsky.net/login?return_to=' + encodeURIComponent(returnTo);
      window.location.replace(authUrl);
    }

    // Note: After login, user will have 2 tabs open
    // They can manually close the extra tab if desired
  </script>

  <script>
    window.intercomSettings = {
      api_base: "https://api-iam.intercom.io",
      app_id: "rr2dqmfv"
    };
  </script>

  <script>
    // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/rr2dqmfv'
    (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/rr2dqmfv';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
  </script>

  <script>
    // Note: Cross-tab communication removed - using simple 2-tab approach
    // User will have 2 tabs after login and can manually close the extra one

</body>
</html>`);
});

// Railway: bind to provided PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));