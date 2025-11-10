import { Map, MessageSquare, Rocket, Telescope, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'

import { Button } from '~/components/common/ui/Button'
import SectionContainer from './SectionContainer'
import SideNavigation from './SideNavigation'
import Title from '~/components/common/Title'
import VisionItem from './components/VisionItem'
import SectionHeader from './components/SectionHeader'

const TeamMembers = lazy(() => import('./TeamMembers'))
const ContactInfo = lazy(() => import('./ContactInfo'))
const CoreValues = lazy(() => import('./CoreValues'))
const Timeline = lazy(() => import('./Timeline'))

const About = () => {
  const [activeSection, setActiveSection] = useState('vision')

  // Handle scroll-based section activation
  const handleScroll = useCallback(() => {
    const sections = ['vision', 'story', 'values', 'team', 'contact']
    
    // Find the section currently in view
    const current = sections.find(section => {
      const element = document.getElementById(section)
      if (!element) return false
      
      const rect = element.getBoundingClientRect()
      return rect.top <= 150 && rect.bottom >= 150
    })
    
    if (current) {
      setActiveSection(current)
    }
  }, [])
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <section>
      <SideNavigation activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className='relative w-full bg-secondary/50'>
        {/* Vision & Mission */}
        <SectionContainer id='vision' className='py-24'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-16 items-center'>
            <div className='z-10 aspect-square rounded-2xl overflow-hidden shadow-sm order-2 sm:order-1'>
              <img
                src='/images/vision-banner.png'
                alt='Vision and Mission'
                className='object-cover brightness-90 w-full h-full'
                loading='lazy'
                width='600'
                height='600'
              />
            </div>
            <div className='max-w-3xl mx-auto text-justify order-1 sm:order-2'>
              <div className='text-center'>
                <div className='inline-block px-5 py-2 bg-heritage/90 text-white rounded-full font-medium mb-4 '>
                  Vision & Mission
                </div>
              </div>
              <div className='text-center'>
                <Title title='Connecting the Past with the Present' className='text-3xl sm:text-4xl mb-6' />
              </div>
              <p className='text-lg mb-8 leading-relaxed'>
                The Heritage project was born with the mission to preserve, promote and spread the cultural and historical values
                of the nation to the community, especially the younger generation through modern technology platforms.
              </p>
              <div className='space-y-6'>
                <VisionItem
                  icon={<Telescope className='text-heritage-dark' />}
                  title='Vision'
                  description='Become the leading platform for preserving and promoting the value of Vietnamese cultural heritage, connecting people with national history through modern technology.'
                />
                <VisionItem
                  icon={<Rocket className='text-heritage-dark' />}
                  title='Mission'
                  description='Use technology to preserve, spread and educate about Vietnamese cultural heritage, creating interactive and engaging experiences for users.'
                />
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* Our Story - Timeline */}
        <SectionContainer id='story' className='py-24 bg-primary/5'>
          <SectionHeader
            eyebrow='Our Story'
            title='Development Journey'
            description='From idea to reality, our journey is a testament to our passion for cultural heritage and technology.'
          />  
          <Suspense fallback={<div className='h-96 flex items-center justify-center'>Loading...</div>}>
            <Timeline />
          </Suspense>
          
        </SectionContainer>

        {/* Core Values */}
        <SectionContainer id='values' className='py-24'>
          <SectionHeader 
            eyebrow='Core Values'
            title='Values We Pursue'
            description='The principles and values that guide all our activities in the journey of cultural heritage preservation.'
          />
          <Suspense fallback={<div className='h-96 flex items-center justify-center'>Loading...</div>}>
            <CoreValues />
          </Suspense>
        </SectionContainer>

        {/* Team */}
        <SectionContainer id='team' className='py-24 bg-secondary/50'>
          <SectionHeader 
            eyebrow='Team'
            title='Talented People'
            description='Meet the passionate and talented people behind the Heritage project.'
          />
          <Suspense fallback={<div className='h-96 flex items-center justify-center'>Loading...</div>}>
            <TeamMembers />
          </Suspense>
        </SectionContainer>

        {/* Call to Action */}
        <section className='py-24 bg-heritage/85 text-white'>
          <div className='lcn-container-x text-center'>
            <Title title='Join Us' className='text-3xl sm:text-4xl mb-6 text-white' />
            <p className='text-xl mb-8'>Become part of the journey to preserve and promote the values of Vietnamese cultural heritage.</p>
            <div className='flex flex-wrap justify-center gap-4'>
              <Link to='/register'>
                <Button
                  variant='outline'
                  size='lg'
                  className='w-52 text-muted-foreground backdrop-blur-sm border-white hover:bg-white/20 hover:text-white'
                >
                  <UserPlus className='mr-2' size={20} />
                  Sign Up Now
                </Button>
              </Link>
              <Link to='/explore'>
                <Button 
                  size='lg'
                  variant='outline'
                  className='bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20 w-62'
                >
                  <Map className='mr-2' size={20} />
                  Explore Map
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact */}
        <SectionContainer id='contact' className='py-24 bg-secondary/50'>
          <SectionHeader 
            eyebrow='Contact'
            title='Connect With Us'
            description='We are always ready to listen to your feedback and answer your questions. Contact us through the following channels:'
          />
          <Suspense fallback={<div className='h-96 flex items-center justify-center'>Loading...</div>}>
            <ContactInfo />
          </Suspense>
        </SectionContainer>
      </main>
    </section>
  )
}

export default About
