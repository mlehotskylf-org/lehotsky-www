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
    // Check if this page was opened for login (from Intercom widget)
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('login')) {
      // Redirect to auth service
      var currentUrl = window.location.origin + window.location.pathname;
      var authUrl = 'https://intercom-auth.lehotsky.net/login?return_to=' + encodeURIComponent(currentUrl);
      window.location.href = authUrl;
    }

    // Check if we just returned from login (has auth cookies but no login param)
    if (!urlParams.has('login') && document.cookie.includes('ic_')) {
      // Notify other tabs using localStorage (cross-tab communication)
      console.log('Login complete, notifying other tabs');
      localStorage.setItem('intercom_login_event', Date.now());

      // Try to close window (if opened from Intercom widget)
      setTimeout(function() {
        window.close();
      }, 1000);
    }
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
    // Listen for login events from other tabs via localStorage
    window.addEventListener('storage', function(event) {
      if (event.key === 'intercom_login_event' && event.newValue) {
        console.log('Login detected in another tab, reloading page');
        // Reload the page to pick up new session and reinitialize Intercom
        window.location.reload();
      }
    });
  </script>
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
    // Check if this page was opened for login (from Intercom widget)
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('login')) {
      // Redirect to auth service
      var currentUrl = window.location.origin + window.location.pathname;
      var authUrl = 'https://intercom-auth.lehotsky.net/login?return_to=' + encodeURIComponent(currentUrl);
      window.location.href = authUrl;
    }

    // Check if we just returned from login (has auth cookies but no login param)
    if (!urlParams.has('login') && document.cookie.includes('ic_')) {
      // Notify other tabs using localStorage (cross-tab communication)
      console.log('Login complete, notifying other tabs');
      localStorage.setItem('intercom_login_event', Date.now());

      // Try to close window (if opened from Intercom widget)
      setTimeout(function() {
        window.close();
      }, 1000);
    }
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
    // Listen for login events from other tabs via localStorage
    window.addEventListener('storage', function(event) {
      if (event.key === 'intercom_login_event' && event.newValue) {
        console.log('Login detected in another tab, reloading page');
        // Reload the page to pick up new session and reinitialize Intercom
        window.location.reload();
      }
    });
  </script>
</body>
</html>`);
});

// Railway: bind to provided PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));