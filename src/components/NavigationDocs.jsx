import { useRouter } from 'next/router'
import clsx from 'clsx'
import {
   ActivePageMarker,
   NavLink,
   TopLevelNavItem,
   VisibleSectionHighlight
} from "@/components/NavigationAPI";
import {AnimatePresence, motion} from "framer-motion";
import {Button} from "@/components/mdx";
import {useState} from "react";
import {NavigationStateProvider, useNavigationState} from "@/components/NavigationState";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";


export const docsNavigation = [
   {
       title: '',
       links: [
           { title: 'Welcome', href: '/about-netbird/why-wireguard-with-netbird' },
           { title: 'Whats new in version xx', href: '/about-netbird/how-netbird-works' },
           { title: 'Release notes', href: '/about-netbird/netbird-vs-traditional-vpn' },
        
       ],
   },
   {
       title: 'GETTING STARTED',
       links: [
           { title: 'Introduction', href: '/how-to/getting-started' },
           { title: 'How NetBird works', href: '/how-to/installation'},
           { title: 'NetBird architecture', href: '/how-to/add-machines-to-your-network' },
           { title: 'NetBird vs. traditional VPN', href: '/how-to/approve-peers' },
           { title: 'Why WireGuard with NetBird', href: '/how-to/add-users-to-your-network' },
           { title: 'Requirements and prerequisites', href: '/how-to/register-machines-using-setup-keys' },
           {
            title: 'Install NetBird',
            isOpen: false,
            links: [
                { title: 'Linux', href: '/selfhosted/selfhosted-quickstart' },
                { title: 'NixOS', href: '/selfhosted/selfhosted-guide' },
                { title: 'MacOS', href: '/selfhosted/sqlite-store'},
                { title: 'Homebrew install', href: '/selfhosted/sqlite-store'},
                { title: 'Windows', href: '/selfhosted/sqlite-store'},
                { title: 'Android', href: '/selfhosted/sqlite-store'},
                { title: 'Binary Install', href: '/selfhosted/sqlite-store'},
                { title: 'Troubleshooting', href: '/selfhosted/sqlite-store'},
               
            ]
        },
           { title: 'Update NetBird', href: '/how-to/enforce-periodic-user-authentication' },
           


       ],
   },
   {
       title: 'MANAGE NETBIRD',
       links: [
           {
            title: 'Peers',
            isOpen: false,
            links: [
                { title: 'Add peers to your network', href: '/selfhosted/selfhosted-quickstart' },
                { title: 'Approve peers', href: '/selfhosted/selfhosted-guide' },
                {
                    title: 'Setup keys',
                    links: [
                        { title: 'Use setup keys for automation', href: '/about-netbird/netbird-vs-traditional-vpn' },
                        { title: 'Other', href: '/about-netbird/other' },
                        { title: 'FAQ', href: '/about-netbird/faq' },
                    ]
                },
            ]
        },
        {
            title: 'Access Control',
            isOpen: false,
            links: [
                {
                    title: 'Groups',
                    links: [
                        { title: 'Adding peers to groups', href: '/about-netbird/netbird-vs-traditional-vpn' },
                    ]
                },
                {
                    title: 'Rules',
                    links: [
                        { title: 'The default rule', href: '/about-netbird/netbird-vs-traditional-vpn' },
                        { title: 'Create rules', href: '/about-netbird/netbird-vs-traditional-vpn' },
                        {
                            title: 'Manage rules',
                            links: [
                                { title: 'Update rules', href: '/about-netbird/netbird-vs-traditional-vpn' },
                                { title: 'Disable rules', href: '/about-netbird/netbird-vs-traditional-vpn' },
                                { title: 'Delete rules', href: '/about-netbird/netbird-vs-traditional-vpn' },
                
                            ]
                        },
                    ]
                },
            ]
        },
        {
            title: 'Network Routes',
            isOpen: false,
            links: [
                { title: 'What are network routes', href: '/selfhosted/selfhosted-quickstart' },
                {
                    title: 'Manage network routes',
                    links: [
                        { title: 'Create a network route', href: '/about-netbird/netbird-vs-traditional-vpn' },
                        { title: 'Create a network route with routing group', href: '/about-netbird/other' },
                        { title: 'Create highly available routes', href: '/about-netbird/faq' },
                    ]
                },
            ]
        },
        {
            title: 'DNS',
            isOpen: false,
            links: [
                { title: 'DNS Settings', href: '/selfhosted/selfhosted-quickstart' },
                {
                    title: 'Name Servers',
                    links: [
                        { title: 'Manage nameserver groups', href: '/about-netbird/netbird-vs-traditional-vpn' },
                    ]
                },
            ]
        },
        {
            title: 'Team',
            isOpen: false,
            links: [
                { title: 'Service Users', href: '/selfhosted/selfhosted-quickstart' },
                {
                    title: 'DNS',
                    isOpen: true,
                    links: [
                        { title: 'Users', href: '/selfhosted/selfhosted-quickstart' },
                        {
                            title: 'Add users to your network',
                            links: [
                                { title: 'Direct user invite', href: '/about-netbird/netbird-vs-traditional-vpn' },
                                { title: 'Indirect user invite', href: '/about-netbird/netbird-vs-traditional-vpn' },
                            ]
                        },
                    ]
                },
            ]
        },
        {
            title: 'Settings',
            isOpen: false,
            links: [
                {
                    title: 'Authentication',
                    links: [
                        { title: 'Enforce periodic authentication', href: '/about-netbird/netbird-vs-traditional-vpn' },
                        { title: 'Configure authentication individually per peer', href: '/about-netbird/other' },
                    ]
                },
            ]
        },
        {
            title: 'Activity',
            isOpen: false,
            links: [
                {
                    title: 'tbd',
                    links: [
                        { title: 'tbd', href: '/about-netbird/netbird-vs-traditional-vpn' },
                        { title: 'tbd', href: '/about-netbird/other' },
                    ]
                },
            ]
        },
       ],
       
   },
   {
    title: 'USING NETBIRD',
    links: [
        { title: 'Usecase 1', href: '/selfhosted/selfhosted-quickstart' },
        { title: 'Usecase 2', href: '/selfhosted/sqlite-store'},
    ],

       
},
{
 title: 'Self-hosting NetBird',
 links: [
     { title: 'Quickstart guide', href: '/selfhosted/selfhosted-quickstart' },
     { title: 'Advanced guide', href: '/selfhosted/selfhosted-guide' },
     { title: 'Management SQLite Store', href: '/selfhosted/sqlite-store'},
     { title: 'Supported IdPs', href: '/selfhosted/identity-providers' },
 ],
 
 
},
{
    title: 'FAQ',
    links: [
        { title: 'tbd', href: '/selfhosted/selfhosted-quickstart' },
        { title: 'tbd', href: '/selfhosted/selfhosted-guide' },
        { title: 'tbd', href: '/selfhosted/sqlite-store'},
    ],
    
    
   },{
    title: 'GET MORE HELP',
    links: [
        { title: 'tbd', href: '/selfhosted/selfhosted-quickstart' },
        { title: 'tbd', href: '/selfhosted/selfhosted-guide' },
        { title: 'tbd', href: '/selfhosted/sqlite-store'},
    ],
    
    
   },

]





