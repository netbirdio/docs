import {useRouter} from "next/router";

export function Logo(props) {
    let router = useRouter()
  return (
      <div>
          {!router.route.startsWith('/ipa') && <img src='/docs-static/img/logo/logo-docs.svg' alt="some file"  height='200'
               width='180' className="dark:hidden"/>}
          {!router.route.startsWith('/ipa') &&  <img src='/docs-static/img/logo/logo-docs-dark.svg' alt="some file"  height='200'
               width='180' className="hidden dark:block"/>}
          {router.route.startsWith('/ipa') && <img src='/docs-static/img/logo/logo-api.svg' alt="some file"  height='200'
               width='180' className="dark:hidden"/>}
          {router.route.startsWith('/ipa') && <img src='/docs-static/img/logo/logo-api-dark.svg' alt="some file"  height='200'
               width='180' className="hidden dark:block"/>}
      </div>
  )
}
