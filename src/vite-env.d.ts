/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GATE_PASSCODE: string
  readonly VITE_QUOTA_PASSCODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
