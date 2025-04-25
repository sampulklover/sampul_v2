import Image from 'next/image';
import { useState } from 'react';
import { Modal, ProgressBar } from 'react-bootstrap';

// Convert constants to cents
const MAX_TRANSACTION_AMOUNT = 3000000; // RM30,000 in cents
const MIN_TRUST_AMOUNT = 10000000; // RM100,000 in cents

const TrustPaymentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  trust,
  isLoading,
}) => {
  const [amountInCents, setAmountInCents] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');
  const [error, setError] = useState('');

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value === '' || /^\d+$/.test(value)) {
      // Store actual amount in cents (integer)
      setAmountInCents(value);

      // Format for display only (RM XX.XX)
      const displayAmount = value ? (parseInt(value) / 100).toFixed(2) : '';
      setFormattedAmount(displayAmount);

      // Validate amount limits (convert cents to RM for comparison)
      if (parseInt(value) > MAX_TRANSACTION_AMOUNT) {
        setError(
          `Maximum transaction amount is RM ${(
            MAX_TRANSACTION_AMOUNT / 100
          ).toLocaleString()}`
        );
      } else {
        setError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amountInCents || parseInt(amountInCents) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const cents = parseInt(amountInCents);
    if (cents > MAX_TRANSACTION_AMOUNT) {
      setError(
        `Maximum transaction amount is RM ${(
          MAX_TRANSACTION_AMOUNT / 100
        ).toLocaleString()}`
      );
      return;
    }

    // Pass the amount in cents to the payment provider
    onSubmit(cents);
    setAmountInCents('');
    setFormattedAmount('');
  };

  // Calculate total paid in cents
  const totalPaidInCents =
    trust?.trust_payments
      ?.filter((p) => ['paid', 'settled', 'cleared'].includes(p.status))
      .reduce((sum, payment) => sum + parseInt(payment.amount), 0) || 0;

  const remainingTrustInCents = MIN_TRUST_AMOUNT - totalPaidInCents;
  const progressPercentage = (totalPaidInCents / MIN_TRUST_AMOUNT) * 100;

  // Format currency with commas and 2 decimal places
  const formatRinggit = (cents) => {
    const amount = (cents / 100).toFixed(2);
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered size="md">
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title>Trust Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        {/* Trust Progress Section */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Trust Progress</h6>
            <span className="badge bg-primary text-white">
              Trust ID: {trust?.trust_code}
            </span>
          </div>
          <ProgressBar now={progressPercentage} className="mb-2" />
          <div className="d-flex justify-content-between">
            <small className="text-muted">
              Paid: RM {formatRinggit(totalPaidInCents)}
            </small>
            <small className="text-muted">
              Min Target: RM {formatRinggit(MIN_TRUST_AMOUNT)}
            </small>
          </div>
        </div>

        {/* Payment Limits Info */}
        <div className="alert alert-info d-flex align-items-start mb-4">
          <Image
            src="/images/info-icon.svg"
            width={16}
            height={16}
            className="me-2 mt-1"
          />
          <div>
            <div className="fw-semibold mb-1">Payment Limits</div>
            <ul className="mb-0 ps-3">
              <li>
                <small>
                  Minimum trust amount: RM {formatRinggit(MIN_TRUST_AMOUNT)}
                </small>
              </li>
              <li>
                <small>
                  Maximum per transaction: RM{' '}
                  {formatRinggit(MAX_TRANSACTION_AMOUNT)}
                </small>
              </li>
              {remainingTrustInCents > MAX_TRANSACTION_AMOUNT && (
                <li>
                  <small className="fw-semibold">
                    You will need multiple payments to complete the minimum
                    trust amount
                  </small>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-semibold">Payment Amount</label>
            <div className="input-group input-group-lg">
              <span className="input-group-text">RM</span>
              <input
                type="text"
                className={`form-control form-control-lg ${
                  error ? 'is-invalid' : ''
                }`}
                value={formattedAmount}
                onChange={handleAmountChange}
                placeholder="0.00"
                required
                disabled={isLoading}
              />
              {error && <div className="invalid-feedback">{error}</div>}
            </div>
            {remainingTrustInCents > 0 && (
              <div className="form-text">
                Remaining trust amount: RM{' '}
                {formatRinggit(remainingTrustInCents)}
              </div>
            )}
          </div>

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isLoading || !amountInCents}
            >
              {isLoading ? (
                <span className="d-flex align-items-center justify-content-center">
                  <span className="spinner-border spinner-border-sm me-2" />
                  Processing...
                </span>
              ) : (
                'Continue to Payment'
              )}
            </button>
            <button
              type="button"
              className="btn btn-link text-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default TrustPaymentFormModal;
