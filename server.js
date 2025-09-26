import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html>
<head>
  <title>Lehotsky App</title>
</head>
<body>
  <h1>app.lehotsky.net</h1>
  <p><a href="https://intercom-auth.lehotsky.net/login?return_to=https://app.lehotsky.net/">Login</a></p>
  <p>Try <a href="/test">/test</a> after login.</p>

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
</body>
</html>`);
});

app.get("/test", (req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html>
<head>
  <title>Test Page - Lehotsky App</title>
</head>
<body>
  <h2>Test Page</h2>
  <p>This is a test page. If you're authenticated, Intercom should recognize you.</p>
  <p><a href="/">Back to Home</a></p>

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
</body>
</html>`);
});

// Railway: bind to provided PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));