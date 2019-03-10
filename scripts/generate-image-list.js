// @ts-check
const fs = require("fs")
const path = require("path")

const rootPath = path.join(__dirname, "..")
const imagesFolderPath = path.join(rootPath, "public/images")
const jsonOutputPath = path.join(rootPath, "src/images.json")

const imageFileNames = fs.readdirSync(imagesFolderPath)

fs.writeFileSync(jsonOutputPath, JSON.stringify(imageFileNames, null, 2))
