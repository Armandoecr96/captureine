const fs = require('fs')
const puppeteer = require('puppeteer')

exports.initPuppeteer = async function initPuppeteer (options, isINE) {
  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()
  await page.goto('https://listanominal.ife.org.mx')
  await page.waitFor(2000)

  if (isINE) {
    await page.click('body > section:nth-child(8)')
    await page.setViewport({ width: 1024, height: 768 })
    await page.waitFor(2000)
    await page.screenshot({ path: 'captcha.png', clip: {x: 400, y: 550, height: 60, width: 160} })
  } else {
    await page.click('#Consulta')
    await page.setViewport({ width: 1024, height: 768 })
    await page.waitFor(2000)
    await page.screenshot({ path: 'captcha.png', clip: {x: 450, y: 650, height: 60, width: 160} })
  }

  await page.waitFor(1000)
  const recoverIMG = await page.evaluate(() => {
    let img = document.querySelector('.col-md-offset-2 img')
    return img.src
  })

  const imageCaptcha = fs.readFileSync('captcha.png')

  return { page, imageCaptcha, recoverIMG }
}

exports.modelABC = async function modelABC (page, claveElector, numeroEmision, ocr, captcha) {
  if (!page) throw new Error('Uninitialized page')

  // Clave Elector
  await page.waitFor('#Clave_Elector')
  await page.type('#Clave_Elector', claveElector)

  // #Numero_Emision
  await page.waitFor('#Numero_Emision')
  await page.type('#Numero_Emision', numeroEmision)

  // #OCR
  await page.waitFor('#OCR')
  await page.type('#OCR', ocr)

  // Captcha
  await page.waitFor('#captcha-form')
  await page.type('#captcha-form', captcha)

  // await page.waitFor(10000)
  await page.waitFor('#Consulta')
  await page.click('#Consulta')
  await page.waitFor(2000)

  await page.screenshot({ path: 'consulta.png' })

  const recoverIMG = await page.evaluate(() => {
    let img = document.querySelector('.col-md-offset-2 img')
    return img.src
  })

  let validation
  if (recoverIMG === 'https://listanominal.ife.org.mx/images/si_vigente_vota.png') {
    validation = true
  } else {
    validation = false
  }

  return validation
}

exports.modelDE = async function modelDE (page, ine, captcha) {
  if (!page) throw new Error('Uninitialized page')

  await page.waitFor('#CIC')
  await page.click('#CIC')
  await page.type('#CIC', ine)
  await page.waitFor(1000)

  await page.screenshot({path: 'modelDE.png', clip: {width: 200, height: 60, x: 300, y: 580}})
  await page.click('#captcha-form')
  await page.type('#captcha-form', captcha)

  await page.waitFor(10000)

  await page.waitFor('#Consulta')
  await page.click('#Consulta')
  await page.waitFor(1000)

  const recoverIMG = await page.evaluate(() => {
    let img = document.querySelector('.col-md-offset-2 img')
    return img.src
  })

  let validation
  if (recoverIMG === 'https://listanominal.ife.org.mx/images/si_vigente_vota.png') {
    validation = true
  } else {
    validation = false
  }

  return validation
}
