import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
  }
}

export default function GoogleSignIn({ onCredential, disabled = false }: { onCredential: (credential: string) => void; disabled?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const callbackRef = useRef(onCredential)
  const [available, setAvailable] = useState(true)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

  useEffect(() => { callbackRef.current = onCredential }, [onCredential])

  useEffect(() => {
    if (!clientId) {
      setAvailable(false)
      return
    }

    const render = () => {
      if (!window.google?.accounts.id || !hostRef.current) return
      hostRef.current.innerHTML = ''
      window.google.accounts.id.initialize({ client_id: clientId, callback: (response) => callbackRef.current(response.credential) })
      window.google.accounts.id.renderButton(hostRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        width: Math.min(340, hostRef.current.clientWidth || 340),
      })
    }

    if (window.google?.accounts.id) {
      render()
      return
    }

    let script = document.querySelector<HTMLScriptElement>('script[data-google-identity]')
    if (!script) {
      script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.dataset.googleIdentity = 'true'
      document.head.appendChild(script)
    }
    script.addEventListener('load', render)
    return () => script?.removeEventListener('load', render)
  }, [clientId])

  if (!available) return <p className="google-config-note">Google sign-in will activate after the Google Client ID is added.</p>
  return <div className={`google-signin-host ${disabled ? 'is-disabled' : ''}`} ref={hostRef} aria-busy={disabled} />
}
