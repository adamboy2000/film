import {useEffect,useState} from 'react'

type User = {name:string}

export function useIdentity(){
 const [user,setUser]=useState<User|null>(null)
 useEffect(()=>{
  const controller=new AbortController()
  fetch('/api/user',{credentials:'same-origin',cache:'no-store',redirect:'error',signal:controller.signal})
   .then(response=>response.ok?response.json():null)
   .then(data=>{if(typeof data?.user?.name==='string'&&data.user.name.trim())setUser({name:data.user.name.trim()})})
   .catch(()=>{})
  return()=>controller.abort()
 },[])
 return user
}

export function initials(name:string){
 const words=name.trim().split(/\s+/)
 return (words.length>1?words[0][0]+words[words.length-1][0]:words[0].slice(0,2)).toLocaleUpperCase()
}
