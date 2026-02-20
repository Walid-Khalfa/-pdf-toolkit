import MergeTool from '@/components/tools/MergeTool'

export default function MergePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-red-50 items-center justify-center mb-4 border border-red-100">
          <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Merge PDFs</h1>
        <p className="text-gray-500">Combine multiple PDF files into one document. Drag to reorder before merging.</p>
      </div>
      <MergeTool />
    </div>
  )
}
