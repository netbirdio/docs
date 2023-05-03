export function Logo(props) {
  return (
      <div>
          <img src='/img/logo.svg' alt="some file"  height='200'
               width='180' className="dark:hidden"/>
          <img src='/img/logo-dark.svg' alt="some file"  height='200'
               width='180' className="hidden dark:block"/>
      </div>
  )
}
