import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/nextjs';

const BelovedInvites = () => {
  const router = useRouter();

  const [summary, setSummary] = useState({
    data: null,
    isReady: false,
    statusKey: 'loading',
  });

  const updateInviteRequest = async () => {
    setSummary({
      data: null,
      isReady: true,
      statusKey: 'loading',
    });

    const belovedUUID = router.query.id;
    const requestStatus = router.query.status;

    if (belovedUUID && requestStatus) {
      try {
        const response = await fetch('/api/beloved/status-invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            invite_uuid: belovedUUID,
            invite_status: requestStatus,
          }),
        });

        if (!response.ok) {
          toast.error('Something went wrong!');
          setSummary({
            data: null,
            isReady: true,
            statusKey: 'error',
          });
          return;
        }

        toast.success('Completed!');
        setSummary({
          data: null,
          isReady: true,
          statusKey: 'done',
        });
      } catch (error) {
        toast.error(error.message);
        setSummary({
          data: null,
          isReady: true,
          statusKey: 'error',
        });
        Sentry.captureException(error);
      }
    } else {
      toast.error('Something went wrong!');
      setSummary({
        data: null,
        isReady: true,
        statusKey: 'error',
      });
    }
  };

  useEffect(() => {
    if (router.isReady) {
      setTimeout(() => {
        updateInviteRequest();
      }, 1000); // wait for the toast to innitiate
    }
  }, [router.isReady]);

  const checkRequest = () => {
    const requestStatus = router.query.status;
    var status = {
      past_tense: '',
      present_tense: '',
    };

    if (requestStatus) {
      if (requestStatus == 'accepted') {
        status = {
          past_tense: 'Accepted!',
          present_tense: 'accept',
        };
      }
      if (requestStatus == 'rejected') {
        status = {
          past_tense: 'Rejected!',
          present_tense: 'reject',
        };
      }
    }

    return status;
  };

  const keyType = {
    loading: {
      title: 'Processing your request...',
      subtitle:
        ' We are currently processing your request. Please wait a moment while we update our systems.',
      icon: (
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      ),
    },
    done: {
      title: `${checkRequest().past_tense}`,
      subtitle: `Thank you for letting us know about your decision. Your request to
        ${
          checkRequest().present_tense
        } the offer has been successfully processed.`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="green"
          class="bi bi-check2-circle"
          viewBox="0 0 16 16"
        >
          <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
          <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
        </svg>
      ),
    },
    error: {
      title: 'Oops! Something Went Wrong',
      subtitle: `It seems that an error occurred while processing your request.`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="red"
          class="bi bi-exclamation-circle"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
        </svg>
      ),
    },
  };

  const title = () => {
    return (
      <>
        <div class="empty-data-card p-5">
          <div class="content-67">
            <div class="text-and-supporting-text-32">
              {keyType[summary.statusKey].icon}
              <div class="smpl_display-sm-semibold mt-3">
                {keyType[summary.statusKey].title}
              </div>
              <div class="smpl_text-md-regular">
                {keyType[summary.statusKey].subtitle}
              </div>
            </div>
          </div>
          <div class="mt-4">
            <Link href="/">
              <button type="button" class="btn btn-primary btn-text">
                <span>Visit Sampul</span>
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  };

  return (
    <div class="body">
      <div class="content">
        <div class="mt-4">{title()}</div>
      </div>
      <Footer />
    </div>
  );
};

export default BelovedInvites;
