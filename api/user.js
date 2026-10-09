// The public Vercel and local development hosts have no company SSO session.
// The company Worker supplies this route using Cloudflare's verified identity.
export default function user(req,res){
 res.setHeader('Cache-Control','private, no-store')
 res.setHeader('Content-Type','application/json')
 res.setHeader('X-Content-Type-Options','nosniff')
 if(req.method!=='GET'){res.statusCode=405;res.setHeader('Allow','GET');return res.end()}
 res.end(JSON.stringify({user:null}))
}
