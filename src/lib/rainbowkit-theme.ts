
import { Theme } from '@rainbow-me/rainbowkit';

export const customTheme: Theme = {
  blurs: {
    modalOverlay: 'blur(4px)',
  },
  colors: {
    accentColor: '#0E76FD',
    accentColorForeground: '#FFF',
    actionButtonBorder: 'rgba(255, 255, 255, 0.04)',
    actionButtonBorderMobile: 'rgba(255, 255, 255, 0.08)',
    actionButtonSecondaryBackground: 'rgba(255, 255, 255, 0.08)',
    closeButton: 'rgba(224, 232, 255, 0.6)',
    closeButtonBackground: 'rgba(255, 255, 255, 0.08)',
    connectButtonBackground: '#FFF',
    connectButtonBackgroundError: '#FF494A',
    connectButtonInnerBackground: 'linear-gradient(0deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.15))',
    connectButtonText: '#25292E',
    connectButtonTextError: '#FFF',
    connectionIndicator: '#30E000',
    downloadBottomCardBackground: 'linear-gradient(126deg, rgba(255, 255, 255, 0.2) 9.49%, rgba(171, 171, 171, 0.04) 71.04%), #1A1B1F',
    downloadTopCardBackground: 'linear-gradient(126deg, rgba(171, 171, 171, 0.2) 9.49%, rgba(255, 255, 255, 0.04) 71.04%), #1A1B1F',
    error: '#FF494A',
    generalBorder: 'rgba(255, 255, 255, 0.08)',
    generalBorderDim: 'rgba(255, 255, 255, 0.04)',
    menuItemBackground: 'rgba(224, 232, 255, 0.1)',
    modalBackdrop: 'rgba(0, 0, 0, 0.5)',
    modalBackground: '#1A1B1F',
    modalBorder: 'rgba(255, 255, 255, 0.08)',
    modalText: '#FFF',
    modalTextDim: 'rgba(224, 232, 255, 0.3)',
    modalTextSecondary: 'rgba(255, 255, 255, 0.6)',
    profileAction: 'rgba(224, 232, 255, 0.1)',
    profileActionHover: 'rgba(224, 232, 255, 0.2)',
    profileForeground: 'rgba(224, 232, 255, 0.05)',
    selectedOptionBorder: 'rgba(224, 232, 255, 0.1)',
    standby: '#FFD641',
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  },
  radii: {
    actionButton: '12px',
    connectButton: '12px',
    menuButton: '12px',
    modal: '16px',
    modalMobile: '16px',
  },
  shadows: {
    connectButton: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    dialog: '0px 8px 32px rgba(0, 0, 0, 0.32)',
    profileDetailsAction: '0px 2px 6px rgba(37, 41, 46, 0.04)',
    selectedOption: '0px 2px 6px rgba(0, 0, 0, 0.24)',
    selectedWallet: '0px 2px 6px rgba(0, 0, 0, 0.12)',
    walletLogo: '0px 2px 16px rgba(0, 0, 0, 0.16)',
  },
};

// Custom modal styles for centering and responsiveness
export const modalStyles = `
  [data-rk] {
    --rk-modal-z-index: 2147483647;
  }
  
  /* Center the modal overlay */
  [data-rk] > div[role="dialog"] {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 2147483647 !important;
    backdrop-filter: blur(4px) !important;
    background: rgba(0, 0, 0, 0.5) !important;
  }
  
  /* Modal content styling */
  [data-rk] > div[role="dialog"] > div {
    position: relative !important;
    max-width: 90vw !important;
    max-height: 90vh !important;
    width: auto !important;
    height: auto !important;
    margin: 0 !important;
    transform: none !important;
    top: auto !important;
    left: auto !important;
    border-radius: 16px !important;
    overflow: hidden !important;
    box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.32) !important;
  }
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    [data-rk] > div[role="dialog"] > div {
      max-width: 95vw !important;
      max-height: 85vh !important;
      border-radius: 12px !important;
    }
  }
  
  /* Small mobile optimizations */
  @media (max-width: 480px) {
    [data-rk] > div[role="dialog"] > div {
      max-width: 98vw !important;
      max-height: 80vh !important;
      border-radius: 8px !important;
    }
  }
  
  /* Tablet optimizations */
  @media (min-width: 769px) and (max-width: 1024px) {
    [data-rk] > div[role="dialog"] > div {
      max-width: 80vw !important;
      max-height: 80vh !important;
    }
  }
  
  /* Desktop optimizations */
  @media (min-width: 1025px) {
    [data-rk] > div[role="dialog"] > div {
      max-width: 420px !important;
      max-height: 70vh !important;
    }
  }
`;
