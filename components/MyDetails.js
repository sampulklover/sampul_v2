import { addUserImg } from '../constant/element';
import {
  countries,
  maritalStatus,
  preferablyCommunications,
  religions,
  systemLanguages,
} from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import {
  mapViewElements,
  processForm,
  replaceOrAddImage,
} from '../utils/helpers';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';

const MyDetails = ({
  parentPage = 'settings',
  onSubmitToggle = false,
  onSuccess = () => {},
}) => {
  const { contextApiData, getProfile, getWill } = useApi();
  const { locale, changeLocale } = useLocale();

  const [summary, setSummary] = useState({
    isSaving: false,
  });
  const [selectedImage, setSelectedImage] = useState({
    data: null,
    url: addUserImg,
  });

  useEffect(() => {
    if (contextApiData.profile.data) {
      var element = elementList().profile.elements;
      var mapData = contextApiData.profile.data;
      mapViewElements({
        source: mapData,
        target: element,
        viewOnly: false,
      });
    }
  }, [contextApiData.profile]);

  const pageConfig = {
    settings: {
      showCard: false,
      showHeader: true,
      isColumnLayout: false,
      showFooter: false,
      isModalView: false,
      submitBtnTitle: translations[locale].global.save,
    },
    onboard: {
      showCard: true,
      showHeader: false,
      isColumnLayout: false,
      showFooter: false,
      isModalView: false,
      submitBtnTitle: 'Save Changes',
    },
  };

  const elementList = () => {
    const inputElements = {
      profile: {
        elements: {
          username: document.getElementById('input-my-details-username'),
          nric_name: document.getElementById('input-my-details-nric-name'),
          nric_no: document.getElementById('input-my-details-nric-no'),
          dob: document.getElementById('input-my-details-dob'),
          email: document.getElementById('input-my-details-email'),
          phone_no: document.getElementById('input-my-details-phone-no'),
          religion: document.getElementById('select-my-details-religion'),
          marital_status: document.getElementById(
            'select-my-details-marital-status'
          ),
          address_1: document.getElementById('input-my-details-address-1'),
          address_2: document.getElementById('input-my-details-address-2'),
          city: document.getElementById('input-my-details-city'),
          postcode: document.getElementById('input-my-details-postcode'),
          state: document.getElementById('input-my-details-state'),
          country: document.getElementById('select-my-details-country'),
          image_path: document.getElementById('preview-my-details-image'),
          preferably_communication: document.getElementById(
            'select-my-details-preferably-communication'
          ),
          system_language: document.getElementById(
            'select-my-details-system-language'
          ),
        },
      },
    };

    return inputElements;
  };

  const onSubmitForm = async () => {
    setSummary({
      ...summary,
      isSaving: true,
    });

    const addData = processForm(elementList().profile.elements, false);

    const { data: returnData, error } = await supabase
      .from('profiles')
      .update(addData)
      .eq('uuid', contextApiData.user.data?.id)
      .select()
      .single();

    if (returnData?.system_language) {
      let langguageUse = systemLanguages().find(
        (x) => x.value === returnData.system_language
      );
      if (langguageUse?.langCode) {
        changeLocale({ lang: langguageUse?.langCode });
      }
    }

    if (error) {
      toast.error(error.message);
      setSummary({
        ...summary,
        isSaving: false,
      });
      return;
    }

    const directory = `/avatar/profile/`;
    const imageInput = document.getElementById('input-my-details-image');

    await replaceOrAddImage({
      userId: contextApiData.user.data?.id,
      returnData,
      directory,
      imageInput,
      dataBase: 'profiles',
      isUpdateByReturnId: false,
    });

    toast.success(translations[locale].global.saved_successfully);

    setSummary({
      ...summary,
      isSaving: false,
    });

    if (pageConfig[parentPage]?.isModalView) {
      $('#profile-modal')?.modal('hide');
    }

    setTimeout(() => {
      getProfile(true);
      getWill();
      onSuccess();
    }, 1500);
  };

  const checkView = ({ labelDiv1, inputDiv1, labelDiv2, inputDiv2 }) => {
    if (pageConfig[parentPage]?.isColumnLayout) {
      return (
        <div class="form-content-2 mb-3">
          <div class="form-field-wrapper">
            {labelDiv1}
            {inputDiv1}
          </div>
          <div class="form-field-wrapper">
            {labelDiv2}
            {inputDiv2}
          </div>
        </div>
      );
    }

    return (
      <>
        <div class="row mb-4">
          <div class="col-lg">{labelDiv1}</div>
          <div class="col">{inputDiv1}</div>
        </div>
        <div class="row mb-4">
          <div class="col-lg">{labelDiv2}</div>
          <div class="col">{inputDiv2}</div>
        </div>
      </>
    );
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
        <div class={pageConfig[parentPage]?.showCard ? 'card' : ''}>
          {pageConfig[parentPage]?.showHeader ? (
            <div class="row mb-4 mt-4">
              <div class="col-lg">
                <div class="smpl_text-sm-semibold">
                  {translations[locale].component.my_details.profile}{' '}
                  <Loading loading={contextApiData.profile.isLoading} />
                </div>
                <div class="smpl_text-sm-regular">
                  {
                    translations[locale].component.my_details
                      .update_your_personal_
                  }
                </div>
              </div>
              <div class="col text-end mt-md-0 mt-3">
                <button type="submit" class="btn btn-primary btn-text">
                  <Loading
                    title={pageConfig[parentPage]?.submitBtnTitle}
                    loading={summary.isSaving}
                  />
                </button>
              </div>
            </div>
          ) : (
            ''
          )}
          <div class="row mb-4">
            <div class="col-lg">
              <label class="uui-field-label">
                {translations[locale].component.my_details.your_photo_}
              </label>
              <small class="smpl_text-sm-regular">
                {translations[locale].component.my_details.this_will_be_}
              </small>
            </div>
            <div class="col">
              <img
                loading="lazy"
                src={selectedImage.url}
                alt=""
                class="avatar-7"
                id="preview-my-details-image"
                onClick={() => {
                  document.getElementById('input-my-details-image').click();
                }}
              />
              <input
                type="file"
                id="input-my-details-image"
                name=""
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(event) => {
                  try {
                    let imageURL = URL.createObjectURL(event.target.files[0]);
                    if (imageURL) {
                      setSelectedImage({
                        data: event.target.files[0],
                        url: imageURL,
                      });
                    }
                  } catch {
                    console.log('Cancelled');
                  }
                }}
              />
            </div>
          </div>
          {checkView({
            labelDiv1: (
              <label
                htmlFor="input-my-details-username"
                class="uui-field-label"
              >
                {translations[locale].component.my_details.username}
              </label>
            ),
            inputDiv1: (
              <input
                type="text"
                class="form-control"
                id="input-my-details-username"
                required
              />
            ),
            labelDiv2: (
              <label
                htmlFor="input-my-details-nric-name"
                class="uui-field-label"
              >
                {translations[locale].component.my_details.name_as_per_}
              </label>
            ),
            inputDiv2: (
              <input
                type="text"
                class="form-control"
                id="input-my-details-nric-name"
                required
              />
            ),
          })}
          {checkView({
            labelDiv1: (
              <label htmlFor="input-my-details-nric-no" class="uui-field-label">
                {translations[locale].component.my_details.nric}
              </label>
            ),
            inputDiv1: (
              <input
                type="text"
                class="form-control"
                id="input-my-details-nric-no"
                required
              />
            ),
            labelDiv2: (
              <label htmlFor="input-my-details-dob" class="uui-field-label">
                {translations[locale].component.my_details.date_of_birth}
              </label>
            ),
            inputDiv2: (
              <input
                type="date"
                class="form-control"
                id="input-my-details-dob"
                required
              />
            ),
          })}
          {checkView({
            labelDiv1: (
              <label htmlFor="input-my-details-email" class="uui-field-label">
                {translations[locale].component.my_details.email}
              </label>
            ),
            inputDiv1: (
              <input
                type="email"
                class="form-control"
                id="input-my-details-email"
                required
                disabled
              />
            ),
            labelDiv2: (
              <label
                htmlFor="input-my-details-phone-no"
                class="uui-field-label"
              >
                {translations[locale].component.my_details.contact}
              </label>
            ),
            inputDiv2: (
              <input
                type="text"
                class="form-control"
                id="input-my-details-phone-no"
                required
              />
            ),
          })}
          {checkView({
            labelDiv1: (
              <label
                htmlFor="select-my-details-religion"
                class="uui-field-label"
              >
                {translations[locale].component.my_details.religion}
              </label>
            ),
            inputDiv1: (
              <select
                id="select-my-details-religion"
                required
                class="form-select"
              >
                {religions().map((item) => (
                  <option key={item.value} value={item.value}>
                    {translations[locale]?.global[item.value]}
                  </option>
                ))}
              </select>
            ),
            labelDiv2: (
              <label
                htmlFor="select-my-details-marital-status"
                class="uui-field-label"
              >
                {translations[locale].component.my_details.marital_status}
              </label>
            ),
            inputDiv2: (
              <select
                id="select-my-details-marital-status"
                required
                class="form-select"
              >
                {maritalStatus().map((item) => (
                  <option key={item.value} value={item.value}>
                    {translations[locale]?.global[item.value]}
                  </option>
                ))}
              </select>
            ),
          })}
          <div
            class={`${
              pageConfig[parentPage]?.isColumnLayout ? '' : 'row'
            } align-items-start`}
          >
            <div class="col-lg">
              <label
                htmlFor="input-my-details-address-1"
                class="uui-field-label"
              >
                {translations[locale].component.my_details.address}
              </label>
            </div>
            <div
              class={pageConfig[parentPage]?.isColumnLayout ? 'mt-2' : 'col'}
            >
              <input
                type="text"
                class="form-control"
                id="input-my-details-address-1"
                required
                placeholder={
                  translations[locale].component.my_details.address_1
                }
              />
              <input
                type="text"
                class="form-control mt-2"
                id="input-my-details-address-2"
                placeholder={
                  translations[locale].component.my_details.address_2
                }
              />

              <div class="form-content-2">
                <div class="form-field-wrapper">
                  <input
                    type="text"
                    class="form-control mt-2"
                    id="input-my-details-city"
                    required
                    placeholder={translations[locale].component.my_details.city}
                  />
                </div>
                <div class="form-field-wrapper mr-2">
                  <input
                    type="text"
                    class="form-control mt-2"
                    id="input-my-details-postcode"
                    required
                    placeholder={
                      translations[locale].component.my_details.postcode
                    }
                  />
                </div>
              </div>

              <div class="form-content-2 mb-3">
                <div class="form-field-wrapper">
                  <input
                    type="text"
                    class="form-control mt-2"
                    id="input-my-details-state"
                    required
                    placeholder={
                      translations[locale].component.my_details.state
                    }
                  />
                </div>
                <div class="form-field-wrapper">
                  <select
                    id="select-my-details-country"
                    required
                    class="form-select mt-2"
                  >
                    {countries().map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          {checkView({
            labelDiv1: (
              <label
                htmlFor="select-my-details-preferably-communication"
                class="uui-field-label"
              >
                {
                  translations[locale].component.my_details
                    .preferably_communication
                }
              </label>
            ),
            inputDiv1: (
              <select
                id="select-my-details-preferably-communication"
                required
                class="form-select"
              >
                {preferablyCommunications().map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.name}
                  </option>
                ))}
              </select>
            ),
            labelDiv2: (
              <label
                htmlFor="select-my-details-system-language"
                class="uui-field-label"
              >
                {translations[locale].component.my_details.system_language}
              </label>
            ),
            inputDiv2: (
              <select
                id="select-my-details-system-language"
                required
                class="form-select"
              >
                {systemLanguages().map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.name}
                  </option>
                ))}
              </select>
            ),
          })}
          {pageConfig[parentPage]?.showFooter ? (
            <div
              class={
                pageConfig[parentPage]?.isColumnLayout
                  ? 'd-grid gap-2 mt-5'
                  : 'text-end'
              }
            >
              <button type="submit" class="btn btn-primary btn-text">
                <Loading
                  title={pageConfig[parentPage]?.submitBtnTitle}
                  loading={summary.isSaving}
                />
              </button>
            </div>
          ) : (
            ''
          )}
        </div>
      </form>
    </div>
  );
};

export default MyDetails;

// The summary of this page includes:
// This page allows users to update their personal information and profile picture.
// It's designed for both regular use and within a modal interface.
// Users can input and save details like their username, NRIC name and number, date of birth, email, phone number, religion, marital status, and address.
// The form is integrated with functionalities for data processing, image handling, and validation.
// Upon submission, changes are stored in a database using Supabase, with visual feedback provided through toast notifications.