export function NavigationDocs({className}) {
 return (
   <nav className={className}>
     <ul role="list">
         <TopLevelNavItem href="https://netbird.io/">Home</TopLevelNavItem>
         <TopLevelNavItem href="/">Docs</TopLevelNavItem>
         <TopLevelNavItem href="/api">API</TopLevelNavItem>
         <TopLevelNavItem href="https://netbird.io/blog/">Blog</TopLevelNavItem>
         <TopLevelNavItem href="https://github.com/netbirdio/netbird">Github</TopLevelNavItem>
         <TopLevelNavItem href="https://join.slack.com/t/netbirdio/shared_invite/zt-vrahf41g-ik1v7fV8du6t0RwxSrJ96A">Support</TopLevelNavItem>
         {docsNavigation.map((group, groupIndex) => (
             <NavigationStateProvider key={group.title} index={groupIndex}>
                 <NavigationGroup
                     group={group}
                     index={groupIndex}
                     className={groupIndex === 0 && 'md:mt-0'}
                 />
             </NavigationStateProvider>
         ))}
         <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
             <Button href="https://app.netbird.io/" variant="filled" className="w-full">
                 Sign in
             </Button>
         </li>
     </ul>
   </nav>
 )
}


const findActiveGroupIndex = (group, pathname) => {
   let activeIndex = -1;
   group.links.forEach((link, index) => {
       if (link.href === pathname) {
           activeIndex = index;
       } else if (link.links) {
           const childIndex = findActiveGroupIndex(link, pathname);
           if (childIndex !== -1) {
               activeIndex = index;
           }
       }
   });
   return activeIndex;
}




