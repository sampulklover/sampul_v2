import { useApi } from '../context/api';

const TrustSummaryCard = () => {
  const { contextApiData } = useApi();

  let totalDonation = 0;
  let totalLivingExpenses = 0;
  let totalTrustAmount = 0;

  contextApiData.trust.data.forEach((trust) => {
    if (Array.isArray(trust.trust_charity)) {
      trust.trust_charity.forEach((charity) => {
        if (charity.donation_amount) {
          totalDonation += charity.donation_amount;
        }
      });
    }
  });

  contextApiData.trust.data.forEach((trust) => {
    if (Array.isArray(trust.trust_beneficiary)) {
      trust.trust_beneficiary.forEach((charity) => {
        if (charity.monthly_distribution_living) {
          totalLivingExpenses += charity.monthly_distribution_living;
        }
      });
    }
  });

  contextApiData.trust.data.forEach((trust) => {
    if (trust.trust_payment) {
      if (trust.trust_payment.trust_amount > 0) {
        totalTrustAmount += trust.trust_payment.trust_amount;
      }
    }
  });

  const formatePrice = (value) => {
    const formattedTotalTrustAmount = value.toLocaleString('en-MY', {
      // Use 'en-US' for US formatting
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return `RM ${formattedTotalTrustAmount}`;
  };

  const mainConfig = {
    total_assets: {
      title: 'Total Trust',
      value: contextApiData.trust.data.length,
    },
    total_living_expension: {
      title: 'Total Living Expenses',
      value: formatePrice(totalLivingExpenses),
    },
    beneficiaries: {
      title: 'Total Donation',
      value: formatePrice(totalDonation),
    },
    instructions: {
      title: 'Trust Amount',
      value: formatePrice(totalTrustAmount),
    },
  };

  return (
    <>
      {Object.entries(mainConfig).map(([key, item], index) => (
        <div key={index} class="col" onClick={() => {}}>
          <div>
            <div class="card card-hover">
              <div class="row">
                <strong>{item.title}</strong>
                <span class="heading-02">{item.value}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TrustSummaryCard;
