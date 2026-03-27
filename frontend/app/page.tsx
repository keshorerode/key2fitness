'use client'
import { useEffect, useState } from 'react'
import { fetchCMSData, defaultData, CMSData } from '@/lib/cms-data'
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const d = await fetchCMSData()
      setData(d)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return null // Hide while loading to prevent flicker

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
