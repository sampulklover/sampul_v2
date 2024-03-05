import Link from 'next/link';
import Loading from './Laoding';
import { addUserImg } from '../constant/element';
import { countries, maritalStatus, religions } from '../constant/enum';
import { useUser } from '../context/user';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  mapViewElements,
  processForm,
  replaceOrAddImage,
} from '../utils/helpers';
import toast from 'react-hot-toast';

const MyDetails = ({ isModal = false }) => {
  const { user } = useUser();
  const router = useRouter();
  const [runEffect, setRunEffect] = useState(false);
  const [summary, setSummary] = useState({
    isCalling: false,
    isSaving: false,
  });
  const [selectedImage, setSelectedImage] = useState({
    data: null,
    url: addUserImg,
  });

  useEffect(() => {
    if (!runEffect && user?.uuid) {
      setRunEffect(true);
      getProfiles();
    }
  }, [user, runEffect]);

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
          country: document.getElementById('select-my-details-country'),
          image_path: document.getElementById('preview-my-details-image'),
        },
      },
    };

    return inputElements;
  };

  const getProfiles = async () => {
    setSummary({
      ...summary,
      isCalling: true,
    });

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('uuid', user?.uuid)
      .single();

    if (error) {
      setSummary({
        ...summary,
        isCalling: false,
      });
      toast.error(error.message);
      return;
    }

    var element = elementList().profile.elements;
    var mapData = data;

    mapViewElements({
      source: mapData,
      target: element,
      viewOnly: false,
    });

    setSummary({
      ...summary,
      isCalling: false,
    });
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
      .eq('uuid', user?.uuid)
      .select()
      .single();

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
      userId: user?.uuid,
      returnData,
      directory,
      imageInput,
      dataBase: 'profiles',
      isUpdateByReturnId: false,
    });

    toast.success('Saved successfully! reloading...');

    setSummary({
      ...summary,
      isSaving: false,
    });

    if (isModal) {
      $('#profile-modal')?.modal('hide');
    }

    setTimeout(() => {
      router.reload();
    }, 1500);
  };

  const checkView = ({ labelDiv1, inputDiv1, labelDiv2, inputDiv2 }) => {
    if (isModal) {
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

  return (
    <>
      <form
        class="mt-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitForm();
        }}
      >
        {isModal ? (
          ''
        ) : (
          <div class="row mb-4">
            <div class="col-lg">
              <div class="smpl_text-sm-semibold">
                Profile <Loading loading={summary.isCalling} />
              </div>
              <div class="smpl_text-sm-regular">
                Update your personal data here
              </div>
            </div>
            <div class="col text-end mt-md-0 mt-3">
              <button type="submit" class="btn btn-primary btn-lg btn-text">
                <Loading title="Save" loading={summary.isSaving} />
              </button>
            </div>
          </div>
        )}
        <div class="row mb-4">
          <div class="col-lg">
            <label class="uui-field-label">Your photo</label>
            <small class="smpl_text-sm-regular">
              This will be displayed on your profile.
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
                let imageURL = URL.createObjectURL(event.target.files[0]);
                setSelectedImage({
                  data: event.target.files[0],
                  url: imageURL,
                });
              }}
            />
          </div>
        </div>

        {checkView({
          labelDiv1: (
            <label for="input-my-details-username" class="uui-field-label">
              Username
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
            <label for="input-my-details-nric-name" class="uui-field-label">
              Name (As Per NRIC)
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
            <label for="input-my-details-nric-no" class="uui-field-label">
              NRIC
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
            <label for="input-my-details-dob" class="uui-field-label">
              Date of Birth
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
            <label for="input-my-details-email" class="uui-field-label">
              Email
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
            <label for="input-my-details-phone-no" class="uui-field-label">
              Contact
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
            <label for="select-my-details-religion" class="uui-field-label">
              Religion
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
                  {item.name}
                </option>
              ))}
            </select>
          ),
          labelDiv2: (
            <label
              for="select-my-details-marital-status"
              class="uui-field-label"
            >
              Marital Status
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
                  {item.name}
                </option>
              ))}
            </select>
          ),
        })}

        <div class="row align-items-start">
          <div class="col-lg">
            <label for="input-my-details-address-1" class="uui-field-label">
              Address
            </label>
          </div>
          <div class={isModal ? 'mt-2' : 'col'}>
            <input
              type="text"
              class="form-control"
              id="input-my-details-address-1"
              required
              placeholder="Address 1"
            />
            <input
              type="text"
              class="form-control mt-2"
              id="input-my-details-address-2"
              placeholder="Address 2"
            />
            <input
              type="text"
              class="form-control mt-2"
              id="input-my-details-city"
              required
              placeholder="City"
            />
            <input
              type="text"
              class="form-control mt-2"
              id="input-my-details-postcode"
              required
              placeholder="Postcode"
            />
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
        {isModal ? (
          <div class="d-grid gap-2 mt-5">
            <button type="submit" class="btn btn-primary btn-lg btn-text">
              <Loading title="Save" loading={summary.isSaving} />
            </button>
          </div>
        ) : (
          ''
        )}
      </form>
    </>
  );
};

export default MyDetails;
