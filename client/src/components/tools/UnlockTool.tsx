import { useState } from 'react'
import { useFileUpload } from '@/hooks/useFileUpload'
import { validatePdfFile } from '@/lib/utils/fileUtils'
import { uploadFile } from '@/lib/api/client'
import { downloadBytes } from '@/lib/utils/downloadUtils'
import FileDropZone from '@/components/ui/FileDropZone'
import ErrorBanner from '@/components/ui/ErrorBanner'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import type { ToolStatus } from '@/types'

export default function UnlockTool() {
  const [status, setStatus] = useState<ToolStatus>('idle')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const upload = useFileUpload({
    accept: ['application/pdf'],
    multiple: false,
    validate: validatePdfFile,
  })

  const validatePassword = () => {
    if (!password) {
      return 'Password is required'
    }
    if (password.length < 1) {
      return 'Password cannot be empty'
    }
    return ''
  }

  const handleUnlock = async () => {
    const file = upload.files[0]?.file
    if (!file) return

    const err = validatePassword()
    if (err) {
      setPasswordError(err)
      return
    }
    setPasswordError('')

    setStatus('processing')
    try {
      const blob = await uploadFile<Blob>({
        endpoint: '/unlock',
        file,
        additionalData: { password },
      })

      const arrayBuffer = await blob.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      
      const unlockedFileName = file.name.replace('.pdf', '_unlocked.pdf')
      downloadBytes(bytes, unlockedFileName)
      
      setStatus('done')
    } catch (error) {
      console.error('Unlock error:', error)
      const errorMessage = error instanceof Error ? error.message : ''
      
      if (errorMessage.includes('Invalid password') || errorMessage.includes('401')) {
        setPasswordError('Invalid password. Please check and try again.')
      } else if (errorMessage.includes('encrypted')) {
        setPasswordError('This file is not password protected or uses unsupported encryption.')
      } else {
        setPasswordError('')
      }
      setStatus('error')
    }
  }

  const handleReset = () => {
    upload.clearFiles()
    setStatus('idle')
    setPassword('')
    setPasswordError('')
  }

  const file = upload.files[0]

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropZone
          isDragging={upload.isDragging}
          onDragOver={upload.onDragOver}
          onDragLeave={upload.onDragLeave}
          onDrop={upload.onDrop}
          onInputChange={upload.onInputChange}
          onClick={upload.openPicker}
          inputRef={upload.inputRef}
          accept={upload.accept}
          multiple={false}
          label="Drop a protected PDF file here or click to select"
          hint="Select a password-protected PDF to unlock"
          icon={
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          }
        />
      ) : (
        <div className="file-item animate-fade-in p-4">
          <div className="w-10 h-12 bg-gradient-to-br from-green-50 to-green-100 
                          dark:from-green-950/50 dark:to-green-900/30
                          rounded-lg flex items-center justify-center flex-shrink-0 
                          border border-green-100 dark:border-green-900/50">
            <svg className="w-5 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
          </div>
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 
                       p-1 rounded 
                       hover:bg-red-50 dark:hover:bg-red-950/30
                       transition-colors"
            aria-label="Remove file"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <ErrorBanner errors={upload.errors} />

      {file && (
        <div className="space-y-4 animate-fade-in">
          <div className="options-panel">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Unlock password</p>
            
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter the password to unlock PDF"
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter the password that was used to protect this PDF
              </p>
            </div>

            {passwordError && <p className="text-xs text-red-600 dark:text-red-400 mt-2">{passwordError}</p>}
          </div>
        </div>
      )}

      {status === 'processing' && <ProgressBar label="Unlocking PDF..." />}

      {status === 'done' && (
        <div className="success-banner">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">PDF unlocked and downloaded successfully!</p>
        </div>
      )}

      {status === 'error' && !passwordError && (
        <ErrorBanner errors={['Failed to unlock PDF. Please check that the file is a valid protected PDF.']} />
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={handleUnlock}
          disabled={!file || status === 'processing'}
          loading={status === 'processing'}
          size="lg"
          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          }
        >
          Unlock PDF
        </Button>
        {(upload.files.length > 0 || status !== 'idle') && (
          <Button variant="secondary" onClick={handleReset} size="lg">
            Start over
          </Button>
        )}
      </div>
    </div>
  )
}