import { clsx } from 'clsx'
import { DarkToggleProvider, DarkToggleScript } from 'dark-toggle/react'

import type { Metadata, Viewport } from 'next'
import { Handlee, Nunito, Sorts_Mill_Goudy } from 'next/font/google'

import { Provider } from '@/provider'

import './globals.css'

const sans = Nunito({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-remote-sans',
  weight: ['400', '600', '700'],
})

const serif = Sorts_Mill_Goudy({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-remote-serif',
  weight: ['400'],
})

const handwriting = Handlee({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-remote-handwriting',
  weight: ['400'],
})

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { color: '#ffffff', media: '(prefers-color-scheme: light)' },
    { color: '#000212', media: '(prefers-color-scheme: dark)' },
  ],
}

export const metadata: Metadata = {
  applicationName: 'Qingzt Blog',
  authors: {
    name: 'qingzt',
    url: 'https://github.com/qingzt',
  },
  creator: 'qingzt',
  description:
    'Dive into front-end development with a focus on C++',
  generator: 'Next.js',
  keywords: [
    'React',
  ],
  publisher: 'qingzt',
  title: {
    absolute: 'Qingzt Blog',
    template: '%s | qingzt.blog',
  },
  verification: {
    google: '',
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      suppressHydrationWarning
      className={clsx(sans.variable, serif.variable, handwriting.variable)}
      lang='en'
    >
      <head>
        <link
          href='/icon/favicon-32x32.png'
          rel='icon'
          sizes='32x32'
          type='image/png'
        />
        <link
          href='/icon/favicon-16x16.png'
          rel='icon'
          sizes='16x16'
          type='image/png'
        />
        <link
          href='/icon/apple-touch-icon.png'
          rel='apple-touch-icon'
          sizes='180x180'
        />
        <link href='/site.webmanifest' rel='manifest' />
        <link
          href='/icon/android-chrome-192x192.png'
          rel='icon'
          sizes='192x192'
          type='image/png'
        />
        <link
          href='/icon/android-chrome-512x512.png'
          rel='icon'
          sizes='512x512'
          type='image/png'
        />
        <DarkToggleScript />
      </head>
      <body className='bg-surface font-primary text-color-1'>
        <div className='fixed inset-0 bottom-1/4 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:hidden' />
        <Provider>
          <DarkToggleProvider>{children}</DarkToggleProvider>
        </Provider>
      </body>
    </html>
  )
}
