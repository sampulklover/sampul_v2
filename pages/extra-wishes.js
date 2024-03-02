import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useUser } from '../context/user';
import Loading from '../components/Laoding';
import toast from 'react-hot-toast';
import Select from 'react-select';
import {
  belovedLevel,
  charityBodies,
  instructionsAfterDeath,
  relationships,
  servicePlatforms,
  waqfBodies,
} from '../constant/enum';
import { processForm } from '../utils/helpers';
import Link from 'next/link';
import DigitalSummaryCard from '../components/DigitalSummaryCard';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import BelovedModal from '../components/BelovedModal';
import { addUserImg, emptyUserImg } from '../constant/element';
import SideBar from '../components/SideBar';
import { Tooltip } from 'react-tooltip';

const ExtraWishes = () => {
  const { user, isLoading } = useUser();
  const [mutiselectData, setMultiSelectData] = useState({
    charity: {
      selected: [],
      data: [],
      isReady: false,
    },
    waqf: {
      selected: [],
      data: [],
      isReady: false,
    },
  });

  const [bodiesList, setBodiesList] = useState([]);
  const [buttonLoading, setButtonLoading] = useState({
    nazar: false,
    fidyah: false,
    charity: false,
    waqf: false,
    organ_donor: false,
  });

  const [runEffect, setRunEffect] = useState(false);

  const getWaqfBodyValue = () => {
    var newData = [];
    mutiselectData.waqf.selected.map((item, index) => {
      newData.push({
        bodies_uid: item.value,
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
        bodies_uid: item.value,
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

  const mapMultiselectList = ({ charityData, waqfData, bodiesData }) => {
    var newCharity = [];
    var defaultCharity = [];
    var newWaqf = [];
    var defaultWaqf = [];

    bodiesData.map((item) => {
      newCharity.push({ label: item.name, value: item.uid });
      charityData.map((item2) => {
        if (item2.bodies_uid == item.uid) {
          defaultCharity.push({
            label: item.name,
            value: item.uid,
            amount: item2.amount,
          });
        }
      });
    });

    bodiesData.map((item) => {
      newWaqf.push({ label: item.name, value: item.uid });
      waqfData.map((item2) => {
        if (item2.bodies_uid == item.uid) {
          defaultWaqf.push({
            label: item.name,
            value: item.uid,
            amount: item2.amount,
          });
        }
      });
    });

    setMultiSelectData({
      ...mutiselectData,
      charity: {
        selected: defaultCharity,
        data: newCharity,
        isReady: true,
      },
      waqf: {
        selected: defaultWaqf,
        data: newWaqf,
        isReady: true,
      },
    });
  };

  useEffect(() => {
    if (!runEffect && user?.uuid) {
      setRunEffect(true);

      const getExtraWishes = async () => {
        const { data: bodiesData, error: bodiesError } = await supabase
          .from('bodies')
          .select('*');

        if (bodiesError) {
          toast.error(error.message);
          return;
        }

        const { data, error } = await supabase
          .from('extra_wishes')
          .select('*')
          .eq('uuid', user?.uuid);

        if (error) {
          toast.error(error.message);
          return;
        }

        var inputElements = elementList();
        var charityData = [];
        var waqfData = [];

        if (data.length > 0) {
          var currentData = data[0];

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
        }

        mapMultiselectList({
          charityData: charityData,
          waqfData: waqfData,
          bodiesData: bodiesData,
        });
      };

      getExtraWishes();
    }
  }, [user, runEffect]);

  const title = () => {
    return (
      <>
        <div class="row">
          <div class="col-lg">
            <div class="content-text">
              <div class="smpl_display-sm-semibold">Extra Wishes</div>
            </div>
            <div class="smpl_text-md-regular">
              Add special touches with Sampul's Extra Wishes feature.
            </div>
          </div>
          <div class="col text-end"></div>
        </div>
        <div class="border-top my-3"></div>
      </>
    );
  };

  const onSubmitForm = async ({ keyName }) => {
    if (checkRestriction(keyName) == true) {
      toast.error('You need to upgrade your plan to use this feature.');
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

    const { data, error } = await db.select('*').eq('uuid', user?.uuid);

    if (error) {
      toast.error(error.message);
      setButtonLoading({
        ...buttonLoading,
        [keyName]: false,
      });
      return;
    }

    if (data.length !== 0) {
      await db.update(addData).eq('uuid', user?.uuid);
    } else {
      await db.insert({ uuid: user?.uuid, ...addData });
    }

    toast.success('Saved successfully!');

    setButtonLoading({
      ...buttonLoading,
      [keyName]: false,
    });
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
    const access = user.access_control?.pages?.extra_wishes[keyName]?.access;
    return access === false;
  };

  const displayUpgradePlan = (keyName) => {
    if (checkRestriction(keyName) == true) {
      return (
        <Link href="/settings?tab=nav-billing-tab">
          <div class="smpl_text-sm-semibold">
            <span class="text-primary">(Upgrade your plan)</span>
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
                <b>Nazar/Kaffarah</b>
              </div>
              <div class="smpl_text-sm-regular">
                Fullfill your vows or compensatory actions with ease through
                Sampul's streamlined process, ensuring your spiritual
                commitments are honored.
              </div>
              {displayUpgradePlan('nazar')}
            </div>
          </div>
          <div class="col card">
            <form
              class="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmitForm({ keyName: 'nazar' });
              }}
            >
              <div class="mb-3">
                <label
                  for="input-extra-wishes-nazar-wishes"
                  class="uui-field-label"
                >
                  Wishes
                </label>
                <textarea
                  class="form-control"
                  id="input-extra-wishes-nazar-wishes"
                  placeholder="Type your wishes..."
                  required
                  rows="5"
                />
              </div>
              <div class="mb-3">
                <label
                  for="input-extra-wishes-nazar-est-cost"
                  class="uui-field-label"
                >
                  Estimate cost to execute the Nazar or pay Kaffarah (RM)?
                </label>
                <input
                  type="number"
                  step="0.01"
                  class="form-control"
                  id="input-extra-wishes-nazar-est-cost"
                  required
                />
              </div>
              <div class="mb-3 text-end">
                <button type="submit" class="btn btn-primary btn-lg btn-text">
                  <Loading title="Save" loading={buttonLoading.nazar} />
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
                <b>Fidyah</b>
              </div>
              <div class="smpl_text-sm-regular">
                Fulfill your fidyah obligations effortlessly with Sampul's
                simplified process, ensuring your religious duties are met with
                ease.
              </div>
              {displayUpgradePlan('fidyah')}
            </div>
          </div>
          <div class="col card">
            <form
              class="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmitForm({ keyName: 'fidyah' });
              }}
            >
              <div class="mb-3">
                <label
                  for="input-extra-wishes-fidyah-fast-left-days"
                  class="uui-field-label"
                >
                  How many days have you left your fast during Ramadhan?
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
                  for="input-extra-wishes-fidyah-amount-due"
                  class="uui-field-label"
                >
                  Any amount of Fidyah due (RM)?
                </label>
                <input
                  type="number"
                  step="0.01"
                  class="form-control"
                  id="input-extra-wishes-fidyah-amount-due"
                  required
                />
              </div>
              <div class="mb-3 text-end">
                <button type="submit" class="btn btn-primary btn-lg btn-text">
                  <Loading title="Save" loading={buttonLoading.fidyah} />
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
                <b>Charity/Sadaqah</b>
              </div>
              <div class="smpl_text-sm-regular">
                Seamlessly include your charitable intentions in your digital
                estate plan with Sampul, ensuring your legacy extends to making
                a positive impact beyond your lifetime.
              </div>
              {displayUpgradePlan('charity')}
            </div>
          </div>
          <div class="col card">
            <form
              class="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmitForm({ keyName: 'charity' });
              }}
            >
              <div class="mb-3">
                <label
                  for="multiselect-extra-wishes-charity-bodies"
                  class="uui-field-label"
                >
                  Contribute to Charity/Sadaqah Bodies
                </label>
                {mutiselectData.charity.isReady ? (
                  <Select
                    isMulti
                    defaultValue={mutiselectData.charity.selected}
                    options={mutiselectData.charity.data}
                    onChange={(newValues) => {
                      handleChange({
                        keyName: 'charity',
                        newValues: newValues,
                      });
                    }}
                  />
                ) : (
                  <Loading loading={true} />
                )}
              </div>
              {mutiselectData.charity.selected.map((item, index) => {
                return (
                  <div class="mb-3" key={index}>
                    <label
                      for={`input-extra-wishes-charity-${item.value}-amount`}
                      class="uui-field-label"
                    >
                      {item.label}'s asset/amount (RM)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      class="form-control"
                      id={`input-extra-wishes-charity-${item.value}-amount`}
                      value={item.amount}
                      onChange={(event) =>
                        handleAmountChange(index, event.target.value, 'charity')
                      }
                      required
                    />
                  </div>
                );
              })}
              <div class="mb-3 text-end">
                <button type="submit" class="btn btn-primary btn-lg btn-text">
                  <Loading title="Save" loading={buttonLoading.charity} />
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
                <b>Waqf</b>
              </div>
              <div class="smpl_text-sm-regular">
                Preserve your legacy through charitable endowments with Sampul.
                Securely allocate digital assets to support causes close to your
                heart and leave a lasting impact on future generations.
              </div>
              {displayUpgradePlan('waqf')}
            </div>
          </div>
          <div class="col card">
            <form
              class="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmitForm({ keyName: 'waqf' });
              }}
            >
              <div class="mb-3">
                <label
                  for="multiselect-extra-wishes-waqf-foundation"
                  class="uui-field-label"
                >
                  Contribute to Waqf Foundation
                </label>
                {mutiselectData.waqf.isReady == true ? (
                  <>
                    <Select
                      isMulti
                      defaultValue={mutiselectData.waqf.selected}
                      options={mutiselectData.waqf.data}
                      onChange={(newValues) => {
                        handleChange({
                          keyName: 'waqf',
                          newValues: newValues,
                        });
                      }}
                    />
                  </>
                ) : (
                  <Loading loading={true} />
                )}
              </div>
              {mutiselectData.waqf.selected.map((item, index) => {
                return (
                  <div class="mb-3" key={index}>
                    <label
                      for={`input-extra-wishes-waqf-${item.value}-amount`}
                      class="uui-field-label"
                    >
                      {item.label}'s asset/amount (RM)
                    </label>
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
                );
              })}
              <div class="mb-3 text-end">
                <button type="submit" class="btn btn-primary btn-lg btn-text">
                  <Loading title="Save" loading={buttonLoading.waqf} />
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
                  data-tooltip-html="<div>
                  Info: For Muslims, the National Fatwa Council (Majlis Fatwa Kebangsaan)<br/>
                  in June 1970 has decided that it is permissible to donate organs with the<br/>
                  condition it is used to save life where there are no other alternatives<br/>
                  and not used for business dealings.</div>"
                >
                  Organ Donor Pledge <i class="bi bi-info-circle"></i>
                </b>
                <Tooltip
                  id="my-tooltip-1"
                  place="bottom"
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    'border-radius': '10px',
                  }}
                />
              </div>
              <div class="smpl_text-sm-regular">
                At the point of death, if you are deemed suitable for organ or
                tissue donation by medical experts, consent from your loved ones
                will be obtained. By agreeing to pledge as an organ donor,
                please ensure that you have informed your loved ones on your
                wish.
              </div>
              {displayUpgradePlan('organ_donor')}
            </div>
          </div>
          <div class="col card">
            <form
              class="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmitForm({ keyName: 'organ_donor' });
              }}
            >
              <div class="mb-3">
                <label
                  for="select-extra-wishes-organ-donor-pledge"
                  class="uui-field-label"
                >
                  Please select your preference regarding organ donation
                </label>
                <select
                  id="select-extra-wishes-organ-donor-pledge"
                  required=""
                  class="form-select"
                >
                  {[
                    { name: 'Agree', value: true },
                    { name: 'Disagree', value: false },
                  ].map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div class="mb-3 text-end">
                <button type="submit" class="btn btn-primary btn-lg btn-text">
                  <Loading title="Save" loading={buttonLoading.organ_donor} />
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

    if (user?.profile?.religion) {
      if (user.profile.religion == 'islam') {
        display = 'block';
      } else {
        display = 'none';
      }
    }

    return display;
  };

  return (
    <SideBar>
      <div class="body">
        <div class="content">
          <Breadcrumb pageName={'Extra Wishes'} />
          <div class="mt-4">{title()}</div>
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
