import { GridPattern } from '@/components/GridPattern'

export function HeroPattern() {
  return (
    <div className="absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden">
      <div className="absolute inset-0 hidden dark:block z-0" style={{ backgroundColor: '#181A1D' }}>
        <GridPattern
          width={72}
          height={56}
          x="-12"
          y="4"
          squares={[
            [4, 3],
            [2, 1],
            [7, 3],
            [10, 6],
          ]}
          className="absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/40 stroke-black/50 mix-blend-overlay dark:fill-white/2.5 dark:stroke-white/5"
        />
      </div>
      <div className="absolute inset-x-0 top-0 h-[25rem] dark:[mask-image:linear-gradient(white,transparent)] pointer-events-none z-10">
        <svg
          viewBox="0 0 1113 440"
          preserveAspectRatio="xMidYMin slice"
          aria-hidden="true"
          className="absolute left-1/2 top-0 -translate-x-1/2 w-full min-w-[69.5625rem] h-full fill-white blur-[26px] dark:hidden"
        >
          <path d="M.016 439.5s-9.5-300 434-300S882.516 20 882.516 20V0h230.004v439.5H.016Z" />
        </svg>
      </div>
    </div>
  )
}