import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import { formatTimestamp, replaceOrAddImage } from '../utils/helpers';
import Loading from './Laoding';
import TrustPaymentFormModal from './TrustPaymentFormModal';
import TrustPaymentHistoryModal from './TrustPaymentHistoryModal';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';

const TrustTable = ({ typeName, showAll = true }) => {
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const { locale } = useLocale();
  const { contextApiData, deleteTrust, addChipPayment } = useApi();

  const [buttonConfig, setButtonConfig] = useState({
    submit: {
      isLoading: false,
    },
    delete: {
      isLoading: false,
    },
  });

  const [selectedTrust, setSelectedTrust] = useState(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [selectedTrustPayments, setSelectedTrustPayments] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const type = {
    trust: {
      title: translations[locale].trust.no_trust_found,
      subtitle: translations[locale].trust.create_your_first_trust,
      addNewBtnTitle: translations[locale].trust.create_now,
      data: contextApiData.trust.data,
      isReady: !contextApiData.trust.isLoading,
    },
  };

  const deleteTrustFunction = async (item) => {
    if (confirm(translations[locale].global.delete_confirmation)) {
      setButtonConfig({
        ...buttonConfig,
        delete: {
          ...buttonConfig.delete,
          isLoading: true,
        },
      });

      const result = await deleteTrust({
        id: item.id,
      });

      if (result) {
        const directory = `/trust/payment/`;

        await replaceOrAddImage({
          userId: contextApiData.user.data?.id,
          returnData: result.trust_payment,
          directory,
          imageInput: null,
          dataBase: 'trust_payment',
          isUpdateByReturnId: false,
          deleted: true,
        });

        toast.success(translations[locale].global.successfully_deleted);
      }

      setButtonConfig({
        ...buttonConfig,
        delete: {
          ...buttonConfig.delete,
          isLoading: false,
        },
      });
    }
  };

  const initiatePayment = async (amount) => {
    try {
      setButtonConfig((prev) => ({
        ...prev,
        submit: { isLoading: true },
      }));

      const payment = await addChipPayment({
        trustId: selectedTrust.id,
        amount: amount,
        trustCode: selectedTrust.trust_code,
      });

      if (!payment) {
        throw new Error('Payment creation failed');
      }

      if (payment.error) {
        throw new Error(payment.error);
      }

      const checkoutUrl = payment.checkout_url || payment.data?.checkout_url;
      if (!checkoutUrl) {
        throw new Error('No checkout URL received from payment provider');
      }

      // Clear form and redirect
      setShowPaymentForm(false);
      setSelectedTrust(null);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Payment Error:', error);
      toast.error(error.message || 'Payment failed. Please try again later');
    } finally {
      setButtonConfig((prev) => ({
        ...prev,
        submit: { isLoading: false },
      }));
    }
  };

  const viewPaymentHistory = (trust) => {
    setSelectedTrustPayments({
      payments: trust.trust_payments || [],
      trustCode: trust.trust_code,
    });
    setShowPaymentHistory(true);
  };

  const renderPaymentCell = (item) => (
    <div className="custom-table-cell">
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setSelectedTrust(item);
            setShowPaymentForm(true);
          }}
        >
          Make Payment
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => viewPaymentHistory(item)}
        >
          History
        </button>
      </div>
    </div>
  );

  if (type[typeName].isReady) {
    if (type[typeName].data?.length > 0 && type[typeName].isReady) {
      return (
        <>
          <div class="table-responsive" style={{ width: '100%' }}>
            <span class="heading-04">
              {translations[locale].trust.recent_trust_list}
            </span>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">
                    <small class="smpl_text-xs-medium">ID</small>
                  </th>
                  <th scope="col">
                    <small class="smpl_text-xs-medium">
                      {translations[locale].trust.created_at}
                    </small>
                  </th>
                  <th scope="col">
                    <small class="smpl_text-xs-medium">
                      {translations[locale].trust.status}
                    </small>
                  </th>
                  <th scope="col">
                    <small class="smpl_text-xs-medium">
                      {translations[locale].trust.action}
                    </small>
                  </th>
                  <th scope="col">
                    <small class="smpl_text-xs-medium">Payment</small>
                  </th>
                </tr>
              </thead>
              <tbody>
                {type[typeName].data
                  .slice(0, showAll ? type[typeName].data.length : 5)
                  .map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div class="custom-table-cell">
                            <p class="text-sm-regular-7 crop-text">
                              {item?.trust_code}
                            </p>
                          </div>
                        </td>
                        <td>
                          <div class="custom-table-cell">
                            <div class="text-sm-regular-7 crop-text">
                              {formatTimestamp(item?.created_at)}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="custom-table-cell">
                            <div class="badge-instructions w-inline-block">
                              <span class="text-xs-medium crop-text">
                                {translations[locale].trust.pending}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="custom-table-cell">
                            <div
                              class="text-sm-regular-8 crop-text text-primary pointer-on-hover"
                              onClick={() => {
                                toggleModal('trust');
                                setValueTempData('trust', {
                                  ...tempData.trust,
                                  key: 'edit',
                                  selectedItem: item,
                                });
                              }}
                            >
                              {translations[locale].trust.edit}
                            </div>
                            <div
                              class="text-sm-regular-8 crop-text text-primary pointer-on-hover"
                              onClick={() => {
                                deleteTrustFunction(item);
                              }}
                            >
                              {translations[locale].trust.delete}
                            </div>
                          </div>
                        </td>
                        <td>{renderPaymentCell(item)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <TrustPaymentFormModal
            isOpen={showPaymentForm}
            onClose={() => setShowPaymentForm(false)}
            onSubmit={initiatePayment}
            trust={selectedTrust}
            isLoading={buttonConfig.submit.isLoading}
          />

          <TrustPaymentHistoryModal
            isOpen={showPaymentHistory}
            onClose={() => setShowPaymentHistory(false)}
            payments={selectedTrustPayments?.payments}
            trustCode={selectedTrustPayments?.trustCode}
          />
        </>
      );
    }

    return (
      <>
        <div class="empty-data-card p-5">
          <div class="content-67">
            <div class="smpl-icon-featured-outline-large">
              <div class="icon-featured-medium w-embed">
                <svg
                  width="66"
                  height="66"
                  viewBox="0 0 66 66"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="5"
                    y="5"
                    width="56"
                    height="56"
                    rx="28"
                    fill="#F4EBFF"
                  ></rect>
                  <path
                    d="M43.5 43.5L39.4168 39.4167M42.3333 32.4167C42.3333 37.8935 37.8935 42.3333 32.4167 42.3333C26.9398 42.3333 22.5 37.8935 22.5 32.4167C22.5 26.9398 26.9398 22.5 32.4167 22.5C37.8935 22.5 42.3333 26.9398 42.3333 32.4167Z"
                    stroke="#3118D3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <rect
                    x="5"
                    y="5"
                    width="56"
                    height="56"
                    rx="28"
                    stroke="#DDD8FB"
                    strokeWidth="10"
                  ></rect>
                </svg>
              </div>
            </div>
            <div class="text-and-supporting-text-32">
              <div class="text-lg-semibold-8">{type[typeName].title}</div>
              <div class="text-sm-regular-15">{type[typeName].subtitle}</div>
            </div>
          </div>
          <div class="mt-3">
            <button
              type="button"
              class="btn btn-primary btn-text"
              onClick={() => {
                toggleModal('trust');
              }}
            >
              <div class="d-flex">
                <Image
                  src={'images/plus.svg'}
                  alt="image"
                  width={24}
                  height={24}
                />
                <span class="ms-2">
                  {translations[locale].trust.create_new_trust}
                </span>
              </div>
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <div style={{ width: '100%' }} class="d-flex justify-content-center pb-4">
      <Loading loading={true} />
    </div>
  );
};

export default TrustTable;
