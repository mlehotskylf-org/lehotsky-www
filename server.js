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
  <p><a href="https://intercom-auth.lehotsky.net/login?return_to=https://app.lehotsky.net/">Login</a></p>

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
    // Listen for login success from popup/new tab
    window.addEventListener('message', function(event) {
      // Security: only accept messages from auth domain
      if (event.origin !== 'https://intercom-auth.lehotsky.net') {
        return;
      }

      if (event.data.type === 'intercom_login_success') {
        console.log('Login successful in popup, refreshing Intercom');
        // Refresh Intercom to pick up new cookies
        if (window.Intercom) {
          window.Intercom('update');
        }
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
  <p><a href="https://intercom-auth.lehotsky.net/login?return_to=https://app.lehotsky.net/">Login</a></p>

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
    // Listen for login success from popup/new tab
    window.addEventListener('message', function(event) {
      // Security: only accept messages from auth domain
      if (event.origin !== 'https://intercom-auth.lehotsky.net') {
        return;
      }

      if (event.data.type === 'intercom_login_success') {
        console.log('Login successful in popup, refreshing Intercom');
        // Refresh Intercom to pick up new cookies
        if (window.Intercom) {
          window.Intercom('update');
        }
      }
    });
  </script>
</body>
</html>`);
});

// Railway: bind to provided PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));