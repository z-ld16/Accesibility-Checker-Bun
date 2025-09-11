import puppeteer from 'puppeteer'
import axe from 'axe-core'

import { ScanRepository } from '../../repositories/scan.respository'

/**
 * Runs an accessibility scan on a list of URLs using Puppeteer and axe-core.
 *
 * - Launches a headless Chromium instance.
 * - Navigates to each provided URL.
 * - Injects and runs axe-core to analyze accessibility violations.
 * - Persists results into the `SCANS` collection:
 *   - Updates existing records if the URL already exists.
 *   - Inserts a new record if the URL is new.
 *   - Updates timestamps (`createdAt`, `updatedAt`).
 *
 * @async
 * @function runAccessibilityScan
 * @param {string[]} urls - An array of URLs to scan for accessibility issues.
 * @returns {Promise<{ message: string }>} A confirmation message after all scans complete.
 */
export async function runAccessibilityScan(
  urls: string[],
): Promise<{ message: string }> {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  for (const url of urls) {
    await page.goto(url, { waitUntil: 'networkidle2' })
    await page.addScriptTag({
      content: axe.source,
    })
    const results = await page.evaluate(async () => {
      return await axe.run()
    })
    await ScanRepository.upsertOne({ url, violations: results.violations })
  }

  await browser.close()

  return {
    message: 'Scan ran successfully',
  }
}
