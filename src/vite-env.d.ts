
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_API_TOKEN: string
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
