// import React from 'react'
import { StyleSheet } from '../src/sheet'

let sheet = new StyleSheet()
sheet.inject()
sheet.insert('arbit { color: blue; }')
sheet.insert('.abc { color: green; }')
let tack = sheet.insert('.xyz { color: red; }')
sheet.insert('.abc { color: yellow; }')
sheet.insert('.abc { color: white; }')

function getRandomColor() {
  let letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

setInterval(() => {
  sheet.replace(tack, `.xyz { color: ${getRandomColor()}}`)
  console.log(sheet.rules().map(x => x.cssText))
}, 2000)
