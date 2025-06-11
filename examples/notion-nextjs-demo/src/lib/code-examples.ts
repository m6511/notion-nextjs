import fs from 'fs'
import path from 'path'

export async function getCodeExample(filename: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'content', 'code-examples', `${filename}.md`)
    const content = fs.readFileSync(filePath, 'utf8')
    // Remove the ```typescript or ```json wrapper and return just the code
    return content.replace(/^```\w*\n/, '').replace(/\n```$/, '')
  } catch (error) {
    console.error(`Error reading code example ${filename}:`, error)
    return '// Code example not found'
  }
}