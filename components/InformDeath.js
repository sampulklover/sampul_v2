import Link from 'next/link';
import Loading from './Laoding';
import { addUserImg, emptyUserImg } from '../constant/element';
import { countries, maritalStatus, religions } from '../constant/enum';
import { useUser } from '../context/user';
import { supabase } from '../utils/supabase';
import { useEffect, useState } from 'react';
import {
  mapViewElements,
  processForm,
  replaceOrAddImage,
} from '../utils/helpers';
import toast from 'react-hot-toast';

const InformDeath = () => {
  const { user, isLoading } = useUser();
  const [runEffect, setRunEffect] = useState(false);
  const [summary, setSummary] = useState({
    isCalling: false,
    isSaving: false,
  });
  const [belovedList, setBelovedList] = useState({
    data: [],
    isCalling: false,
  });
  const [selectedImage, setSelectedImage] = useState({
    data: null,
    url: addUserImg,
    deleted: false,
  });

  useEffect(() => {
    if (!runEffect && user?.uuid) {
      setRunEffect(true);
      getBeloved();
    }
  }, [user, runEffect]);

  const elementList = () => {
    const inputElements = {
      inform_death: {
        elements: {
          beloved_id: document.getElementById('select-inform-death-beloved'),
          nric_name: document.getElementById('input-inform-death-nric-name'),
          nric_no: document.getElementById('input-inform-death-nric-no'),
          certification: document.getElementById(
            'input-inform-death-certification'
          ),
          phone_no: document.getElementById('input-inform-death-phone-no'),
          email: document.getElementById('input-inform-death-email'),
          address_1: document.getElementById('input-inform-death-address-1'),
          address_2: document.getElementById('input-inform-death-address-2'),
          city: document.getElementById('input-inform-death-city'),
          postcode: document.getElementById('input-inform-death-postcode'),
          country: document.getElementById('select-inform-death-country'),
          image_path: document.getElementById('preview-inform-death-image'),
        },
      },
    };

    return inputElements;
  };

  const getBeloved = async () => {
    setBelovedList({
      data: [],
      isCalling: true,
    });

    const { data, error } = await supabase
      .from('beloved')
      .select('*')
      .eq('uuid', user?.uuid)
      .order('created_at', { ascending: false });

    if (error) {
      setBelovedList({
        data: [],
        isCalling: false,
      });
      toast.error(error.message);
      return;
    }

    const modifiedData = data.map((item) => ({
      value: item.id,
      name: item.nric_name,
    }));

    setBelovedList({
      data: modifiedData,
      isCalling: false,
    });

    getInformDeath();
  };

  const getInformDeath = async () => {
    setSummary({
      ...summary,
      isCalling: true,
    });

    const { data, error } = await supabase
      .from('inform_death')
      .select('*')
      .eq('uuid', user?.uuid);

    if (error) {
      setSummary({
        ...summary,
        isCalling: false,
      });
      toast.error(error.message);
      return;
    }

    if (data.length !== 0) {
      var element = elementList().inform_death.elements;
      var mapData = data[0];

      mapViewElements({
        source: mapData,
        target: element,
        viewOnly: false,
      });
    }

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

    const { data: checkExist, error: errorCheckExist } = await supabase
      .from('inform_death')
      .select('*')
      .eq('uuid', user?.uuid);

    if (errorCheckExist) {
      toast.error(errorCheckExist.message);
      setSummary({
        ...summary,
        isSaving: false,
      });
      return;
    }

    const addData = processForm(elementList().inform_death.elements, false);

    var action = checkExist.length == 0 ? 'insert' : 'update';
    let query = supabase.from('inform_death');

    switch (action) {
      case 'update':
        query = query.update(addData).eq('uuid', user?.uuid).select().single();
        break;
      case 'insert':
        query = query
          .upsert({ uuid: user?.uuid, ...addData })
          .select()
          .single();
        break;
      default:
        throw new Error('Invalid operation');
    }

    const { data: returnData, error } = await query;

    if (error) {
      toast.error(error.message);
      setSummary({
        ...summary,
        isSaving: false,
      });
      return;
    }

    const directory = `/avatar/inform_death/`;
    const imageInput = document.getElementById('input-inform-death-image');

    await replaceOrAddImage({
      userId: user?.uuid,
      returnData,
      directory,
      imageInput,
      dataBase: 'inform_death',
      isUpdateByReturnId: false,
      deleted: selectedImage.deleted,
    });

    toast.success('Saved successfully!');

    setSummary({
      ...summary,
      isSaving: false,
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file.type.startsWith('image/')) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage({
        data: file,
        url: imageURL,
        deleted: false,
      });
      updateImageInput(file);
    }
  };

  function updateImageInput(file) {
    const imageInput = document.getElementById('input-inform-death-image');
    const newFile = new File([file], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });
    const fileList = new DataTransfer();
    fileList.items.add(newFile);
    imageInput.files = fileList.files;
  }

  const handleDragOver = (event) => {
    event.preventDefault();
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
        <div class="row mb-4">
          <div class="col-lg">
            <div class="smpl_text-sm-semibold">
              Death of Sampul Owner
              <Loading loading={summary.isCalling} />
            </div>
            <div class="smpl_text-sm-regular">
              Inform and update your co-sampul owner information
            </div>
          </div>
          <div class="col text-end">
            <button type="submit" class="btn btn-primary btn-lg btn-text">
              <Loading title="Save" loading={summary.isSaving} />
            </button>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-lg">
            <label for="select-inform-death-beloved" class="uui-field-label">
              Co-Sampul <Loading loading={belovedList.isCalling} />
            </label>
          </div>
          <div class="col">
            <select
              id="select-inform-death-beloved"
              class="form-select"
              required
            >
              {belovedList.data.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-lg">
            <label for="input-inform-death-nric-name" class="uui-field-label">
              Co-Sampul Name (As Per NRIC)
            </label>
          </div>
          <div class="col">
            <input
              type="text"
              class="form-control"
              id="input-inform-death-nric-name"
              required
            />
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-lg">
            <label for="input-inform-death-nric-no" class="uui-field-label">
              Co-Sampul NRIC
            </label>
          </div>
          <div class="col">
            <input
              type="text"
              class="form-control"
              id="input-inform-death-nric-no"
              required
            />
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-lg">
            <label class="uui-field-label">Image verification</label>
          </div>
          <div
            class="col text-end"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <span
              type="button"
              onClick={() => {
                setSelectedImage({
                  ...selectedImage,
                  url: addUserImg,
                  deleted: true,
                });
                document.getElementById('preview-inform-death-image').src =
                  addUserImg;
              }}
            >
              <i class="bi bi-x"></i>
            </span>
            <img
              loading="lazy"
              src={selectedImage.url}
              alt=""
              class="img-thumbnail"
              id="preview-inform-death-image"
              onClick={() => {
                document.getElementById('input-inform-death-image').click();
              }}
            />
            <input
              type="file"
              id="input-inform-death-image"
              name=""
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(event) => {
                let imageURL = URL.createObjectURL(event.target.files[0]);
                setSelectedImage({
                  data: event.target.files[0],
                  url: imageURL,
                  deleted: false,
                });
              }}
            />
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-lg">
            <label
              for="input-inform-death-certification"
              class="uui-field-label"
            >
              Death Certification
            </label>
          </div>
          <div class="col">
            <input
              type="text"
              class="form-control"
              id="input-inform-death-certification"
              required
            />
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-lg">
            <label for="input-inform-death-phone-no" class="uui-field-label">
              Co-Sampul Contact
            </label>
          </div>
          <div class="col">
            <input
              type="text"
              class="form-control"
              id="input-inform-death-phone-no"
              required
            />
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-lg">
            <label for="input-inform-death-email" class="uui-field-label">
              Co-Sampul Email
            </label>
          </div>
          <div class="col">
            <input
              type="email"
              class="form-control"
              id="input-inform-death-email"
              required
            />
          </div>
        </div>
        <div class="row mt-5 align-items-start">
          <div class="col-lg">
            <label for="input-inform-death-address-1" class="uui-field-label">
              Co-Sampul Mailing Address
            </label>
          </div>
          <div class="col">
            <input
              type="text"
              class="form-control"
              id="input-inform-death-address-1"
              required
              placeholder="Address 1"
            />
            <input
              type="text"
              class="form-control mt-2"
              id="input-inform-death-address-2"
              placeholder="Address 2"
            />
            <input
              type="text"
              class="form-control mt-2"
              id="input-inform-death-city"
              required
              placeholder="City"
            />
            <input
              type="text"
              class="form-control mt-2"
              id="input-inform-death-postcode"
              required
              placeholder="Postcode"
            />
            <select
              id="select-inform-death-country"
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
      </form>
    </>
  );
};

export default InformDeath;