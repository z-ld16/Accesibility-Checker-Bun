import puppeteer from 'puppeteer'
import axe from 'axe-core'

import { mongoConnect } from '../db/mongo-connect'

export async function runAccessibilityScan(urls: string[]) {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  const db = await mongoConnect()

  for (const url of urls) {
    await page.goto(url, { waitUntil: 'networkidle2' })
    await page.addScriptTag({
      content: axe.source,
    })
    const results = await page.evaluate(async () => {
      return await axe.run()
    })
    const scans = db?.collection('scans')
    scans?.updateOne(
      { url },
      {
        $set: {
          violations: results.violations,
          updatedAt: new Date().toISOString(),
        },
        $setOnInsert: {
          url,
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true },
    )
  }

  await browser.close()

  return {
    message: 'Scan ran succesfully',
  }
}
