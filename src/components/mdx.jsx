import Link from 'next/link'
import clsx from 'clsx'

import { Heading } from '@/components/Heading'
import { YouTube } from '@/components/YouTube'

export const a = Link
export { Button } from '@/components/Button'
export { CodeGroup, Code as code, Pre as pre } from '@/components/Code'
export { Badge } from '@/components/Badge'
export { YouTube }

export const h2 = function H2(props) {
  return <Heading level={2} {...props} />
}

export const h3 = function H3(props) {
  return <Heading level={3} {...props} />
}

export const h4 = function H4(props) {
  return <Heading level={4} {...props} />
}

export const h5 = function H5(props) {
  return <Heading level={5} {...props} />
}

function InfoIcon(props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <circle cx="8" cy="8" r="8" strokeWidth="0" />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 7.75h1.5v3.5"
      />
      <circle cx="8" cy="4" r=".5" fill="none" />
    </svg>
  )
}

function WarningIcon(props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8 3.5L3.5 12.5h9L8 3.5z"
      />
      <circle cx="8" cy="9" r=".5" fill="none" />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8 6.5v1"
      />
    </svg>
  )
}

function SuccessIcon(props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <circle cx="8" cy="8" r="8" strokeWidth="0" />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.5 8l2 2 3-3"
      />
    </svg>
  )
}

export function Note({ children }) {
  return (
    <div className="my-6 flex gap-2.5 rounded-l border border-orange-500/20 bg-orange-50/50 p-4 leading-6 text-orange-900 dark:border-orange-500/30 dark:bg-orange-500/5 dark:text-orange-200 dark:[--tw-prose-links-hover:theme(colors.orange.300)] dark:[--tw-prose-links:theme(colors.white)]">
      <InfoIcon className="mt-1 h-4 w-4 flex-none fill-orange-500 stroke-white dark:fill-orange-200/20 dark:stroke-orange-200" />
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export function Warning({ children }) {
  return (
    <div className="my-6 flex gap-2.5 rounded-l border border-red-500/20 bg-red-50/50 p-4 leading-6 text-red-900 dark:border-red-500/30 dark:bg-red-500/5 dark:text-red-200 dark:[--tw-prose-links-hover:theme(colors.red.300)] dark:[--tw-prose-links:theme(colors.white)]">
      <WarningIcon className="mt-1 h-4 w-4 flex-none fill-red-500 stroke-white dark:fill-red-200/20 dark:stroke-red-200" />
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export function Success({ children }) {
  return (
    <div className="my-6 flex gap-2.5 rounded-l border border-green-500/20 bg-green-50/50 p-4 leading-6 text-green-900 dark:border-green-500/30 dark:bg-green-500/5 dark:text-green-200 dark:[--tw-prose-links-hover:theme(colors.green.300)] dark:[--tw-prose-links:theme(colors.white)]">
      <SuccessIcon className="mt-1 h-4 w-4 flex-none fill-green-500 stroke-white dark:fill-green-200/20 dark:stroke-green-200" />
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export function Row({ children }) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2">
      {children}
    </div>
  )
}

export function Col({ children, sticky = false }) {
  return (
    <div
      className={clsx(
        '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
        sticky && 'xl:sticky xl:top-24'
      )}
    >
      {children}
    </div>
  )
}

export function Properties({ children }) {
  return (
    <div className="my-6">
      <ul
        role="list"
        className="m-0 max-w-[calc(theme(maxWidth.lg)-theme(spacing.8))] list-none divide-y divide-zinc-900/5 p-0 dark:divide-white/5"
      >
        {children}
      </ul>
    </div>
  )
}

export function Property({ name, type, required, min, max, minLen, maxLen, enumList, children }) {
  return (
    <li className="m-0 px-0 py-4 first:pt-0 last:pb-0">
      <dl className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
        <dt className="sr-only">Name</dt>
        <dd>
          <code>{name}</code>
        </dd>
        <dt className="sr-only">Type</dt>
        <dd className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
          {type}
        </dd>
        <dt className="sr-only">Required</dt>
          {required && <dd className="font-mono text-xs text-red-600 dark:text-red-600">
          required
        </dd>}
          {!required && <dd className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
          optional
        </dd>}
        <dt className="sr-only">Enum</dt>
        <dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {/*{enumList && "Possible values: [" + enumList.split(',').forEach((type) => (<tag>{type}</tag>)) + "]"}*/}
          {/*  {enumList && <div><text>Possible Values: [</text></div>}enumList.split(',').map(type => '<code>'+ type + '</code>')}*/}
            {min && !max && <div><strong>Possible Values: </strong><code className="text-sky-600 bg-sky-400/10">&gt;={min}</code></div>}
            {max && !min && <div><strong>Possible Values: </strong><code className="text-sky-600 bg-sky-400/10">&lt;={max}</code></div>}
            {min && max && <div><strong>Possible Values: </strong><code className="text-sky-600 bg-sky-400/10">&gt;={min}</code><text> and </text><code className="text-sky-600 bg-sky-400/10">&lt;={max}</code></div>}
            {minLen && !maxLen && <div><strong>Possible Values: </strong><code className="text-sky-600 bg-sky-400/10">&gt;={minLen} {type === "string" ? "characters" : "objects"}</code></div>}
            {maxLen && !minLen && <div><strong>Possible Values: </strong><code className="text-sky-600 bg-sky-400/10">&lt;={maxLen} {type === "string" ? "characters" : "objects"}</code></div>}
            {minLen && maxLen && <div><strong>Possible Values: </strong><code className="text-sky-600 bg-sky-400/10">&gt;={minLen} {type === "string" ? "characters" : "objects"}</code><text> and </text><code className="text-sky-600 bg-sky-400/10">&lt;={maxLen} {type === "string" ? "characters" : "objects"}</code></div>}
        </dd>
        <dt className="sr-only">Description</dt>
        <dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </dd>
      </dl>
    </li>
  )
}
