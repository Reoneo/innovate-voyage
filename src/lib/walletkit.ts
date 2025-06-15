
import { Core } from '@walletconnect/core'
import { WalletKit } from '@reown/walletkit'

// Use a proper WalletConnect project ID - you should get this from WalletConnect Cloud
const projectId = process.env.VITE_WALLETCONNECT_PROJECT_ID || '0123456789abcdef0123456789abcdef'

const core = new Core({
  projectId,
})

const metadata = {
  name: 'Recruitment.box',
  description: 'Web3 Career Platform',
  url: window.location.origin,
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
}

const walletKitPromise = WalletKit.init({
  core,
  metadata,
})

// Export as a hook-like async function delivering initialized walletKit
export async function getWalletKit() {
  return walletKitPromise
}
