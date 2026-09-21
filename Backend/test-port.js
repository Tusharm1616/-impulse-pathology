const dns = require("dns");

dns.resolve4("ep-falling-voice-b3wnqjkx-pooler.c-4.ap-southeast-1.aws.neon.tech", (err, addrs) => {
  if (err) {
    console.log("DNS resolve4 FAILED:", err.message);
    // Try lookup instead
    dns.lookup("ep-falling-voice-b3wnqjkx-pooler.c-4.ap-southeast-1.aws.neon.tech", (e2, addr) => {
      if (e2) console.log("DNS lookup ALSO FAILED:", e2.message);
      else console.log("DNS lookup OK:", addr);
    });
  } else {
    console.log("DNS resolve4 OK:", addrs);
  }
});

// Also test HTTP to port 443
const https = require("https");
const req = https.get("https://ep-falling-voice-b3wnqjkx-pooler.c-4.ap-southeast-1.aws.neon.tech", (res) => {
  console.log("HTTPS port 443 response status:", res.statusCode);
  res.destroy();
});
req.on("error", (e) => console.log("HTTPS port 443 error:", e.message));
req.setTimeout(8000, () => { console.log("HTTPS timeout"); req.destroy(); });
