import dynamic from 'next/dynamic'
import type { StaticImageData } from 'next/image'

import { Block } from '@/components/blocks/block'
import cppSvg from '@/images/logo/cpp.svg'
import pythonSvg from '@/images/logo/python.svg'
import csSvg from '@/images/logo/cs.svg'
import flutterSvg from '@/images/logo/flutter.svg'
import golangSvg from '@/images/logo/golang.svg'
import rustSvg from '@/images/logo/rust.svg'
import tsSvg from '@/images/logo/ts.svg'
import dartSvg from '@/images/logo/dart.svg'
import reactSvg from '@/images/logo/react.svg'

const Galton = dynamic(() => import('./galton').then(module => module.Galton), {
  ssr: false,
})

const images: StaticImageData[] = [
  cppSvg,
  csSvg,
  pythonSvg,
  dartSvg,
  flutterSvg,
  golangSvg,
  rustSvg,
  tsSvg,
  reactSvg,
]
export const Skills = () => {
  return (
    <Block
      className='z-20 row-span-4 bg-surface !p-0 max-sm:col-span-2 sm:row-span-2'
      data-type='about'
    >
      <div className='absolute right-0 top-0 w-20 -translate-y-1/2 translate-x-1/4 rotate-12 scale-75 rounded-lg p-1 shadow-lg before:absolute before:inset-x-0 before:bottom-0 before:z-20 before:origin-bottom before:scale-y-50 before:rounded-lg before:border-[40px] before:border-transparent before:border-b-red-500 before:border-l-red-500 before:content-["_"] after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:origin-bottom after:scale-y-50 after:rounded-lg after:border-[40px] after:border-transparent after:border-b-red-500 after:border-r-red-500 after:brightness-75 after:content-["_"] dark:before:border-b-blue-950 dark:before:border-l-blue-950 dark:after:border-b-blue-950 dark:after:border-r-blue-950 xl:scale-100'>
        <span className='block h-10 -translate-y-4 rounded bg-amber-50 px-2 py-1 uppercase text-slate-800 shadow dark:bg-gray-200'>
          Skills
        </span>
      </div>
      <Galton images={images} />
    </Block>
  )
}
