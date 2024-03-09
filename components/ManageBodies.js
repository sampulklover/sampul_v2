import Link from 'next/link';
import Loading from './Laoding';
import { addUserImg, emptyUserImg } from '../constant/element';
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
import BodyDetailsModal from './BodyDetailsModal';

const ManageBodies = ({ isModal = false }) => {
  const { user } = useUser();
  const router = useRouter();
  const [runEffect, setRunEffect] = useState(false);
  const [summary, setSummary] = useState({
    data: [],
    isReady: false,
  });
  const [selectedBody, setSelectedBody] = useState({
    bodyDetails: null,
  });

  useEffect(() => {
    if (!runEffect && user?.uuid) {
      setRunEffect(true);
      getBodies();
    }
  }, [user, runEffect]);

  const getBodies = async () => {
    setSummary({
      ...summary,
      isReady: false,
    });

    const { data, error } = await supabase.from('bodies').select('*');

    if (error) {
      setSummary({
        ...summary,
        isReady: true,
      });
      toast.error(error.message);
      return;
    }

    setSummary({
      ...summary,
      data: data,
      isReady: false,
    });
  };

  const openBodyModal = (item) => {
    setSelectedBody({
      ...selectedBody,
      bodyDetails: item,
    });

    try {
      $('#body-details-modal')?.modal('show');
    } catch (error) {
      toast.error('Something went wrong, please try again');
    }
  };

  return (
    <div class="mt-3">
      <BodyDetailsModal
        selectedBody={selectedBody.bodyDetails}
        refreshFunction={getBodies}
      />
      <div class="table-responsive" style={{ width: '100%' }}>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">
                <small class="smpl_text-xs-medium">Body</small>
              </th>
            </tr>
          </thead>
          <tbody>
            {summary?.data.map((item, index) => {
              return (
                <tr
                  key={index}
                  onClick={() => {
                    openBodyModal(item);
                  }}
                >
                  <td>
                    <div class="custom-table-cell">
                      <img
                        loading="lazy"
                        src={
                          item?.icon
                            ? `data:image/svg+xml,${encodeURIComponent(
                                item.icon
                              )}`
                            : '/images/Displacement-p-500.png'
                        }
                        alt=""
                        class="avatar-8"
                      />
                      <div>
                        <div class="smpl_text-sm-medium crop-text">
                          {item.name}
                        </div>
                        <div class="smpl_text-sm-regular crop-text">
                          {item.category}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBodies;
