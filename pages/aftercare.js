import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';
import InnerHeader from '../components/InnerHeader';
import Loading from '../components/Laoding';
import SideBar from '../components/SideBar';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { getOptionLabelWithIcon } from '../utils/helpers';
import { supabase } from '../utils/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';

const Aftercare = () => {
  const { contextApiData } = useApi();
  const { locale } = useLocale();
  const router = useRouter();

  const careType = [
    { title: translations[locale].care.avoid_common_mistakes },
    { title: translations[locale].care.listens_without_judgement },
    { title: translations[locale].care.confidential },
    { title: translations[locale].care.friendly_casual_support },
    { title: translations[locale].care.learn_from_their_ },
    { title: translations[locale].care.follow_ups_available },
  ];

  const checkRestriction = (keyName) => {
    const access =
      contextApiData.account.data?.products?.access_control?.pages?.care[
        keyName
      ]?.access;
    return access;
  };

  const careUser = [
    {
      name: translations[locale].care.arham_merican_estate_,
      imageUrl: 'images/avatar-arham.png',
      bio: translations[locale].care.registered_shariah_advisor_,
      onClick: () => {
        if (checkRestriction('appointment')) {
          window.open(
            'https://cal.com/sampul/sampul-estate-planning-consultant-by-arham-merican',
            '_blank'
          );
        } else {
          toast.error(translations[locale].extra_wishes.you_need_to_);
        }
      },
    },
    // {
    //   name: translations[locale].care.najiya_ilya_grief,
    //   imageUrl: 'images/avatar-najiya.png',
    //   bio: translations[locale].care.bsc_psychology_cardiff_,
    //   onClick: () => {
    //     window.open(
    //       'https://cal.com/sampul/sampul-grief-and-loss-therapist',
    //       '_blank'
    //     );
    //   },
    // },
    // {
    //   name:  translations[locale].care.fatiha_shuib_grief,
    //   imageUrl: 'images/avatar-fatiha.png',
    //   bio: translations[locale].care.ba_islamic_jurisprudence_,
    //   onClick: () => {
    //     window.open(
    //       'https://cal.com/sampul/sampul-grief-and-loss-therapist',
    //       '_blank'
    //     );
    //   },
    // },
  ];

  const cardContent = () => {
    return (
      <>
        <div class="settings_component-copy">
          <div class="col">
            <div>
              <div>
                <span class="heading-02">
                  {translations[locale].care.our_care_team}
                </span>
              </div>
              <div class="paragraph-01">
                <p>{translations[locale].care.you_must_have_}</p>
                <p>{translations[locale].care.lets_start_meaningful_}</p>
                <p>{translations[locale].care.connect_with_our_}</p>
                <ul>
                  {careType.map((item, index) => {
                    return (
                      <li class="d-flex  align-items-center mb-2" key={index}>
                        <Image
                          src="images/check_icon_purple.svg"
                          alt="image"
                          width={0}
                          height={0}
                          sizes="100vw"
                          style={{ width: '5%', height: '5%' }}
                          class="me-2"
                        />
                        <span class="paragraph-02">{item.title}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div class="col-lg col-sm-12">
            {careUser.map((item, index) => {
              return (
                <div
                  class="mt-lg-0 mt-2 card mb-3"
                  style={{ width: '100%' }}
                  key={index}
                >
                  <div class="mb-3">
                    <div>
                      <img
                        src={item.imageUrl}
                        alt=""
                        width="20%"
                        height="20%"
                        class="rounded-circle mb-3"
                      />
                    </div>
                    <span class="heading-04">{item.name}</span>
                    <p class="paragraph-02">{item.bio}</p>
                  </div>
                  <div>
                    <button
                      type="button"
                      class="btn btn-primary btn-text"
                      onClick={item.onClick}
                    >
                      <Loading
                        title={translations[locale].care.book_appointment}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  return (
    <SideBar>
      <div class="body-01 default-background-color">
        <div class="inner-body-01" style={{ paddingBottom: 0 }}>
          <Breadcrumb pageName={translations[locale].care.care} />
          <InnerHeader
            title={translations[locale].care.get_help_when_}
            subtitle={translations[locale].care.healing_takes_hard_}
            imageSrc="images/being-at-peace.svg"
          />
        </div>
        <Image
          src="images/care-marketing-banner.svg"
          alt="image"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: '100%' }}
          class="me-2"
        />
        <div class="content inner-body-01" style={{ paddingTop: 0 }}>
          <div class="row mt-4">{cardContent()}</div>
        </div>
        <Footer />
      </div>
    </SideBar>
  );
};

export default Aftercare;

// The summary of this page includes:
// This page allows users to customize their digital estate plans with specific religious obligations and charitable intentions.
// It integrates features like Nazar/Kaffarah vows fulfillment, Fidyah obligations for missed fasts, and contributions to charity (Sadaqah).
// Users can also allocate assets to Waqf foundations for enduring charitable impact.
// Additionally, there's an option to pledge as an organ donor.
// Each section includes forms for inputting details and options to save changes.
// Access to certain features may require upgrading the user's plan.
