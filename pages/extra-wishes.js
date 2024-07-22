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
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';

const ExtraWishes = () => {
  const { contextApiData, getExtraWishes } = useApi();
  const { locale } = useLocale();
  const router = useRouter();

  const useUniqueId = () => {
    const [id, setId] = useState('');

    useEffect(() => {
      setId(`id-${Math.random().toString(36).substr(2, 9)}`);
    }, []);

    return id;
  };

  const uniqueId1 = useUniqueId();
  const uniqueId2 = useUniqueId();

  const [mutiselectData, setMultiSelectData] = useState({
    charity: {
      selected: [],
    },
    waqf: {
      selected: [],
    },
  });

  const [buttonLoading, setButtonLoading] = useState({
    nazar: false,
    fidyah: false,
    charity: false,
    waqf: false,
    organ_donor: false,
  });

  const getWaqfBodyValue = () => {
    var newData = [];
    mutiselectData.waqf.selected.map((item, index) => {
      newData.push({
        bodies_id: item.value,
        amount: document.getElementById(
          `input-extra-wishes-waqf-${item.value}-amount`
        ).value,
      });
    });
    return newData;
  };

  const getCharityBodyValue = () => {
    var newData = [];
    mutiselectData.charity.selected.map((item, index) => {
      newData.push({
        bodies_id: item.value,
        amount: document.getElementById(
          `input-extra-wishes-charity-${item.value}-amount`
        ).value,
      });
    });
    return newData;
  };

  const elementList = () => {
    const inputElements = {
      nazar: {
        form: document.getElementById('extra-wishes-nazar-form'),
        elements: {
          nazar_wishes: document.getElementById(
            'input-extra-wishes-nazar-wishes'
          ),
          nazar_est_cost_myr: document.getElementById(
            'input-extra-wishes-nazar-est-cost'
          ),
        },
      },
      fidyah: {
        form: document.getElementById('extra-wishes-fidyah-form'),
        elements: {
          fidyah_fast_left_days: document.getElementById(
            'input-extra-wishes-fidyah-fast-left-days'
          ),
          fidyah_amout_due_myr: document.getElementById(
            'input-extra-wishes-fidyah-amount-due'
          ),
        },
      },
      charity: {
        form: document.getElementById('extra-wishes-charity-form'),
        elements: {
          charity_bodies: { value: getCharityBodyValue() },
        },
      },
      waqf: {
        form: document.getElementById('extra-wishes-waqf-form'),
        elements: {
          waqf_bodies: { value: getWaqfBodyValue() },
        },
      },
      organ_donor: {
        form: document.getElementById('extra-wishes-organ-donor-form'),
        elements: {
          organ_donor_pledge: document.getElementById(
            'select-extra-wishes-organ-donor-pledge'
          ),
        },
      },
    };

    return inputElements;
  };

  const mapMultiselectList = ({ charityData, waqfData }) => {
    var defaultCharity = [];
    var defaultWaqf = [];

    charityData.map((item) => {
      const body = contextApiData.bodies.data?.find(
        (x) => x.id === item.bodies_id
      );

      if (body) {
        defaultCharity.push({
          ...body,
          label: body.name,
          value: body.id,
          amount: item.amount,
        });
      }
    });

    waqfData.map((item) => {
      const body = contextApiData.bodies.data?.find(
        (x) => x.id === item.bodies_id
      );

      if (body) {
        defaultWaqf.push({
          ...body,
          label: body.name,
          value: body.id,
          amount: item.amount,
        });
      }
    });

    setMultiSelectData({
      ...mutiselectData,
      charity: {
        selected: defaultCharity,
      },
      waqf: {
        selected: defaultWaqf,
      },
    });
  };

  useEffect(() => {
    if (
      contextApiData.extraWishes.data !== null &&
      contextApiData.bodies.data.length > 0
    ) {
      var inputElements = elementList();
      var charityData = [];
      var waqfData = [];

      var currentData = contextApiData.extraWishes.data;
      for (const key in inputElements) {
        if (inputElements.hasOwnProperty(key)) {
          for (const key2 in inputElements[key].elements) {
            if (key2 == 'charity_bodies') {
              charityData = currentData[key2] ? currentData[key2] : [];
            } else if (key2 == 'waqf_bodies') {
              waqfData = currentData[key2] ? currentData[key2] : [];
            } else {
              inputElements[key].elements[key2].value = currentData[key2];
            }
          }
        }
      }
      mapMultiselectList({
        charityData: charityData,
        waqfData: waqfData,
      });
    }
  }, [contextApiData.extraWishes, contextApiData.bodies]);

  const onSubmitForm = async ({ keyName }) => {
    if (checkRestriction(keyName) == true) {
      toast.error(translations[locale].extra_wishes.you_need_to_);
      return;
    }

    setButtonLoading({
      ...buttonLoading,
      [keyName]: true,
    });

    const addData = elementList()[keyName].elements;
    for (const key in addData) {
      addData[key] = addData[key].value;
    }

    const db = supabase.from('extra_wishes');

    const { data, error } = await db
      .select('*')
      .eq('uuid', contextApiData.user.data?.id);

    if (error) {
      toast.error(error.message);
      setButtonLoading({
        ...buttonLoading,
        [keyName]: false,
      });
      return;
    }

    if (data.length !== 0) {
      await db.update(addData).eq('uuid', contextApiData.user.data?.id);
    } else {
      await db.insert({ uuid: contextApiData.user.data?.id, ...addData });
    }

    toast.success(translations[locale].extra_wishes.saved_successfully);

    setButtonLoading({
      ...buttonLoading,
      [keyName]: false,
    });

    getExtraWishes();
  };

  const handleChange = ({ keyName, newValues }) => {
    setMultiSelectData({
      ...mutiselectData,
      [keyName]: {
        ...mutiselectData[keyName],
        selected: newValues,
      },
    });
  };

  const checkRestriction = (keyName) => {
    const access =
      contextApiData.account.data?.products?.access_control?.pages
        ?.extra_wishes[keyName]?.access;
    return access === false;
  };

  const displayUpgradePlan = (keyName) => {
    if (checkRestriction(keyName) == true) {
      return (
        <Link href="/settings?tab=nav-billing-tab">
          <div class="smpl_text-sm-semibold">
            <span class="text-primary">
              {translations[locale].extra_wishes.upgrade_your_plan}
            </span>
          </div>
        </Link>
      );
    }

    return <></>;
  };

  const form1 = () => {
    return (
      <>
        <div class="settings_component-copy">
          <div class="col">
            <div>
              <div class="text-sm-medium-6">
                <b
                  data-tooltip-id="my-tooltip-nazar"
                  data-tooltip-html={`
                  <div>
                    <p>
                    ${translations[locale].extra_wishes.info_nazar_is_} 
                    </p>
                  </div>`}
                >
                  {translations[locale].extra_wishes.nazar_kaffarah}
                  <i class="bi bi-info-circle ms-1"></i>
                </b>
                <Tooltip
                  id="my-tooltip-nazar"
                  place="bottom"
                  style={{
                    textAlign: 'justify',
                    maxWidth: '300px',
                    backgroundColor: 'black',
                    color: 'white',
                    'border-radius': '10px',
                    'z-index': '10',
                  }}
                />
              </div>
              <div class="smpl_text-sm-regular">
                {translations[locale].extra_wishes.fullfill_your_vows_}
              </div>
              {displayUpgradePlan('nazar')}
            </div>
          </div>
          <div class="col-lg col-sm-12 mt-lg-0 mt-2 card">
            <form
              class="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmitForm({ keyName: 'nazar' });
              }}
            >
              <div class="mb-3">
                <label
                  htmlFor="input-extra-wishes-nazar-wishes"
                  class="uui-field-label"
                >
                  {translations[locale].extra_wishes.any_nazar_kaffarah_}
                </label>
                <textarea
                  class="form-control"
                  id="input-extra-wishes-nazar-wishes"
                  placeholder={translations[locale].extra_wishes.i_wish_to_}
                  required
                  rows="5"
                />
              </div>
              <div class="mb-3">
                <label
                  htmlFor="input-extra-wishes-nazar-est-cost"
                  class="uui-field-label"
                >
                  {translations[locale].extra_wishes.estimate_cost_to_}
                </label>
                <div class="input-group">
                  <div class="input-group-text">RM</div>
                  <input
                    type="number"
                    step="0.01"
                    class="form-control"
                    id="input-extra-wishes-nazar-est-cost"
                    required
                  />
                </div>
              </div>
              <div class="mb-3 text-end">
                <button type="submit" class="btn btn-primary btn-text">
                  <Loading
                    title={translations[locale].extra_wishes.save}
                    loading={buttonLoading.nazar}
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  const form2 = () => {
    return (
      <>
        <div class="settings_component-copy">
          <div class="col">
            <div>
              <div class="text-sm-medium-6">
                <b
                  data-tooltip-id="my-tooltip-fidyah"
                  data-tooltip-html={`
                  <div>
                    <p>
                    ${translations[locale].extra_wishes.info_when_someone_} 
                    </p>
                  </div>`}
                >
                  {translations[locale].extra_wishes.fidyah}
                  <i class="bi bi-info-circle ms-1"></i>
                </b>
                <Tooltip
                  id="my-tooltip-fidyah"
                  place="bottom"
                  style={{
                    textAlign: 'justify',
                    maxWidth: '300px',
                    backgroundColor: 'black',
                    color: 'white',
                    'border-radius': '10px',
                    'z-index': '10',
                  }}
                />
              </div>
              <div class="smpl_text-sm-regular">
                {translations[locale].extra_wishes.fulfill_your_fidyah}
              </div>
              {displayUpgradePlan('fidyah')}
            </div>
          </div>
          <div class="col-lg col-sm-12 mt-lg-0 mt-2 card">
            <form
              class="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmitForm({ keyName: 'fidyah' });
              }}
            >
              <div class="mb-3">
                <label
                  htmlFor="input-extra-wishes-fidyah-fast-left-days"
                  class="uui-field-label"
                >
                  {translations[locale].extra_wishes.how_many_days_}
                </label>
                <input
                  type="number"
                  step="0.01"
                  class="form-control"
                  id="input-extra-wishes-fidyah-fast-left-days"
                  required
                />
              </div>
              <div class="mb-3">
                <label
                  htmlFor="input-extra-wishes-fidyah-amount-due"
                  class="uui-field-label"
                >
                  {translations[locale].extra_wishes.any_amount_of_}
                </label>
                <div class="input-group">
                  <div class="input-group-text">RM</div>
                  <input
                    type="number"
                    step="0.01"
                    class="form-control"
                    id="input-extra-wishes-fidyah-amount-due"
                    required
                  />
                </div>
              </div>
              <div class="mb-3 text-end">
                <button type="submit" class="btn btn-primary btn-text">
                  <Loading
                    title={translations[locale].extra_wishes.save}
                    loading={buttonLoading.fidyah}
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  const form3 = () => {
    return (
      <>
        <div class="settings_component-copy">
          <div class="col">
            <div>
              <div class="text-sm-medium-6">
                <b>{translations[locale].extra_wishes.charity_sadaqah}</b>
              </div>
              <div class="smpl_text-sm-regular">
                {translations[locale].extra_wishes.seamlessly_include_your_}
              </div>
              {displayUpgradePlan('charity')}
            </div>
          </div>
          <div
            class="col-lg col-sm-12 mt-lg-0 mt-2 card"
            style={{ width: '100%' }}
          >
            <form
              class="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmitForm({ keyName: 'charity' });
              }}
            >
              <div class="mb-3">
                <label
                  htmlFor="multiselect-extra-wishes-charity-bodies"
                  class="uui-field-label"
                >
                  {translations[locale].extra_wishes.contribute_to_charity_}
                </label>
                <Select
                  instanceId={uniqueId1}
                  isMulti
                  value={mutiselectData.charity.selected}
                  options={contextApiData.bodies.data
                    .filter((item) => item.category === 'sadaqah_waqaf_zakat')
                    .map((item) => ({
                      ...item,
                      label: item.name,
                      value: item.id,
                    }))}
                  onChange={(newValues) => {
                    handleChange({
                      keyName: 'charity',
                      newValues: newValues,
                    });
                  }}
                  getOptionLabel={getOptionLabelWithIcon}
                  getOptionValue={(option) => option.label}
                />
              </div>
              {mutiselectData.charity.selected.map((item, index) => {
                return (
                  <div class="mb-3" key={index}>
                    <label
                      htmlFor={`input-extra-wishes-charity-${item.value}-amount`}
                      class="uui-field-label"
                    >
                      {item.label}
                      {translations[locale].extra_wishes.s_assets_amout}
                    </label>
                    <div class="input-group">
                      <div class="input-group-text">RM</div>
                      <input
                        type="number"
                        step="0.01"
                        class="form-control"
                        id={`input-extra-wishes-charity-${item.value}-amount`}
                        value={item.amount}
                        onChange={(event) =>
                          handleAmountChange(
                            index,
                            event.target.value,
                            'charity'
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                );
              })}
              <div class="mb-3 text-end">
                <button type="submit" class="btn btn-primary btn-text">
                  <Loading
                    title={translations[locale].extra_wishes.save}
                    loading={buttonLoading.charity}
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  const form4 = () => {
    return (
      <>
        <div class="settings_component-copy">
          <div class="col">
            <div>
              <div class="text-sm-medium-6">
                <b>{translations[locale].extra_wishes.waqf}</b>
              </div>
              <div class="smpl_text-sm-regular">
                {translations[locale].extra_wishes.preserve_your_legacy_}
              </div>
              {displayUpgradePlan('waqf')}
            </div>
          </div>
          <div
            class="col-lg col-sm-12 mt-lg-0 mt-2 card"
            style={{ width: '100%' }}
          >
            <form
              class="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmitForm({ keyName: 'waqf' });
              }}
            >
              <div class="mb-3">
                <label
                  htmlFor="multiselect-extra-wishes-waqf-foundation"
                  class="uui-field-label"
                >
                  {translations[locale].extra_wishes.contribute_to_waqf_}
                </label>
                <Select
                  instanceId={uniqueId2}
                  isMulti
                  value={mutiselectData.waqf.selected}
                  options={contextApiData.bodies.data
                    .filter(
                      (item) =>
                        item.category === 'sadaqah_waqaf_zakat' ||
                        item.category === 'waqaf'
                    )
                    .map((item) => ({
                      ...item,
                      label: item.name,
                      value: item.id,
                    }))}
                  onChange={(newValues) => {
                    handleChange({
                      keyName: 'waqf',
                      newValues: newValues,
                    });
                  }}
                  getOptionLabel={getOptionLabelWithIcon}
                  getOptionValue={(option) => option.label}
                />
              </div>
              {mutiselectData.waqf.selected.map((item, index) => {
                return (
                  <div class="mb-3" key={index}>
                    <label
                      htmlFor={`input-extra-wishes-waqf-${item.value}-amount`}
                      class="uui-field-label"
                    >
                      {item.label}
                      {translations[locale].extra_wishes.s_assets_amout}
                    </label>
                    <div class="input-group">
                      <div class="input-group-text">RM</div>
                      <input
                        type="number"
                        step="0.01"
                        class="form-control"
                        id={`input-extra-wishes-waqf-${item.value}-amount`}
                        value={item.amount}
                        onChange={(event) =>
                          handleAmountChange(index, event.target.value, 'waqf')
                        }
                        required
                      />
                    </div>
                  </div>
                );
              })}
              <div class="mb-3 text-end">
                <button type="submit" class="btn btn-primary btn-text">
                  <Loading
                    title={translations[locale].extra_wishes.save}
                    loading={buttonLoading.waqf}
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  const handleAmountChange = (index, newValue, keyName) => {
    const updatedSelected = [...mutiselectData[keyName].selected];
    updatedSelected[index].amount = newValue;
    setMultiSelectData((prevState) => ({
      ...prevState,
      [keyName]: {
        ...prevState[keyName],
        selected: updatedSelected,
      },
    }));
  };

  const form5 = () => {
    return (
      <>
        <div class="settings_component-copy">
          <div class="col">
            <div>
              <div class="text-sm-medium-6">
                <b
                  data-tooltip-id="my-tooltip-1"
                  data-tooltip-html={`
                    <div>
                      <p>
                      ${translations[locale].extra_wishes.info_for_muslims_} 
                      </p>
                    </div>`}
                >
                  {translations[locale].extra_wishes.organ_donor_pledge}
                  <i class="bi bi-info-circle ms-1"></i>
                </b>
                <Tooltip
                  id="my-tooltip-1"
                  place="bottom"
                  style={{
                    textAlign: 'justify',
                    maxWidth: '300px',
                    backgroundColor: 'black',
                    color: 'white',
                    'border-radius': '10px',
                    'z-index': '10',
                  }}
                />
              </div>
              <div class="smpl_text-sm-regular">
                {translations[locale].extra_wishes.at_the_point_}
              </div>
              {displayUpgradePlan('organ_donor')}
            </div>
          </div>
          <div class="col-lg col-sm-12 mt-lg-0 mt-2 card">
            <form
              class="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmitForm({ keyName: 'organ_donor' });
              }}
            >
              <div class="mb-3">
                <label
                  htmlFor="select-extra-wishes-organ-donor-pledge"
                  class="uui-field-label"
                >
                  {translations[locale].extra_wishes.please_select_your_}
                </label>
                <select
                  id="select-extra-wishes-organ-donor-pledge"
                  required
                  class="form-select"
                >
                  {[
                    {
                      name: 'Disagree',
                      value: false,
                      translationKey: 'disagree',
                    },
                    { name: 'Agree', value: true, translationKey: 'agree' },
                  ].map((item) => (
                    <option key={item.value} value={item.value}>
                      {translations[locale]?.global[item.translationKey]}
                    </option>
                  ))}
                </select>
              </div>
              <div class="mb-3 text-end">
                <button type="submit" class="btn btn-primary btn-text">
                  <Loading
                    title={translations[locale].extra_wishes.save}
                    loading={buttonLoading.organ_donor}
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  const checkUiBaseReligion = () => {
    var display = 'block';

    if (contextApiData.profile.data?.religion) {
      if (contextApiData.profile.data.religion == 'islam') {
        display = 'block';
      } else {
        display = 'none';
      }
    }

    return display;
  };

  return (
    <SideBar>
      <div class="body inner-body">
        <div class="content">
          <Breadcrumb
            pageName={translations[locale].extra_wishes.extra_wishes}
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
          {/* <InnerHeader
            title="Add Personal Touches to Your Wasiat"
            subtitle={`Your wasiat is a deeply personal document that reflects your values and wishes. Here, you can add special instructions to make sure your final wishes are honored. Whether it's fulfilling religious obligations, making charitable donations, or pledging to donate your organs, you can add these meaningful touches to your wasiat. Select an option below to get started.`}
            imageSrc="images/investing.svg"
          /> */}
          <div class="row mt-4">
            <div
              style={{
                display: checkUiBaseReligion(),
              }}
            >
              {form1()}
              {form2()}
            </div>
            {form3()}
            <div
              style={{
                display: checkUiBaseReligion(),
              }}
            >
              {form4()}
            </div>
            {form5()}
          </div>
        </div>
        <Footer />
      </div>
    </SideBar>
  );
};

export default ExtraWishes;

// The summary of this page includes:
// This page allows users to customize their digital estate plans with specific religious obligations and charitable intentions.
// It integrates features like Nazar/Kaffarah vows fulfillment, Fidyah obligations for missed fasts, and contributions to charity (Sadaqah).
// Users can also allocate assets to Waqf foundations for enduring charitable impact.
// Additionally, there's an option to pledge as an organ donor.
// Each section includes forms for inputting details and options to save changes.
// Access to certain features may require upgrading the user's plan.
