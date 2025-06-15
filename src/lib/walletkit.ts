
import { Core } from '@walletconnect/core'
import { WalletKit } from '@reown/walletkit'

const core = new Core({
  projectId: 'SupaBase',
})

const metadata = {
  name: 'Recruitment.box',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit',
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
