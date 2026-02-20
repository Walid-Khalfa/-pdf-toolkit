export function downloadBytes(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadMultiple(files: { bytes: Uint8Array; name: string }[]): void {
  files.forEach(({ bytes, name }, i) => {
    setTimeout(() => downloadBytes(bytes, name), i * 300)
  })
}
