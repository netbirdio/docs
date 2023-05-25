import {useRouter} from "next/router";

export function Logo(props) {
    let router = useRouter()
  return (
      <div>
          {!router.route.startsWith('/ipa') && <img src='/docs-static/img/logo/logo-docs.png' alt="some file"  height='200'
               width='180' className="dark:hidden"/>}
          {!router.route.startsWith('/ipa') &&  <img src='/docs-static/img/logo/logo-docs-dark.png' alt="some file"  height='200'
               width='180' className="hidden dark:block"/>}
          {router.route.startsWith('/ipa') && <img src='/docs-static/img/logo/logo-api.png' alt="some file"  height='200'
               width='180' className="dark:hidden"/>}
          {router.route.startsWith('/ipa') && <img src='/docs-static/img/logo/logo-api-dark.png' alt="some file"  height='200'
               width='180' className="hidden dark:block"/>}
      </div>
  )
}
