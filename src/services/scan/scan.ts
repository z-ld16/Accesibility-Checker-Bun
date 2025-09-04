import puppeteer from 'puppeteer'
import axe from 'axe-core'

import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

export async function runAccessibilityScan(urls: string[]) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  const scans = await getCollection(COLLECTIONS.SCANS)

  for (const url of urls) {
    await page.goto(url, { waitUntil: 'networkidle2' })
    await page.addScriptTag({
      content: axe.source,
    })
    const results = await page.evaluate(async () => {
      return await axe.run()
    })
    scans.updateOne(
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
    message: 'Scan ran successfully',
  }
}
