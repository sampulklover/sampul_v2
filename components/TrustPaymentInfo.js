import { addUserImg } from '../constant/element';
import { paymentMethods } from '../constant/enum';
import { useApi } from '../context/api';
import { useTempData } from '../context/tempData';
import {
  mapViewElements,
  removeEmptyKeyValue,
  renderField,
  replaceOrAddImage,
} from '../utils/helpers';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const TrustPaymentInfo = ({ onSubmitToggle = false, nextStep }) => {
  const { contextApiData, addTrustPayment } = useApi();
  const { tempData } = useTempData();
  const formRef = useRef(null);
  const receiptImageRef = useRef(null); // Ref for the receipt image input
  const [trustData, setTrustData] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentMethodError, setPaymentMethodError] = useState('');
  const [receiptError, setReceiptError] = useState('');
  const [selectedImage, setSelectedImage] = useState({
    data: null,
    url: '',
  });
  const MIN_TRUST_AMOUNT = 100000;

  // State variables for calculated amounts
  const [trustAmount, setTrustAmount] = useState(0);
  const [trustAccountFee, setTrustAccountFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Bank transfer details (replace with your actual details)
  const bankTransferDetails = {
    bankName: process.env.NEXT_PUBLIC_TRUST_BANK_NAME,
    accountName: process.env.NEXT_PUBLIC_TRUST_BANK_ACCOUNT_NAME,
    accountNumber: process.env.NEXT_PUBLIC_TRUST_BANK_ACCOUNT_NUMBER,
  };

  useEffect(() => {
    if (contextApiData.trust?.data?.length > 0) {
      const foundTrust = contextApiData.trust.data.find(
        (trust) => trust.id === tempData.trust.selectedItem?.id
      );
      if (foundTrust) {
        setTrustData(foundTrust);
        mapViewElements({
          source: foundTrust.trust_payment,
          target: elementList().profile.elements,
          viewOnly: false,
        });

        if (foundTrust.trust_payment?.trust_amount) {
          const value = parseFloat(foundTrust.trust_payment.trust_amount);
          setTrustAmount(isNaN(value) ? 0 : value);
        }

        if (foundTrust.trust_payment?.image_path) {
          const receiptImage = `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${foundTrust.trust_payment?.image_path}`;
        }
      }
    }
  }, [contextApiData.trust?.data, tempData.trust.selectedItem?.id]);

  const elementList = () => ({
    profile: {
      elements: {
        trust_amount: document.getElementById('input-trust-amount'),
      },
    },
  });

  // Function to calculate fees
  const calculateFees = (amount) => {
    const accountFee = amount * 0.015;
    const total = amount + accountFee;
    return { accountFee, total };
  };

  useEffect(() => {
    const { accountFee, total } = calculateFees(trustAmount);
    setTrustAccountFee(accountFee);
    setTotalAmount(total);
  }, [trustAmount]);

  const onSubmitForm = async (event) => {
    event.preventDefault();
    const elements = elementList().profile.elements;
    const formData = removeEmptyKeyValue(elements);
    const trustAmountInput = document.getElementById('input-trust-amount');
    const trustAmountValue = parseInt(trustAmountInput.value, 10); //Get raw Value

    if (!selectedPaymentMethod) {
      setPaymentMethodError('Please select a payment method.');
      return;
    } else {
      setPaymentMethodError('');
    }

    if (trustAmountValue < MIN_TRUST_AMOUNT) {
      trustAmountInput.setCustomValidity(
        `Minimum trust amount is RM ${MIN_TRUST_AMOUNT.toLocaleString()}`
      );
      trustAmountInput.reportValidity();
      return;
    } else {
      trustAmountInput.setCustomValidity(''); // Clear the custom validation message
    }

    if (selectedPaymentMethod === 'bank_transfer' && !selectedImage.data) {
      setReceiptError('Please upload a receipt image.');
      return;
    } else {
      setReceiptError('');
    }

    if (trustData?.id) {
      const result = await addTrustPayment({
        data: {
          payment_method: selectedPaymentMethod,
          total_amount: totalAmount, // Use the calculated totalAmount
          trust_id: trustData?.id,
          trust_amount: formData.trust_amount,
        },
        otherData: {
          trust_payment_id: trustData?.trust_payment?.id,
        },
      });

      const directory = `/trust/payment/`;
      const imageInput = document.getElementById('input-my-details-image');

      await replaceOrAddImage({
        userId: contextApiData.user.data?.id,
        returnData: result,
        directory,
        imageInput,
        dataBase: 'trust_payment',
        isUpdateByReturnId: true,
      });

      toast.success('Saved!');
      nextStep();
    }
  };

  useEffect(() => {
    if (onSubmitToggle) {
      formRef.current?.requestSubmit();
    }
  }, [onSubmitToggle]);

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.id);
    setPaymentMethodError('');
    // Clear receipt when payment method changes (optional)
    setSelectedImage({
      data: null,
      url: '',
    });
    setReceiptError('');

    // Scroll to the receipt upload form when Bank Transfer is selected
    if (event.target.id === 'bank_transfer' && receiptImageRef.current) {
      receiptImageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleTrustAmountChange = (event) => {
    const value = parseFloat(event.target.value);
    setTrustAmount(isNaN(value) ? 0 : value); // Update state, handle NaN
  };

  return (
    <form ref={formRef} onSubmit={onSubmitForm} className="mt-3">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Fee Breakdown</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between">
              <div>
                <strong>Trust Amount</strong>
                <p className="text-muted mb-0">
                  Please enter trust amount (minimum RM 100,000)
                </p>
              </div>
              <span>
                <div class="input-group">
                  <div class="input-group-text">RM</div>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="form-control"
                    id="input-trust-amount"
                    required
                    min={MIN_TRUST_AMOUNT}
                    onChange={handleTrustAmountChange} // Track changes
                  />
                </div>
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <div>
                <strong>Trust Account</strong>
                <p className="text-muted mb-0">1.5% annual management free</p>
              </div>
              <span>
                RM{' '}
                {trustAccountFee.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <div>
                <strong>Total Amount</strong>
                <p className="text-muted mb-0">(Including all fees)</p>
              </div>
              <span className="fw-bold">
                RM{' '}
                {totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </li>
          </ul>

          <h5 className="mt-4">Select Payment Method</h5>
          <div className="d-flex flex-wrap gap-3 mt-3">
            {paymentMethods().map((method) => (
              <div
                className="col-6 col-sm-4 col-md-3 col-lg-3 p-1" // Adjusted column sizing and padding
                key={method.value}
              >
                <label
                  className="card h-100" // Added h-100
                  style={{
                    cursor: 'pointer',
                    position: 'relative',
                    opacity: !method.enable ? 0.5 : 1,
                    pointerEvents: !method.enable ? 'none' : 'auto',
                    // height: '100px', // Fixed height
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id={method.value}
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                    }}
                    disabled={!method.enable}
                    checked={selectedPaymentMethod === method.value}
                    onChange={handlePaymentMethodChange}
                    required
                  />
                  <div className="card-body d-flex flex-column justify-content-center align-items-center p-2">
                    {' '}
                    {/* Adjusted padding, centered content */}
                    <strong className="text-center">{method.name}</strong>{' '}
                    {/* Center the text */}
                    <p className="text-muted text-center mb-0">
                      {method.sublabel}
                    </p>{' '}
                    {/* Center the text, removed margin bottom*/}
                  </div>
                </label>
              </div>
            ))}
          </div>

          {paymentMethodError && (
            <div className="alert alert-danger mt-3">{paymentMethodError}</div>
          )}

          {/* Conditionally render Bank Transfer details */}
          {selectedPaymentMethod === 'bank_transfer' && (
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">Bank Transfer Details</h5>
                <p>Please transfer the funds to the following bank account:</p>
                <ul className="list-unstyled">
                  <li>
                    <strong>Bank Name:</strong> {bankTransferDetails.bankName}
                  </li>
                  <li>
                    <strong>Account Name:</strong>{' '}
                    {bankTransferDetails.accountName}
                  </li>
                  <li>
                    <strong>Account Number:</strong>{' '}
                    {bankTransferDetails.accountNumber}
                  </li>
                </ul>
                <div className="mb-3" ref={receiptImageRef}>
                  <label htmlFor="receiptImage" className="form-label">
                    Upload Proof of Payment
                  </label>
                  <input
                    className="form-control mb-3"
                    type="file"
                    id="input-my-details-image"
                    name=""
                    accept="image/*"
                    required={selectedPaymentMethod === 'bank_transfer'}
                    onChange={(event) => {
                      try {
                        let imageURL = URL.createObjectURL(
                          event.target.files[0]
                        );
                        if (imageURL) {
                          setSelectedImage({
                            data: event.target.files[0],
                            url: imageURL,
                          });
                        }
                      } catch {
                        console.log('Cancelled');
                      }
                    }}
                  />
                  <img
                    class="img-thumbnail"
                    loading="lazy"
                    src={selectedImage.url}
                    alt=""
                    id="preview-my-details-image"
                    onClick={() => {
                      document.getElementById('input-my-details-image').click();
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default TrustPaymentInfo;
