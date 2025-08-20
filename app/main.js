const fs = require("fs")
const path = require("path")
const zlib = require("zlib")

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.error("Logs from your program will appear here!")

// Uncomment this block to pass the first stage
const command = process.argv[2]
//
switch (command) {
  case "init":
    createGitDirectory()
    break
  case "cat-file":
    readBlob()
    break
  default:
    throw new Error(`Unknown command ${command}`)
}

function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true })
  fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), { recursive: true })
  fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true })

  fs.writeFileSync(
    path.join(process.cwd(), ".git", "HEAD"),
    "ref: refs/heads/main\n"
  )
  console.log("Initialized git directory")
}

function readBlob() {
  const blob = fs.readFileSync(
    path.join(
      process.cwd(),
      ".git",
      "objects",
      process.argv[4].substring(0, 2),
      process.argv[4].substring(2)
    )
  )
  const decompressedBuffer = zlib.inflateSync(blob).toString()
  const nullByteIndex = decompressedBuffer.indexOf("\0")
  process.stdout.write(
    decompressedBuffer.substring(nullByteIndex + 1, decompressedBuffer.length)
  )
}

// test blob: 176a458f94e0ea5272ce67c36bf30b6be9caf623
