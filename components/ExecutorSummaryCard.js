import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';

const ExecutorSummaryCard = () => {
  const { contextApiData } = useApi();
  const { locale } = useLocale();

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
      title: translations[locale].executor.summary.total_executor,
      value: contextApiData.executor.data.length,
    },
    // Other summary cards can be added here as needed
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

export default ExecutorSummaryCard;
