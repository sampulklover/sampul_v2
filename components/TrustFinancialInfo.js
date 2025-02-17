import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

const TrustFinancialInfo = ({
  onSubmitToggle = false,
  onSuccess = () => {},
}) => {
  const [clearingObligations, setClearingObligations] = useState(false);
  const [moneyMarketInvestment, setMoneyMarketInvestment] = useState(false);
  const [unitTrustInvestment, setUnitTrustInvestment] = useState(false);

  const onSubmitForm = async () => {
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  const formRef = useRef(null);

  const submitFormProgrammatically = () => {
    formRef.current?.requestSubmit();
  };

  useEffect(() => {
    if (onSubmitToggle) {
      submitFormProgrammatically();
    }
  }, [onSubmitToggle]);

  // Styles for the clickable cards
  const cardStyle = {
    maxWidth: '400px',
    cursor: 'pointer', // Change cursor to indicate clickability
  };

  return (
    <div>
      <span
        onClick={() => {
          submitFormProgrammatically();
        }}
      ></span>
      <form
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitForm();
        }}
      >
        <div className="d-flex justify-content-center align-items-center">
          <div>
            <div class="text-center">
              <label class="uui-field-label h4">
                Clearing my financial obligations
              </label>
              <p class="text-muted mb-3">Please use the Trust Fund to:</p>
            </div>

            <div
              className="card mx-auto"
              style={cardStyle}
              onClick={() => setClearingObligations((prev) => !prev)} // Toggle on card click
            >
              <div class="d-flex align-items-start">
                <div class="me-2">
                  <Image
                    src={'images/pyramid-made-figures.svg'}
                    alt="image"
                    width={100}
                    height={100}
                  />
                </div>
                <div class="flex-grow-1">
                  <p class="mb-0">
                    Settle all my debts, liabilities, legal fees, executor fees,
                    and any administrative costs.
                  </p>
                </div>
                <div class="ms-3">
                  <input
                    type="checkbox"
                    checked={clearingObligations}
                    class="form-check-input"
                    onChange={(e) => setClearingObligations(e.target.checked)}
                  />
                </div>
              </div>
            </div>

            <div class="text-center">
              <label class="uui-field-label h4 mt-4">
                Investing the Trust Fund
              </label>
              <p class="text-muted mb-3">
                When I’m no longer here, I’d like the trust fund to grow:
              </p>
            </div>

            {/* Wrap the radio button cards in a responsive flex container */}
            <div class="d-flex flex-column flex-md-row justify-content-center gap-3">
              <div
                className="card flex-fill"
                style={cardStyle}
                onClick={() => setMoneyMarketInvestment((prev) => !prev)} // Toggle on card click
              >
                <div class="d-flex align-items-start">
                  <div class="me-2">
                    <Image
                      src={'images/isometric-view-table-and papers.svg'}
                      alt="image"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div class="flex-grow-1">
                    <p class="mb-0">
                      Invest in money market instruments with licensed financial
                      institutions in Malaysia.
                    </p>
                  </div>
                  <div class="ms-3">
                    <input
                      type="checkbox"
                      name="investment"
                      class="form-check-input"
                      checked={moneyMarketInvestment}
                      onChange={(e) =>
                        setMoneyMarketInvestment(e.target.checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div
                className="card flex-fill"
                style={cardStyle}
                onClick={() => setUnitTrustInvestment((prev) => !prev)} // Toggle on card click
              >
                <div class="d-flex align-items-start">
                  <div class="me-2">
                    <Image
                      src={'images/pyramid-made-figures.svg'}
                      alt="image"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div class="flex-grow-1">
                    <p class="mb-0">
                      Invest in Unit Trust/Mutual Funds with licensed fund
                      management companies, as recommended by the Management
                      Committee.
                    </p>
                  </div>
                  <div class="ms-3">
                    <input
                      type="checkbox"
                      name="investment"
                      class="form-check-input"
                      checked={unitTrustInvestment}
                      onChange={(e) => setUnitTrustInvestment(e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TrustFinancialInfo;
