/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DONATION_TOTAL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
