import translations from '../constant/translations';
import { useLocale } from '../context/locale';
import { formatTimestamp } from '../utils/helpers';
import Image from 'next/image';
import { Modal } from 'react-bootstrap';

const getStatusDisplay = (status) => {
  switch (status) {
    case 'paid':
    case 'settled':
    case 'cleared':
      return { label: 'Paid', class: 'bg-success text-white' };
    case 'refunded':
    case 'chargeback':
      return { label: 'Refunded', class: 'bg-info text-white' };
    case 'failed':
    case 'error':
    case 'expired':
    case 'cancelled':
      return { label: 'Failed', class: 'bg-danger text-white' };
    case 'pending_charge':
    case 'pending_execute':
    case 'pending_capture':
    case 'pending_release':
    case 'pending_refund':
    case 'preauthorized':
      return { label: 'Processing', class: 'bg-warning text-dark' };
    default:
      return null;
  }
};

const TrustPaymentHistoryModal = ({
  isOpen,
  onClose,
  payments,
  trustCode,
  isLoading,
}) => {
  const { locale } = useLocale();

  const MIN_TRUST_AMOUNT = 10000000; // RM100,000 in cents

  // Helper function to format currency with commas
  const formatRinggit = (cents) => {
    const amount = (cents / 100).toFixed(2);
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Calculate total paid in cents
  const totalPaidInCents =
    payments
      ?.filter((p) => ['paid', 'settled', 'cleared'].includes(p.status))
      .reduce((sum, payment) => sum + parseInt(payment.amount), 0) || 0;

  const remainingTrustInCents = MIN_TRUST_AMOUNT - totalPaidInCents;

  return (
    <Modal show={isOpen} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-bottom">
        <div>
          <Modal.Title className="mb-1">Payment History</Modal.Title>
          <div className="text-muted small">Trust ID: {trustCode}</div>
        </div>
      </Modal.Header>
      <Modal.Body className="p-0">
        {!isLoading && payments && payments.length > 0 && (
          <div className="px-4 py-3 bg-light border-bottom">
            <div className="row align-items-center">
              <div className="col">
                <div className="small text-muted mb-1">Total Paid</div>
                <h4 className="mb-0">RM {formatRinggit(totalPaidInCents)}</h4>
              </div>
              {remainingTrustInCents > 0 && (
                <div className="col-auto text-end">
                  <div className="small text-muted mb-1">Remaining</div>
                  <div className="text-primary fw-bold">
                    RM {formatRinggit(remainingTrustInCents)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-4">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : payments && payments.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Date & Time</th>
                    <th className="text-end">Amount</th>
                    {/* <th>Payment Method</th> */}
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments
                    .filter((payment) => getStatusDisplay(payment.status))
                    .sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    ) // Sort by date descending
                    .map((payment, index) => {
                      const status = getStatusDisplay(payment.status);
                      return (
                        <tr key={index} className="align-middle">
                          <td className="text-nowrap">
                            {formatTimestamp(payment.created_at)}
                          </td>
                          <td className="text-end fw-semibold">
                            RM {formatRinggit(parseInt(payment.amount))}
                          </td>
                          {/* <td>{payment.payment_method || '-'}</td> */}
                          <td>
                            <span
                              className={`badge rounded-pill d-inline-block ${status.class}`}
                            >
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <Image
                src="/images/credit-card-icon.svg"
                width={48}
                height={48}
                className="mb-3 opacity-50"
              />
              <h6>No Payment Records</h6>
              <p className="text-muted small mb-0">
                No payment transactions have been made yet
              </p>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TrustPaymentHistoryModal;
