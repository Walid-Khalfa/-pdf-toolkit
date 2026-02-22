import { exec } from 'child_process'
import { promisify } from 'util'
import type { ProtectOptions } from '@shared'

const execAsync = promisify(exec)

let qpdfAvailable: boolean | null = null

export async function isQpdfAvailable(): Promise<boolean> {
  if (qpdfAvailable !== null) {
    return qpdfAvailable
  }

  try {
    await execAsync('qpdf --version')
    qpdfAvailable = true
    return true
  } catch {
    qpdfAvailable = false
    return false
  }
}

export async function protectWithQpdf(
  inputPath: string,
  outputPath: string,
  options: ProtectOptions
): Promise<void> {
  const {
    userPassword,
    ownerPassword,
    allowPrinting = true,
    allowCopying = false,
    allowModifying = false,
  } = options

  const encArgs: string[] = []

  if (userPassword) {
    encArgs.push(`--user-password=${userPassword}`)
  }

  if (ownerPassword) {
    encArgs.push(`--owner-password=${ownerPassword}`)
  } else if (userPassword) {
    encArgs.push(`--owner-password=${userPassword}`)
  }

  if (allowPrinting) {
    encArgs.push('--allow-printing')
  }

  if (allowCopying) {
    encArgs.push('--allow-copy-all')
  }

  if (allowModifying) {
    encArgs.push('--allow-modify-other')
  }

  encArgs.push('--encrypt')
  encArgs.push('256')

  const command = ['qpdf', ...encArgs, '--', `"${inputPath}"`, `"${outputPath}"`].join(' ')

  try {
    await execAsync(command, { maxBuffer: 50 * 1024 * 1024 })
  } catch (error) {
    throw new Error(
      `qpdf protection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export async function unlockWithQpdf(
  inputPath: string,
  outputPath: string,
  password?: string
): Promise<void> {
  const command = [
    'qpdf',
    password ? `--password=${password}` : '',
    '--decrypt',
    `"${inputPath}"`,
    `"${outputPath}"`,
  ]
    .filter(Boolean)
    .join(' ')

  try {
    await execAsync(command, { maxBuffer: 50 * 1024 * 1024 })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    if (errorMsg.includes('invalid password') || errorMsg.includes('incorrect password')) {
      throw new Error('Invalid password')
    }
    throw new Error(`qpdf unlock failed: ${errorMsg}`)
  }
}
