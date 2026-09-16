import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createMessageStore } from './messages.js'

test('contact messages can be created, marked read and deleted', async()=>{
  const dir=await mkdtemp(path.join(os.tmpdir(),'apg-msg-')); const file=path.join(dir,'messages.json'); const store=createMessageStore(file)
  const msg=await store.create({name:'Test User',phone:'0700000000',message:'Hello',email:'test@example.com'})
  assert.equal(msg.status,'new'); assert.equal((await store.list()).length,1)
  const read=await store.setStatus(msg.id,'read'); assert.equal(read?.status,'read')
  assert.equal(await store.remove(msg.id),true); assert.equal((await store.list()).length,0)
  await rm(dir,{recursive:true,force:true})
})
