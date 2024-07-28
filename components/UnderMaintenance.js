// Note: change text [billing system] according to your current page

import translations from '../constant/translations';
import { useLocale } from '../context/locale';

const UnderMaintenance = () => {
  const { locale } = useLocale();

  return (
    <div class="mt-4 text-center">
      <div class="text-and-supporting-text-32">
        <i class="bi bi-tools h1"></i>
        <div class="text-lg-semibold-8">
          {translations[locale].component.under_maintenance.under_maintenance}
        </div>
        <div class="text-sm-regular-15">
          {translations[locale].component.under_maintenance.we_are_currently_}{' '}
          <br />
          {translations[locale].component.under_maintenance.please_check_back_}
        </div>
      </div>
    </div>
  );
};

export default UnderMaintenance;

// The summary of this page includes:
// The page is informing visitors that the billing system is undergoing maintenance and is currently unavailable.
// It displays a message stating that maintenance work is being carried out and advises users to return at a later time.
