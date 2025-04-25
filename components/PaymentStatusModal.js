import Image from 'next/image';
import { Modal } from 'react-bootstrap';

const PaymentStatusModal = ({ isOpen, status, onClose }) => {
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Body className="text-center p-5">
        <div className="mb-4">
          <Image
            src={
              status === 'success'
                ? '/images/success-icon-outline.svg'
                : '/images/failed-icon-outline.svg'
            }
            width={80}
            height={80}
            alt={status === 'success' ? 'Success' : 'Failed'}
          />
        </div>
        <h4 className="mb-4">
          {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
        </h4>
        <p className="text-muted">
          {status === 'success'
            ? 'Your payment has been processed successfully.'
            : 'There was an error processing your payment. Please try again.'}
        </p>
        <button className="btn btn-primary mt-3" onClick={onClose}>
          Close
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentStatusModal;
