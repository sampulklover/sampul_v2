import translations from '../constant/translations';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import OnboardExecutor from '../pages/onboard-executor';
import OnboardTrust from '../pages/onboard-trust';
import TrustCertificate from '../pages/trust-certificate';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

const ExecutorModal = () => {
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const { locale } = useLocale();
  const t = translations[locale].executor;
  const executorType = tempData.executor.key ? tempData.executor.key : 'add';

  const handleClose = () => {
    toggleModal('executor');
    setValueTempData('executor', {
      ...tempData.executor,
      key: 'add',
      selectedItem: null,
    });
  };

  const formContainerConfig = {
    add: (
      <div>
        <OnboardExecutor handleClose={handleClose} />
      </div>
    ),
    edit: (
      <div>
        <OnboardExecutor handleClose={handleClose} />
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
      modalTitle: t.dashboard.create_new,
      body: formContainerConfig.add,
    },
    edit: {
      modalTitle: t.dashboard.edit,
      body: formContainerConfig.edit,
    },
    view: {
      modalTitle: t.dashboard.view_executor,
      body: formContainerConfig.view,
    },
  };

  return (
    <Modal
      show={isModalOpen.executor}
      onHide={handleClose}
      class="modal-dialog"
      fullscreen
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h5 class="modal-title">{viewConfig[executorType]?.modalTitle}</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body class="p-0 bg-white">
        <div>{viewConfig[executorType]?.body}</div>
      </Modal.Body>
    </Modal>
  );
};

export default ExecutorModal;
