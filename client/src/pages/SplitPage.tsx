import SplitTool from '@/components/tools/SplitTool'

export default function SplitPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-orange-50 items-center justify-center mb-4 border border-orange-100">
          <svg className="w-7 h-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Split PDF</h1>
        <p className="text-gray-500">Split a PDF into individual pages or extract a specific page range.</p>
      </div>
      <SplitTool />
    </div>
  )
}
