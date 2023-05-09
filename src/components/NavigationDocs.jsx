import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import {ActivePageMarker, docsNavigation, NavLink, TopLevelNavItem} from "@/components/NavigationAPI";
import {useIsInsideMobileNavigation} from "@/components/MobileNavigation";
import {useSectionStore} from "@/components/SectionProvider";
import {AnimatePresence, motion} from "framer-motion";

export function NavigationDocs(props) {
  return (
    <nav {...props}>
      <ul role="list">
          <TopLevelNavItem href="https://netbird.io/">Home</TopLevelNavItem>
          <TopLevelNavItem href="/docs/introductions">Docs</TopLevelNavItem>
          <TopLevelNavItem href="/ipa/introductions">API</TopLevelNavItem>
          <TopLevelNavItem href="https://netbird.io/blog/">Blog</TopLevelNavItem>
          <TopLevelNavItem href="https://github.com/netbirdio/netbird">Github</TopLevelNavItem>
          <TopLevelNavItem href="https://join.slack.com/t/netbirdio/shared_invite/zt-vrahf41g-ik1v7fV8du6t0RwxSrJ96A">Support</TopLevelNavItem>
          {docsNavigation.map((group, groupIndex) => (
              <NavigationGroup
                  key={group.title}
                  group={group}
                  className={groupIndex === 0 && 'md:mt-0'}
              />
          ))}
      </ul>
    </nav>
  )
}

// <li key={section.title} className={clsx('relative mt-6', groupIndex === 0 && 'md:mt-0')}>
//     <h2 className="font-display font-medium text-slate-900 dark:text-white">
//         {section.title}
//     </h2>
//     <ul
//         role="list"
//         className="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200"
//     >
//         {section.links.map((link) => (
//             <li key={link.href} className="relative">
//                 <Link
//                     href={link.href}
//                     className={clsx(
//                         'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full',
//                         link.href === router.pathname
//                             ? 'font-semibold text-sky-500 before:bg-sky-500'
//                             : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
//                     )}
//                 >
//                     {link.title}
//                 </Link>
//             </li>
//         ))}
//     </ul>
// </li>

function NavigationGroup({ group, className }) {
    // If this is the mobile navigation then we always render the initial
    // state, so that the state does not change during the close animation.
    // The state will still update when we re-open (re-render) the navigation.
    let router = useRouter()

    let isActiveGroup =
        group.links.findIndex((link) => link.href === router.pathname) !== -1


    return (
        <li className={clsx('relative mt-6', className)}>
            <motion.h2
                layout="position"
                className="text-xs font-semibold text-zinc-900 dark:text-white"
            >
                {group.title}
            </motion.h2>
            <div className="relative mt-3 pl-2">
                <motion.div
                    layout
                    className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
                />
                <AnimatePresence initial={false}>
                    {isActiveGroup && (
                        <ActivePageMarker group={group} pathname={router.pathname} />
                    )}
                </AnimatePresence>
                <ul role="list" className="border-l border-transparent">
                    {group.links.map((link) => (
                        <motion.li key={link.href} layout="position" className="relative">
                            <NavLink href={link.href} active={link.href === router.pathname}>
                                {link.title}
                            </NavLink>
                            {/*<AnimatePresence mode="popLayout" initial={false}>*/}
                            {/*    {link.href === router.pathname && sections.length > 0 && (*/}
                            {/*        <motion.ul*/}
                            {/*            role="list"*/}
                            {/*            initial={{ opacity: 0 }}*/}
                            {/*            animate={{*/}
                            {/*                opacity: 1,*/}
                            {/*                transition: { delay: 0.1 },*/}
                            {/*            }}*/}
                            {/*            exit={{*/}
                            {/*                opacity: 0,*/}
                            {/*                transition: { duration: 0.15 },*/}
                            {/*            }}*/}
                            {/*        >*/}
                            {/*            {sections.map((section) => (*/}
                            {/*                <li key={section.id}>*/}
                            {/*                    <NavLink*/}
                            {/*                        href={`${link.href}#${section.id}`}*/}
                            {/*                        tag={section.tag}*/}
                            {/*                        isAnchorLink*/}
                            {/*                    >*/}
                            {/*                        {section.title}*/}
                            {/*                    </NavLink>*/}
                            {/*                </li>*/}
                            {/*            ))}*/}
                            {/*        </motion.ul>*/}
                            {/*    )}*/}
                            {/*</AnimatePresence>*/}
                        </motion.li>
                    ))}
                </ul>
            </div>
        </li>
    )
}
