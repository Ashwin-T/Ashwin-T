import { useState, useEffect } from 'react'
import './styles/global.css'
import Hero from './components/hero/Hero'
import Chat from './components/chat/Chat'
import Loading from './components/loading/Loading'
import Footer from './components/footer/Footer'
import Preview from './components/chat/components/Preview'

export default function App() {
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    const checkHash = () => setIsPreview(window.location.hash === '#preview')
    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [])

  if (isPreview) {
    return <Preview />
  }

  return (
    <Loading>
      <Hero />
      <Chat />
      <Footer />
    </Loading>
  )
}