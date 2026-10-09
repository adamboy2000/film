import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import image from './api/image.js'
import user from './api/user.js'
export default defineConfig({plugins:[react(),tailwindcss(),{
 name:'film-image-api',
 configureServer(server){server.middlewares.use('/api/image',(req,res,next)=>{image(req,res).catch(next)});server.middlewares.use('/api/user',user)},
}],server:{host:'127.0.0.1'}})
