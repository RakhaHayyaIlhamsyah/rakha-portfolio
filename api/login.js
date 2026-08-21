const {sign}=require('./auth');
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 try{
  const {password}=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
  if(!process.env.ADMIN_PASSWORD || password!==process.env.ADMIN_PASSWORD)return res.status(401).json({error:'Password salah'});
  const payload=Buffer.from(JSON.stringify({iat:Date.now()})).toString('base64url');
  const token=payload+'.'+sign(payload);
  res.setHeader('Set-Cookie',`admin_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`);
  return res.json({ok:true});
 }catch(e){return res.status(400).json({error:'Request tidak valid'})}
};