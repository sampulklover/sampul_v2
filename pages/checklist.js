import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';
import InnerHeader from '../components/InnerHeader';
import Loading from '../components/Laoding';
import SideBar from '../components/SideBar';
import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import { getOptionLabelWithIcon } from '../utils/helpers';
import { supabase } from '../utils/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';

const Checklist = () => {
  const { contextApiData, addBulkAftercare } = useApi();
  const { locale } = useLocale();
  const router = useRouter();
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (contextApiData.aftercare.data) {
      setItems(contextApiData.aftercare.data);
    }
  }, [contextApiData.aftercare.data]);

  useEffect(() => {
    if (contextApiData.profile.data) {
      if (contextApiData.profile.data.is_aftercare_onboard == false) {
        addBulkAftercare();
      }
    }
  }, [contextApiData.profile.data]);

  const onUpdateCompleted = async (taskId, completeStatus) => {
    const { data, error } = await supabase
      .from('aftercare')
      .update({
        is_completed: completeStatus,
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      toast.error(error.message);
    }
  };

  const onUpdatePinned = async (taskId, pinStatus) => {
    const { data, error } = await supabase
      .from('aftercare')
      .update({
        is_pinned: pinStatus,
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      toast.error(error.message);
    }
  };

  const toggleCompletion = (task) => {
    setItems(
      items.map((item) =>
        item.id === task.id
          ? { ...item, is_completed: !item.is_completed }
          : item
      )
    );
    onUpdateCompleted(task.id, !task.is_completed);
  };

  const togglePin = (task) => {
    setItems(
      items.map((item) =>
        item.id === task.id ? { ...item, is_pinned: !item.is_pinned } : item
      )
    );

    onUpdatePinned(task.id, !task.is_pinned);
  };

  const pinnedItems = items.filter((item) => item.is_pinned);
  const unpinnedItems = items.filter((item) => !item.is_pinned);

  const onEditItem = (item) => {
    setValueTempData('aftercare', {
      ...tempData.aftercare,
      key: 'edit',
      selectedItem: item,
    });
    toggleModal('aftercare');
  };

  const itemCard = (item) => {
    return (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          style={{
            textDecoration: item.is_completed ? 'line-through' : 'none',
          }}
          class="pointer-on-hover"
          onClick={() => {
            onEditItem(item);
          }}
        >
          {item.task}
        </span>
        <div>
          <button
            className={`btn ${
              item.is_completed ? 'btn-primary' : 'btn-light'
            } me-2 rounded-circle`}
            onClick={() => toggleCompletion(item)}
          >
            <Image
              src={
                item.is_completed
                  ? 'images/check-purple.svg'
                  : 'images/check.svg'
              }
              alt="image"
              width={15}
              height={15}
            />
          </button>
          <button
            className={`btn ${
              item.is_pinned ? 'btn-primary' : 'btn-light'
            } rounded-circle`}
            onClick={() => togglePin(item)}
          >
            <Image
              src={item.is_pinned ? 'images/pin-purple.svg' : 'images/pin.svg'}
              alt="image"
              width={15}
              height={15}
            />
          </button>
        </div>
      </li>
    );
  };

  return (
    <SideBar>
      <div class="body-01 inner-body-01">
        <div class="content">
          <Breadcrumb
            pageName={translations[locale].aftercare.aftercare_checklist}
          />
          <InnerHeader
            title={translations[locale].aftercare.take_the_first_}
            subtitle={translations[locale].aftercare.losing_a_loved_}
            imageSrc="images/Post_it.svg"
          />
          <div>
            <button
              type="button"
              class="btn btn-primary btn-text"
              onClick={() => {
                toggleModal('aftercare');
              }}
            >
              <div class="d-flex">
                <Image
                  src={'images/plus.svg'}
                  alt="image"
                  width={24}
                  height={24}
                />
                <span class="ms-2">
                  {translations[locale].aftercare.add_a_new_}
                </span>
              </div>
            </button>
          </div>
          <div class="row mt-4">
            {pinnedItems.length > 0 ? (
              <>
                <ul className="list-group mb-3">
                  {pinnedItems.length > 0 ? (
                    pinnedItems.map((item, index) => (
                      <div key={index}>{itemCard(item)}</div>
                    ))
                  ) : (
                    <li className="list-group-item">No pinned items</li>
                  )}
                </ul>
              </>
            ) : (
              ''
            )}
            <ul className="list-group">
              {unpinnedItems.map((item, index) => (
                <div key={index}>{itemCard(item)}</div>
              ))}
            </ul>
          </div>
        </div>
        <Footer />
      </div>
    </SideBar>
  );
};

export default Checklist;

// The summary of this page includes:
// This page allows users to customize their digital estate plans with specific religious obligations and charitable intentions.
// It integrates features like Nazar/Kaffarah vows fulfillment, Fidyah obligations for missed fasts, and contributions to charity (Sadaqah).
// Users can also allocate assets to Waqf foundations for enduring charitable impact.
// Additionally, there's an option to pledge as an organ donor.
// Each section includes forms for inputting details and options to save changes.
// Access to certain features may require upgrading the user's plan.
