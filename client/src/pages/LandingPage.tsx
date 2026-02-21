import ToolCard from '@/components/ui/ToolCard'

const tools = [
  {
    title: 'Merge PDFs',
    description: 'Combine multiple PDF files into one. Drag and drop to reorder pages.',
    href: '/merge',
    color: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 text-red-600 dark:text-red-400',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Split PDF',
    description: 'Split a PDF into individual pages or extract a custom page range.',
    href: '/split',
    color: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 text-orange-600 dark:text-orange-400',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    ),
  },
  {
    title: 'Images to PDF',
    description: 'Convert JPG, PNG, and WebP images into a single PDF document.',
    href: '/images-to-pdf',
    color: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 text-blue-600 dark:text-blue-400',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality. Choose compression level.',
    href: '/compress',
    color: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 text-purple-600 dark:text-purple-400',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
    badge: 'New',
  },
  {
    title: 'Protect PDF',
    description: 'Add password protection with customizable permissions for printing and copying.',
    href: '/protect',
    color: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 text-amber-600 dark:text-amber-400',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    badge: 'New',
  },
  {
    title: 'Unlock PDF',
    description: 'Remove password protection from your PDF files. Enter the correct password.',
    href: '/unlock',
    color: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 text-green-600 dark:text-green-400',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
      </svg>
    ),
    badge: 'New',
  },
  {
    title: 'PDF to Images',
    description: 'Convert PDF pages into high-quality images. Choose format and resolution.',
    href: '/pdf-to-images',
    color: 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/50 dark:to-teal-900/30 text-teal-600 dark:text-teal-400',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    badge: 'New',
  },
]

const features = [
  {
    icon: (
      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: '100% Private',
    description: 'All processing happens in your browser. Your files are never uploaded to any server.',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-100 dark:border-green-900/50',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Fast & Free',
    description: 'No registration, no limits, no fees. Just drag, drop, and download.',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-100 dark:border-blue-900/50',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Works Everywhere',
    description: 'Compatible with all modern browsers on desktop and mobile.',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-100 dark:border-purple-900/50',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden 
                          bg-gradient-to-b from-white via-gray-50/50 to-gray-50 
                          dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950
                          border-b border-gray-200/50 dark:border-gray-800/50">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 mesh-gradient opacity-80" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />

        {/* Floating PDF particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                top: `${15 + i * 15}%`,
                left: `${10 + (i % 3) * 30}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${6 + i}s`,
              }}
            >
              <svg className="w-8 h-8 text-primary-500/20 dark:text-primary-400/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 
                          bg-primary-50/80 dark:bg-primary-950/50 
                          text-primary-700 dark:text-primary-300 
                          text-sm font-medium px-4 py-1.5 
                          rounded-full mb-8 
                          border border-primary-100 dark:border-primary-900/50
                          backdrop-blur-sm
                          animate-fade-in-up">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>100% free</span>
            <span className="w-1 h-1 rounded-full bg-primary-400 dark:bg-primary-600" />
            <span>No sign-up required</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold 
                         text-gray-900 dark:text-white 
                         tracking-tight mb-6
                         animate-fade-in-up animation-delay-100">
            Every PDF tool you need,
            <br className="hidden sm:block" />
            {' '}
            <span className="gradient-text-animated">right in your browser</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 
                         max-w-2xl mx-auto mb-8
                         animate-fade-in-up animation-delay-200">
            Merge, split, and convert images to PDF — all client-side with zero file uploads. 
            <span className="font-medium text-gray-700 dark:text-gray-300">Your documents stay on your device.</span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4
                          animate-fade-in-up animation-delay-300">
            <a
              href="#tools"
              className="inline-flex items-center gap-2 px-6 py-3 
                         bg-primary-600 hover:bg-primary-700
                         text-white font-semibold rounded-xl
                         shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30
                         transition-all duration-200
                         active:scale-[0.98]"
            >
              Get Started
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3 
                         bg-white dark:bg-gray-800
                         text-gray-700 dark:text-gray-200
                         font-medium rounded-xl
                         border border-gray-200 dark:border-gray-700
                         hover:border-gray-300 dark:hover:border-gray-600
                         shadow-sm hover:shadow-md
                         transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent" />
      </section>

      {/* Tools Section */}
      <section id="tools" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Choose a tool
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Select the operation you want to perform
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool, index) => (
            <ToolCard key={tool.href} {...tool} delay={index * 100} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Why PDF Toolkit?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Built with privacy and simplicity in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="feature-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`feature-icon ${feature.bgColor} border ${feature.borderColor}`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-orange-50 
                          dark:from-primary-950/30 dark:via-gray-950 dark:to-orange-950/20
                          border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl 
                          bg-primary-100 dark:bg-primary-900/50 
                          text-primary-600 dark:text-primary-400 mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Your files stay private
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-6">
            All processing happens entirely in your browser. No uploads, no servers, no tracking. 
            Your documents never leave your device.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No registration
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No file size limits
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Works offline
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
