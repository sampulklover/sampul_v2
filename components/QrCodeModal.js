import Link from 'next/link';
import { useRouter } from 'next/router';
import QRCode from 'react-qr-code';

const QrCodeModal = ({ cardRef, qrValue }) => {
  const router = useRouter();
  return (
    <div class="modal fade" id="qr-code-modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Your Wasiat/will QR code</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="text-center">
              <div ref={cardRef}>
                {qrValue !== null && (
                  <QRCode
                    title="Sampul"
                    value={qrValue}
                    bgColor={'#FFFFFF'}
                    fgColor={'#000000'}
                    size={400}
                  />
                )}
              </div>
              <p class="mt-3">
                Here's the QR code that links to your wasiat/will, you can
                access it by scanning this code or by{' '}
                <span
                  class="text-primary pointer-on-hover"
                  onClick={() => {
                    $('#qr-code-modal')?.modal('hide');
                    router.push('/will');
                  }}
                >
                  clicking here.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodeModal;

// The summary of this page includes:
// This page generates a QR code for a "Wasiat" or will document.
// When activated, it displays a modal window centered on the screen.
// The modal includes a QR code that, when scanned, links to the specific will.
// Users can also access the will by clicking a provided link within the modal,
// which redirects them to the '/will' page.
