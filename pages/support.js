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

const Support = () => {
  const { contextApiData } = useApi();
  const { locale } = useLocale();
  const router = useRouter();

  const supportType = [
    { title: 'Listens Without Judgement' },
    { title: 'Confidential' },
    { title: 'Friendly Casual Support' },
    { title: 'Learn From Their Experiences' },
    { title: 'Follow-Ups Available' },
  ];

  const supporterUser = [
    {
      name: 'Arham Merican (Wasiat/WIill Advisor)',
      imageUrl: 'images/avatar-arham.png',
      bio: 'Arham Merican adalah Penasihat Shariah berdaftar dengan Suruhanjaya Sekuriti Malaysia dan bertugas sebagai Ketua Pegawai Strategi di Sharlife, sebuah platform digital multi-aset untuk pelabur global membuat pelaburan patuh Shariah dan juga Pengasas Sampul Sdn Bhd, sebuah platform wasiat digital untuk aset digital.',
      onClick: () => {},
    },
    {
      name: 'Najiya Ilya - SAPOT Warrior',
      imageUrl: 'images/avatar-najiya.png',
      bio: 'BSc Psychology – Cardiff University. Developed a mental health resilience guidebook for PETRONAS staffs. Assisted with the mental health first aid kit framework development to equip employees on how to provide immediate first-line mental health assistance.',
      onClick: () => {},
    },
    {
      name: 'Fatiha Shuib - SAPOT Warrior',
      imageUrl: 'images/avatar-fatiha.png',
      bio: 'BA Islamic Jurisprudence, Jordan. Mental Illness Survivor, Developed mental health and humanitarian movement called 1Moment4Them in 2015. Managed to collaborate with the prominent artists in Malaysia such as Faizal Tahir, Mizz Nina, Noh Salleh and Aizat Amdan.',
      onClick: () => {},
    },
  ];

  const cardContent = () => {
    return (
      <>
        <div class="settings_component-copy">
          <div class="col">
            <div>
              <div>
                <span class="heading-02">Our Support team</span>
              </div>
              <div class="paragraph-01">
                <p>
                  You must have been through a lot. All the ups and downs in
                  your life is a story worth telling.
                </p>
                <p>
                  Let’s start meaningful conversations and find our voice while
                  doing so.
                </p>
                <p>
                  Choose a date and time that you're both free and lock in that
                  date! Try a free session with our PFA trained mental health
                  survivors or really dive in deep with our Certified Peer
                  Supporters.
                </p>
                <ul>
                  {supportType.map((item, index) => {
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
            {supporterUser.map((item, index) => {
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
                      <Loading title="Book Appointment" />
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
      <div class="body-01 inner-body-01">
        <div class="content">
          <Breadcrumb
            pageName="Support"
            rightSection={
              <button
                type="button"
                class="btn btn-primary btn-sm"
                onClick={() => {
                  router.push('will');
                }}
              >
                <Loading title="Preview Wasiat" />
              </button>
            }
          />
          <InnerHeader
            title="Get help when needed."
            subtitle={`Healing takes hard work and time, we are here to join you on this journey. Connect with our support team for personalized support to families, guiding through the administrative and emotional challenges of loss.`}
            imageSrc="images/being-at-peace.svg"
          />
          <div class="text-center">
            <img
              src="images/support-marketing-banner.png"
              alt=""
              width="80%"
              height="80%"
            />
          </div>
          <div class="row mt-4">{cardContent()}</div>
        </div>
        <Footer />
      </div>
    </SideBar>
  );
};

export default Support;

// The summary of this page includes:
// This page allows users to customize their digital estate plans with specific religious obligations and charitable intentions.
// It integrates features like Nazar/Kaffarah vows fulfillment, Fidyah obligations for missed fasts, and contributions to charity (Sadaqah).
// Users can also allocate assets to Waqf foundations for enduring charitable impact.
// Additionally, there's an option to pledge as an organ donor.
// Each section includes forms for inputting details and options to save changes.
// Access to certain features may require upgrading the user's plan.