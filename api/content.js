const {valid}=require('./auth');
const https=require('https');

function ghRequest(method,path,body,token){
 return new Promise((resolve,reject)=>{
  const r=https.request({hostname:'api.github.com',path,method,headers:{
   'User-Agent':'rakha-portfolio-cms','Authorization':`Bearer ${token}`,'Accept':'application/vnd.github+json',
   'Content-Type':'application/json'
  }},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{let j={};try{j=JSON.parse(d)}catch{};if(res.statusCode>=200&&res.statusCode<300)resolve(j);else reject(new Error(j.message||`GitHub API ${res.statusCode}`))})});
  r.on('error',reject);if(body)r.write(JSON.stringify(body));r.end();
 })
}
function cfg(){const e=process.env;if(!e.GITHUB_TOKEN||!e.GITHUB_OWNER||!e.GITHUB_REPO)return null;return e}
async function readFile(c,file){
 const j=await ghRequest('GET',`/repos/${c.GITHUB_OWNER}/${c.GITHUB_REPO}/contents/${file}?ref=${encodeURIComponent(c.GITHUB_BRANCH||'main')}`,null,c.GITHUB_TOKEN);
 return {sha:j.sha,data:JSON.parse(Buffer.from(j.content,'base64').toString('utf8'))};
}
async function writeFile(c,file,data,message){
 let old;try{old=await readFile(c,file)}catch{}
 const body={message,content:Buffer.from(JSON.stringify(data,null,2)+'\n').toString('base64'),branch:c.GITHUB_BRANCH||'main'};
 if(old)body.sha=old.sha;
 return ghRequest('PUT',`/repos/${c.GITHUB_OWNER}/${c.GITHUB_REPO}/contents/${file}`,body,c.GITHUB_TOKEN);
}
module.exports=async(req,res)=>{
 if(!valid(req))return res.status(401).json({error:'Unauthorized'});
 const c=cfg();if(!c)return res.status(500).json({error:'Set GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH di Vercel'});
 try{
  if(req.method==='GET'){
   const [a,b]=await Promise.all([readFile(c,'content/certificates.json'),readFile(c,'content/news.json')]);
   return res.json({certificates:a.data,news:b.data});
  }
  if(req.method==='PUT'){
   const body=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
   if(!Array.isArray(body.certificates)||!Array.isArray(body.news))return res.status(400).json({error:'Format data tidak valid'});
   await writeFile(c,'content/certificates.json',body.certificates,'Update certificates dari admin');
   await writeFile(c,'content/news.json',body.news,'Update news dari admin');
   return res.json({ok:true});
  }
  return res.status(405).json({error:'Method not allowed'});
 }catch(e){return res.status(500).json({error:e.message})}
};