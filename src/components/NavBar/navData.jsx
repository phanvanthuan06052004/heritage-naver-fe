import { BookOpen, Headset, Heart, House, Map, UserPlus } from 'lucide-react'

export const navLinks = [
  { 
    name: 'Home', 
    to: '/', 
    icon: () => <House className='h-5 w-5' /> 
  },
  { 
    name: 'Heritage Sites', 
    to: '/heritages', 
    icon: () => <BookOpen className='h-5 w-5' /> 
  },
  { 
    name: 'Explore', 
    to: '/explore', 
    icon: () => <Map className='h-5 w-5' /> 
  },
  { 
    name: 'About', 
    to: '/about', 
    icon: () => <Headset className='h-5 w-5' /> 
  },
]

export const userMenuLinks = [
  { 
    name: 'Favorites', 
    to: '/favorites', 
    icon: () => <Heart className='h-5 w-5' /> 
  },
  { 
    name: 'Profile', 
    to: '/profile', 
    icon: () => <UserPlus className='h-5 w-5' /> 
  },
] 