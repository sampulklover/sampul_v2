import QRCode from 'react-qr-code';

const QrCodeModal = ({ cardRef, qrValue }) => {
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodeModal;
