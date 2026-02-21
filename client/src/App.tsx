import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import LandingPage from '@/pages/LandingPage'
import MergePage from '@/pages/MergePage'
import SplitPage from '@/pages/SplitPage'
import ImagesToPdfPage from '@/pages/ImagesToPdfPage'
import CompressPage from '@/pages/CompressPage'
import ProtectPage from '@/pages/ProtectPage'
import UnlockPage from '@/pages/UnlockPage'
import PdfToImagesPage from '@/pages/PdfToImagesPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/merge" element={<MergePage />} />
          <Route path="/split" element={<SplitPage />} />
          <Route path="/images-to-pdf" element={<ImagesToPdfPage />} />
          <Route path="/compress" element={<CompressPage />} />
          <Route path="/protect" element={<ProtectPage />} />
          <Route path="/unlock" element={<UnlockPage />} />
          <Route path="/pdf-to-images" element={<PdfToImagesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
