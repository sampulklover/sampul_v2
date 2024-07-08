import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import translations from '../constant/translations';
import { useLocale } from '../context/locale';

const DigitalAssets = () => {
  const { locale } = useLocale();
  const title = () => {
    return (
      <>
        <div class="row text-md-start text-center">
          <div class="col-lg">
            <div class="smpl_display-sm-semibold">
              {translations[locale].physical_assets.physical_assets}
            </div>
            <div class="smpl_text-md-regular">
              {translations[locale].physical_assets.overview_of_secured_}
            </div>
          </div>
        </div>
        <div class="border-top my-3"></div>
      </>
    );
  };

  const comingSoonSection = () => {
    return (
      <>
        <img width="100%" src="images/coming-soon-bg.png"></img>
      </>
    );
  };

  return (
    <SideBar>
      <div class="body inner-body">
        <div class="content">
          <Breadcrumb
            pageName={translations[locale].physical_assets.physical_assets}
          />
          <div class="mt-4">{title()}</div>
          {comingSoonSection()}
          <Footer />
        </div>
      </div>
    </SideBar>
  );
};

export default DigitalAssets;

// The summary of this page includes:
// The main content section for this page is to showcases a "coming soon" image,
// suggesting that further details or functionality related to physical assets
// will be available in the future.
