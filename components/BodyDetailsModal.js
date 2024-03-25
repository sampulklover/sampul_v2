import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import toast from 'react-hot-toast';
import { bodiesCategory, trueFalse } from '../constant/enum';
import { mapViewElements } from '../utils/helpers';

const BodyDetailsModal = ({ selectedBody, refreshFunction }) => {
  const [isLoading, setIsLoading] = useState({
    update: false,
    delete: false,
  });

  const elementList = () => {
    const inputElements = {
      body_details: {
        elements: {
          name: document.getElementById('input-body-name'),
          website_url: document.getElementById('input-body-website-url'),
          category: document.getElementById('select-body-category'),
          active: document.getElementById('select-body-active'),
          icon: document.getElementById('input-body-icon'),
        },
      },
    };

    return inputElements;
  };

  const onSubmitBodyDetails = async (event) => {
    event.preventDefault();

    setIsLoading({
      ...isLoading,
      update: true,
    });

    const addData = {};

    for (const key in elementList().body_details.elements) {
      if (key !== 'image_path') {
        addData[key] = elementList().body_details.elements[key].value;
      }
    }

    if (selectedBody) {
      addData.id = selectedBody.id;
    }

    const { data, error } = await supabase
      .from('bodies')
      .upsert([{ ...addData }], {
        onConflict: ['id'],
      });

    if (error) {
      setIsLoading({
        ...isLoading,
        update: false,
      });
      toast.error(error.message);
      return;
    }

    try {
      $('#body-details-modal')?.modal('hide');
    } catch (error) {
      toast.error('Something went wrong, please try again');
    }

    refreshFunction();
    toast.success('Save!');

    setIsLoading({
      ...isLoading,
      update: false,
    });
  };

  useEffect(() => {
    if (selectedBody) {
      var element = elementList().body_details.elements;
      var mapData = selectedBody;

      mapViewElements({
        source: mapData,
        target: element,
        viewOnly: false,
      });
    }
  }, [selectedBody]);

  return (
    <div class="modal fade" id="body-details-modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Body Details</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="modal-header-2">
              <div class="content-32">
                <img
                  loading="lazy"
                  src={
                    selectedBody?.icon
                      ? `data:image/svg+xml,${encodeURIComponent(
                          selectedBody.icon
                        )}`
                      : '/images/Displacement-p-500.png'
                  }
                  alt=""
                  class="avatar-8"
                />
                <div class="text-and-supporting-text-18">
                  <div class="text-lg-semibold-4">{selectedBody?.username}</div>
                  <div class="text-sm-regular-6">{selectedBody?.email}</div>
                </div>
              </div>
              <div class="padding-bottom-3"></div>
            </div>

            <form onSubmit={onSubmitBodyDetails}>
              <div class="mb-3">
                <div class="form-field-wrapper">
                  <label htmlFor="input-body-name" class="uui-field-label">
                    Name
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="input-body-name"
                    required
                  />
                </div>
              </div>
              <div class="mb-3">
                <div class="form-field-wrapper">
                  <label
                    htmlFor="input-body-website-url"
                    class="uui-field-label"
                  >
                    Website URL
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="input-body-website-url"
                    required
                  />
                </div>
              </div>
              <div class="mb-3">
                <div class="form-field-wrapper">
                  <label htmlFor="select-body-category" class="uui-field-label">
                    Category
                  </label>
                  <select
                    id={`select-body-category`}
                    required
                    class="form-select"
                  >
                    {bodiesCategory().map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <div class="form-field-wrapper">
                  <label htmlFor="input-body-icon" class="uui-field-label">
                    Icon (SVG)
                  </label>
                  <textarea class="form-control" id="input-body-icon" />
                </div>
              </div>
              <div class="mb-3">
                <div class="form-field-wrapper">
                  <label htmlFor="select-body-active" class="uui-field-label">
                    Active
                  </label>
                  <select id={`select-body-active`} class="form-select">
                    {trueFalse().map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div class="d-grid gap-2 mt-5">
                <button type="submit" class="btn btn-primary btn-text">
                  <Loading title="Save" loading={isLoading.update} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyDetailsModal;
