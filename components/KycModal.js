import { addUserImg } from '../constant/element';
import { belovedLevel, beneficiaryTypes, countries } from '../constant/enum';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import { deleteImage, replaceOrAddImage } from '../utils/helpers';
import { supabase } from '../utils/supabase';
import Loading from './Laoding';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { v4 as uuidv4 } from 'uuid';

const KycModal = () => {
  const { contextApiData, getDiditAuth, getDiditSession } = useApi();
  const { locale } = useLocale();
  const router = useRouter();
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const [buttonLoading, setButtonLoading] = useState({
    initiate: false,
  });

  const kycType = 'add';

  const handleClose = () => {
    toggleModal('kyc');
  };

  const formContainerConfig = {
    general: (
      <div>
        <div class="text-center">
          <Image
            src="images/face-id-1.svg"
            alt="image"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '50%', height: '50%' }}
          />
        </div>
        <p>
          To generate your will, please verify your identity. This step is
          essential to ensure the security and accuracy of your document. It
          should take just a few minutes.
        </p>
        <div class="d-grid gap-2">
          <button
            type="button"
            className="btn btn-primary btn-text"
            onClick={async () => {
              try {
                setButtonLoading((prevLoading) => ({
                  ...prevLoading,
                  initiate: true,
                }));

                const diditAuthData = await getDiditAuth();
                if (!diditAuthData) {
                  throw new Error('Authentication failed');
                }

                const diditSessionData = await getDiditSession(diditAuthData);
                if (diditSessionData && diditSessionData.url) {
                  router.push(diditSessionData.url);
                } else {
                  throw new Error('Session data is invalid');
                }
              } catch (error) {
                console.error('Error during authentication:', error);
              } finally {
                setButtonLoading((prevLoading) => ({
                  ...prevLoading,
                  initiate: false,
                }));
              }
            }}
          >
            <Loading
              title="Start Verfication"
              loading={buttonLoading.initiate}
            />
          </button>
        </div>
      </div>
    ),
  };

  const viewConfig = {
    add: {
      modalTitle: 'Verify Your Identity',
      body: formContainerConfig.general,
    },
  };

  return (
    <Modal show={isModalOpen.kyc} onHide={handleClose} class="modal-dialog">
      <Modal.Header closeButton>
        <Modal.Title>
          <h5 class="modal-title">{viewConfig[kycType]?.modalTitle}</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{viewConfig[kycType]?.body}</div>
      </Modal.Body>
    </Modal>
  );
};

export default KycModal;
