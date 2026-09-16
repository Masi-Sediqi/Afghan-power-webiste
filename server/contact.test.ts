import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createContactStore } from './contact.js'

test('contact settings can be updated and hidden divisions stay out of public data', async()=>{
  const dir=await mkdtemp(path.join(os.tmpdir(),'apg-contact-')); const file=path.join(dir,'contact.json'); const store=createContactStore(file)
  const current=await store.getAdmin(); current.phone='+93 783 828 054'; current.divisions[0].visible=false
  await store.update(current)
  const admin=await store.getAdmin(); const publicData=await store.get()
  assert.equal(admin.phone,'+93 783 828 054'); assert.equal(admin.divisions.length,4); assert.equal(publicData.divisions.length,3)
  await rm(dir,{recursive:true,force:true})
})
