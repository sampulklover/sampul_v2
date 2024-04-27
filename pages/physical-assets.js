import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import SideBar from '../components/SideBar';

const DigitalAssets = () => {
  const title = () => {
    return (
      <>
        <div class="row text-md-start text-center">
          <div class="col-lg">
            <div class="smpl_display-sm-semibold">Physical Assets</div>
            <div class="smpl_text-md-regular">
              Overview of secured assets in your Sampul
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
          <Breadcrumb pageName={'Physical Assets'} />
          <div class="mt-4">{title()}</div>
          {comingSoonSection()}
          <Footer />
        </div>
      </div>
    </SideBar>
  );
};

export default DigitalAssets;
