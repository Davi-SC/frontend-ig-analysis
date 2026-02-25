// Vercel Serverless Function — Instagram token exchange proxy
// Bypasses browser CORS restriction on api.instagram.com/oauth/access_token

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  const IG_APP_ID = process.env.REACT_APP_IG_APP_ID || "1346553296929271";
  const IG_APP_SECRET = process.env.REACT_APP_IG_APP_SECRET || "";
  const IG_REDIRECT_URI = "https://socialdatalab.vercel.app/";

  try {
    const response = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: IG_APP_ID,
        client_secret: IG_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: IG_REDIRECT_URI,
        code,
      }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Token exchange failed", details: err.message });
  }
}
