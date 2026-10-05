import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { getRegistry } from "../../../lib/registry";

export const runtime = "nodejs";
const FILE = path.join("/tmp", "loki66-nexus-analytics.json");
type Event={t:string;s:string;p:string;r:string|null;k:"human"|"agent"};
const agentRx=/bot|crawler|spider|slurp|curl|wget|python|postman|insomnia|headless|playwright|selenium|agent|openai|anthropic|claude|gpt/i;
function text(v:unknown,n:number){return typeof v==="string"?v.slice(0,n):""}
async function read():Promise<Event[]>{try{return JSON.parse(await fs.readFile(FILE,"utf8"))}catch{return []}}
async function write(events:Event[]){await fs.writeFile(FILE,JSON.stringify(events.slice(-10000)),"utf8")}
function aggregate(events:Event[],checkins:number){const sessions=new Set(events.map(e=>e.s));return {pageViews:events.length,uniqueSessions:sessions.size,humans:new Set(events.filter(e=>e.k==="human").map(e=>e.s)).size,agents:new Set(events.filter(e=>e.k==="agent").map(e=>e.s)).size,checkins}}
export async function POST(req:NextRequest){let b:Record<string,unknown>={};try{b=await req.json()}catch{};const raw=text(b.sessionId,128);if(!raw)return NextResponse.json({ok:false,error:"session_required"},{status:422});const ua=req.headers.get("user-agent")||"";const e:Event={t:new Date().toISOString(),s:createHash("sha256").update(raw).digest("hex").slice(0,20),p:text(b.path,200)||"/",r:text(b.referrer,500)||null,k:agentRx.test(ua)?"agent":"human"};const events=await read();events.push(e);await write(events);return NextResponse.json({ok:true},{status:201})}
export async function GET(){const events=await read();let checkins=0;try{checkins=(await getRegistry()).length}catch{};const referrers=Object.entries(events.reduce<Record<string,number>>((a,e)=>{const k=e.r||"direct";a[k]=(a[k]||0)+1;return a},{})).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([source,count])=>({source,count}));return NextResponse.json({ok:true,totals:aggregate(events,checkins),referrers,storage:"ephemeral-instance",privacy:"No raw IP addresses are stored. Session IDs are SHA-256 hashed."})}