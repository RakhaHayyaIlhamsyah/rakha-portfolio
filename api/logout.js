const {valid}=require('./auth');
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 res.setHeader('Set-Cookie','admin_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
 res.json({ok:true});
};