'use client'
import { useEffect, useState } from 'react'
import { loadData, defaultData, CMSData } from '@/lib/cms-data'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FemaleSection from '@/components/FemaleSection'
import TrainingSection from '@/components/TrainingSection'
import GallerySection from '@/components/GallerySection'
import PackagesSection from '@/components/PackagesSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  const [data, setData] = useState<CMSData>(defaultData)

  useEffect(() => {
    setData(loadData())
    // Re-apply if localStorage changes (e.g. after saving in admin)
    const onStorage = () => setData(loadData())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <main>
      <Navbar />
      <HeroSection data={data} />
      <FemaleSection data={data} />
      <TrainingSection data={data} />
      <GallerySection data={data} />
      <PackagesSection data={data} />
      <ContactSection data={data} />
      <Footer />
    </main>
  )
}
