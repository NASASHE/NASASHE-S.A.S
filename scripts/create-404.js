import { access, copyFile } from 'fs/promises'
import { constants } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(currentDir, '..', 'dist')
const projectRoot = resolve(currentDir, '..')
const indexPath = resolve(distDir, 'index.html')
const notFoundPath = resolve(distDir, '404.html')
const rootIndexPath = resolve(projectRoot, 'index.html')
const rootNotFoundPath = resolve(projectRoot, '404.html')

async function create404() {
  try {
    await access(indexPath, constants.F_OK)
    await copyFile(indexPath, notFoundPath)
    await copyFile(indexPath, rootIndexPath)
    await copyFile(indexPath, rootNotFoundPath)
    console.log('404.html creado a partir de index.html para GitHub Pages')
  } catch (error) {
    console.error('No se pudo crear 404.html:', error.message)
    process.exitCode = 1
  }
}

create404()
