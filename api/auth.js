const crypto=require('crypto');
function sign(payload){return crypto.createHmac('sha256',process.env.ADMIN_PASSWORD||'').update(payload).digest('base64url')}
function cookieValue(req){const c=req.headers.cookie||'';const m=c.match(/admin_session=([^;]+)/);return m?m[1]:''}
function valid(req){const v=cookieValue(req);if(!v)return false;const [p,s]=v.split('.');return !!p&&s===sign(p)}
module.exports={sign,valid};