import Link from 'next/link';
import Loading from './Laoding';
import { addFileImg, emptyUserImg } from '../constant/element';
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
import { useApi } from '../context/api';

const InformDeath = () => {
  const { user } = useUser();
  const { contextApiData, getInformDeath } = useApi();

  const [summary, setSummary] = useState({
    isCalling: false,
    isSaving: false,
  });

  const [selectedImage, setSelectedImage] = useState({
    data: null,
    url: addFileImg,
    deleted: false,
    current_file_url: '',
  });

  useEffect(() => {
    if (contextApiData.informDeath.data !== null) {
      var element = elementList().inform_death.elements;
      var mapData = contextApiData.informDeath.data;

      mapViewElements({
        source: mapData,
        target: element,
        viewOnly: false,
      });

      if (mapData.image_path) {
        setSelectedImage({
          ...selectedImage,
          data: null,
          url: addFileImg,
          deleted: false,
          current_file_url: `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${mapData.image_path}`,
        });
      }
    }
  }, [contextApiData.informDeath]);

  const elementList = () => {
    const inputElements = {
      inform_death: {
        elements: {
          invite_user_uuid: document.getElementById(
            'select-inform-death-invite-user-uuid'
          ),
          nric_name: document.getElementById('input-inform-death-nric-name'),
          nric_no: document.getElementById('input-inform-death-nric-no'),
          certification_id: document.getElementById(
            'input-inform-death-certification-id'
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
    if (addData.invite_user_uuid == 'true') {
      toast.error('Co-Sampul is required');
      setSummary({
        ...summary,
        isSaving: false,
      });
      return;
    }

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

    const directory = `/inform_death/certificate/`;
    const imageInput = document.getElementById(
      'input-inform-death-certificate-file'
    );

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

    getInformDeath();
  };

  // const handleDrop = (event) => {
  //   event.preventDefault();
  //   const file = event.dataTransfer.files[0];
  //   // if (file.type.startsWith('image/')) {
  //   const imageURL = URL.createObjectURL(file);
  //   setSelectedImage({
  // ...selectedImage,
  //     data: file,
  //     url: imageURL,
  //     deleted: false,
  //   });
  //   updateImageInput(file);
  //   // }
  // };

  // function updateImageInput(file) {
  //   const imageInput = document.getElementById(
  //     'input-inform-death-certificate-file'
  //   );
  //   const newFile = new File([file], file.name, {
  //     type: file.type,
  //     lastModified: file.lastModified,
  //   });
  //   const fileList = new DataTransfer();
  //   fileList.items.add(newFile);
  //   imageInput.files = fileList.files;
  // }

  // const handleDragOver = (event) => {
  //   event.preventDefault();
  // };

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
          <div class="col text-end mt-md-0 mt-3">
            <button type="submit" class="btn btn-primary btn-lg btn-text">
              <Loading title="Save" loading={summary.isSaving} />
            </button>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-lg">
            <label
              htmlFor="select-inform-death-invite-user-uuid"
              class="uui-field-label"
            >
              Sampul owner's{' '}
              <Loading loading={contextApiData.invites.isLoading} />
            </label>
          </div>
          <div class="col">
            <select
              id="select-inform-death-invite-user-uuid"
              class="form-select"
              onChange={(event) => {
                const selectedValue = event.target.value;
                const selectedData = contextApiData.invites.data?.find(
                  (item) => item.uuid === selectedValue
                );

                if (selectedData) {
                  const formElements = elementList().inform_death.elements;
                  formElements.nric_name.value =
                    selectedData.profiles?.nric_name ?? '';
                  formElements.nric_no.value =
                    selectedData.profiles?.nric_no ?? '';
                }
              }}
              required
            >
              <option disabled selected value>
                -- select an option --
              </option>
              {contextApiData.invites.data?.map((item) => (
                <option key={item.uuid} value={item.uuid}>
                  {item.profiles?.username}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-lg">
            <label
              htmlFor="input-inform-death-nric-name"
              class="uui-field-label"
            >
              Sampul owner's Name (As Per NRIC)
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
            <label htmlFor="input-inform-death-nric-no" class="uui-field-label">
              Sampul owner's NRIC
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

        <div class="row mb-4 align-items-start">
          <div class="col-lg ">
            <label class="uui-field-label">Death Certification</label>
          </div>
          <div
            class="col text-end"
            // onDrop={handleDrop}
            // onDragOver={handleDragOver}
          >
            {/* <span
              type="button"
              onClick={() => {
                setSelectedImage({
                  ...selectedImage,
                  url: addFileImg,
                  deleted: true,
                });
                document.getElementById('preview-inform-death-image').src =
                  addFileImg;
              }}
            >
              <i class="bi bi-x"></i>
            </span> */}
            {/* <img
              loading="lazy"
              src={selectedImage.url}
              alt=""
              class="img-thumbnail"
              id="preview-inform-death-image"
              onClick={() => {
                document
                  .getElementById('input-inform-death-certificate-file')
                  .click();
              }}
            /> */}

            <span class="pointer-on-hover d-flex mb-3">
              {selectedImage.current_file_url && selectedImage.data == null ? (
                <>
                  <Link
                    href={selectedImage.current_file_url}
                    target="_blank"
                    class="me-2 text-primary"
                    style={{ 'text-decoration': 'none' }}
                  >
                    <i class="bi bi-file-earmark-check-fill"></i> click to view
                    file
                  </Link>
                  <i
                    class="bi bi-x"
                    onClick={() => {
                      document.getElementById(
                        'input-inform-death-certificate-file'
                      ).value = '';
                      setSelectedImage({
                        ...selectedImage,
                        data: null,
                        url: addFileImg,
                        deleted: true,
                        current_file_url: '',
                      });
                    }}
                  ></i>
                </>
              ) : (
                ''
              )}
            </span>
            <div class="input-group">
              <input
                class="form-control"
                type="file"
                id="input-inform-death-certificate-file"
                accept="application/pdf"
                onChange={(event) => {
                  let imageURL = URL.createObjectURL(event.target.files[0]);
                  setSelectedImage({
                    ...selectedImage,
                    data: event.target.files[0],
                    url: imageURL,
                    deleted: false,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-lg">
            <label
              htmlFor="input-inform-death-certification-id"
              class="uui-field-label"
            >
              Death Certification ID
            </label>
          </div>
          <div class="col">
            <input
              type="text"
              class="form-control"
              id="input-inform-death-certification-id"
              required
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default InformDeath;
