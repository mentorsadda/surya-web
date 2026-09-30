import React,{useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {ArrowRight,Eye,EyeOff,Heart} from 'lucide-react';
import {post,useSite,useAction,Status,Field} from './lib';
import './login-experience.css';
export function LoginExperience({onSuccess}:{onSuccess?:(user:any)=>void}){
 const {setUser}=useSite(),navigate=useNavigate(),a=useAction();
 const [register,setRegister]=useState(false),[show,setShow]=useState(false);
 return <section className="login-scene">
  <div className="login-gym" aria-hidden="true"/>
  <div className="login-story"><p className="eyebrow">YOUR PRIVATE COACHING SPACE</p><h1>Let’s build<br/><em>your best version.</em></h1><p className="login-subtitle">Same you. Stronger every day.</p><span className="login-rule"/><p className="login-story-note">Better habits. More energy. A healthier, happier you.<br/>It’s a journey, and I’m here to walk with you.</p><div className="login-signature" aria-hidden="true">Stronger<br/><span>Every Day</span><Heart size={30}/></div></div>
  <div className="login-portraits" aria-hidden="true"><div className="login-person echo-one"/><div className="login-person echo-two"/><div className="login-person main-person"/></div>
  <div className="login-milestones"><span><i/>YOUR START<br/><small>One small step</small></span><span><i/>YOUR RHYTHM<br/><small>Keep showing up</small></span><span><i/>YOUR JOURNEY<br/><small>At your own pace</small></span></div>
  <p className="login-motto" aria-hidden="true">DISCIPLINE<br/>CREATES<br/>FREEDOM<span/></p>
  <div className="login-panel"><h2>{register?'Your new chapter':'Welcome back'}</h2><p>{register?'Create your private coaching account':'Sign in to your account'}</p>
   <form onSubmit={async e=>{e.preventDefault();const b:any=Object.fromEntries(new FormData(e.currentTarget));b.terms=b.terms==='on';const r=await a.run(()=>post('/auth/'+(register?'register':'login'),b),'Welcome to your coaching space.');if(r){setUser(r.user);if(onSuccess)onSuccess(r.user);else navigate(r.user.role==='client'?'/dashboard':'/admin');}}}>
    {register&&<Field label="Full name"><input name="name" autoComplete="name" placeholder="Your full name" required maxLength={100}/></Field>}
    <Field label="Email"><input name="email" type="email" placeholder="yourname@email.com" autoComplete="email" required/></Field>
    <Field label={register?'Password · 12+ characters':'Password'}><span className="login-password"><input name="password" type={show?'text':'password'} placeholder={register?'Choose a strong password':'Enter your password'} autoComplete={register?'new-password':'current-password'} minLength={register?12:1} maxLength={200} required/><button type="button" aria-label={show?'Hide password':'Show password'} aria-pressed={show} onClick={()=>setShow(!show)}>{show?<EyeOff size={20}/>:<Eye size={20}/>}</button></span></Field>
    {!register&&<div className="login-options"><span>Private, secure access</span><Link to="/forgot-password">Forgot password?</Link></div>}
    {register&&<label className="login-consent"><input type="checkbox" name="terms" required/><span>I am 18 or older and agree to the <Link to="/policies/privacy">privacy policy</Link>.</span></label>}
    <Status action={a}/><button className="button login-submit" disabled={a.busy}>{a.busy?'Please wait…':register?'Create account':'Sign in'}<ArrowRight size={19}/></button>
   </form>
   <div className="login-switch"><span>{register?'Already registered?':'New here?'}</span><button onClick={()=>{setRegister(!register);setShow(false);a.setError('');a.setSuccess('');}}>{register?'Sign in':'Create an account'}</button></div>
   <p className="login-card-caption">FIT • STRONG • HAPPIER • YOU</p>
  </div>
  <div className="login-scene-bottom"><span>YOUR PACE. YOUR PROGRESS. YOUR SPACE.</span><Link to="/book">Book a consultation <ArrowRight size={16}/></Link></div>
 </section>;
}
