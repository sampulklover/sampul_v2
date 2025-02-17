import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import OnboardTrust from '../pages/onboard-trust';
import TrustCertificate from '../pages/trust-certificate';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

const TrustModal = () => {
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const trustType = tempData.trust.key ? tempData.trust.key : 'add';

  const handleClose = () => {
    toggleModal('trust');
    setValueTempData('trust', {
      ...tempData.trust,
      key: 'add',
      selectedItem: null,
    });
  };

  const formContainerConfig = {
    add: (
      <div>
        <OnboardTrust handleClose={handleClose} />
      </div>
    ),
    edit: (
      <div>
        <OnboardTrust handleClose={handleClose} />
      </div>
    ),
    view: (
      <div>
        <TrustCertificate handleClose={handleClose} />
      </div>
    ),
  };

  const viewConfig = {
    add: {
      modalTitle: 'Create New Trust',
      body: formContainerConfig.add,
    },
    edit: {
      modalTitle: 'Edit Trust',
      body: formContainerConfig.edit,
    },
    view: {
      modalTitle: 'View Trust',
      body: formContainerConfig.view,
    },
  };

  return (
    <Modal
      show={isModalOpen.trust}
      onHide={handleClose}
      class="modal-dialog"
      fullscreen
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h5 class="modal-title">{viewConfig[trustType]?.modalTitle}</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body class="p-0 bg-white">
        <div>{viewConfig[trustType]?.body}</div>
      </Modal.Body>
    </Modal>
  );
};

export default TrustModal;
