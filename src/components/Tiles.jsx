import Link from 'next/link'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

import { GridPattern } from '@/components/GridPattern'
import { Heading } from '@/components/Heading'

function TilePattern({ mouseX, mouseY }) {
  let maskImage = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`
  let style = { maskImage, WebkitMaskImage: maskImage }

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5 dark:fill-white/1 dark:stroke-white/2.5"
        />
      </div>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FFAC1C] to-[#F28C28] opacity-0 transition duration-300 group-hover:opacity-30 dark:group-hover:opacity-60 dark:from-[#F28C28]/30 dark:to-[#FF7518]/30"
        style={style}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100"
        style={style}
      >
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/50 stroke-black/70 dark:fill-white/2.5 dark:stroke-white/10"
        />
      </motion.div>
    </div>
  )
}

/**
 * Generic Tiles component for displaying a grid of tile items
 * 
 * @param {string} title - The heading title for the tiles section
 * @param {string} [id] - Optional id for the heading anchor
 * @param {string} [description] - Optional description text to display below the title
 * @param {Array<{href: string, name: string, description: string}>} items - Array of tile items
 * @param {string} [buttonText='Read more'] - Optional button text (defaults to "Read more")
 */
export function Tiles({ title, id, description, items, buttonText = 'Read more' }) {
  const hasHeader = title || description;
  
  return (
    <div className="my-16 xl:max-w-none">
      {title && (
        <Heading level={2} id={id} anchor={!!id}>
          {title}
        </Heading>
      )}
      {description && (
        <div className={`text-sm text-zinc-600 dark:text-zinc-400 ${title ? 'mt-4' : ''}`}>
          {description}
        </div>
      )}
      <div className={`not-prose grid grid-cols-1 gap-8 sm:grid-cols-2 ${hasHeader ? 'mt-4 border-t border-zinc-900/5 pt-10 dark:border-white/5' : ''}`}>
        {items.map((item) => {
          let mouseX = useMotionValue(0)
          let mouseY = useMotionValue(0)

          function onMouseMove({ currentTarget, clientX, clientY }) {
            let { left, top } = currentTarget.getBoundingClientRect()
            mouseX.set(clientX - left)
            mouseY.set(clientY - top)
          }

          return (
            <div
              key={item.href}
              onMouseMove={onMouseMove}
              className="group relative flex rounded-2xl bg-zinc-50 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5"
            >
              <TilePattern mouseX={mouseX} mouseY={mouseY} />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/7.5 group-hover:ring-zinc-900/10 dark:ring-white/10 dark:group-hover:ring-white/20" />
              <div className="relative rounded-2xl px-4 pb-4 pt-4">
                <h3 className="text-sm font-semibold leading-7 text-zinc-900 dark:text-white">
                  <Link href={item.href}>
                    <span className="absolute inset-0 rounded-2xl" />
                    {item.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}