function NavigationGroup({ group, className, hasChildren }) {
   let router = useRouter()
   let isActiveGroup = findActiveGroupIndex(group, router.pathname) !== -1;
   const [isOpen, setIsOpen] = useState(group.isOpen ? group.isOpen :!hasChildren);
   const [, setActiveHighlight] = useNavigationState();


   return (


       <li className={clsx('relative', className, hasChildren ? "" : "mt-6")}>
           <motion.h2
               layout={"size"}
               className={clsx(
                   "flex justify-between items-center gap-2 group",
                   hasChildren ? "text-zinc-700 select-none py-1 pr-3 hover:text-zinc-900 dark:text-zinc-300 font-medium dark:hover:text-white text-sm cursor-pointer" : "text-xs font-semibold text-zinc-900 dark:text-white"
                   )}
               onClick={() => {
                   setIsOpen(!isOpen)
                   if(!isOpen) {
                       router.push(group.links[0].href)
                       setActiveHighlight()
                   }else {
                       setActiveHighlight(group.title)
                   }
               }}
               data-nb-link={group.title}
           >
               {group.title}
               {hasChildren && <ChevronDownIcon className={clsx("fill-zinc-700 group-hover:fill-zinc-900 dark:fill-zinc-300 dark:group-hover:fill-white","transition", isOpen ? "transform rotate-180" : "")} size={10} />}
           </motion.h2>
           <div className={clsx("relative", hasChildren ? "" : "mt-3 pl-2")}>
               {!hasChildren &&
                   <>
                       <AnimatePresence >
                           {isActiveGroup && (
                               <VisibleSectionHighlight group={group} pathname={router.pathname} />
                           )}
                       </AnimatePresence>
                       <motion.div
                           layout
                           className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
                       />
                       <AnimatePresence initial={false}>
                           {isActiveGroup && (
                               <ActivePageMarker group={group} pathname={router.pathname}/>
                           )}
                       </AnimatePresence>
                   </>
               }


               <AnimatePresence mode={"wait"} initial={false}>
                   {isOpen && <motion.ul
                       role="list"
                       initial={{ opacity: 0 }}
                       animate={{
                           opacity: 1,
                           transition: { delay: 0.05 },
                       }}
                       exit={{
                           opacity: 0,
                           transition: { duration: 0.15 },
                       }}
                       className="border-l border-transparent">
                           {group.links.map((link) =>  {
                               return link.href ?
                                   <motion.li key={link.href} layout={"position"} className="relative">
                                       <NavLink href={link.href} active={link.href === router.pathname} links={link.links}>
                                           {link.title}
                                       </NavLink>
                                   </motion.li>
                                   :
                                   <NavigationGroup className={"ml-4"} key={link.title + isOpen} group={link} hasChildren={true} />
                           })}
                   </motion.ul>}


               </AnimatePresence>
           </div>
       </li>
   )
}



