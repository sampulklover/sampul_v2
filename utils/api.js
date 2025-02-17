import { supabase } from './supabase';
import toast from 'react-hot-toast';

export const getUserApi = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status == 403) {
      toast.error('Please sign in again to continue');
    } else {
      toast.error(error.message);
    }
  }
};

export const getProfileApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('uuid', postData.uuid)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getRoleApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('uuid', postData.uuid)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getAccountApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*, products (*)')
      .eq('uuid', postData.uuid)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getBodiesApi = async () => {
  try {
    const { data, error } = await supabase
      .from('bodies')
      .select('*')
      .eq('active', true);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getDigitalAssetsApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('digital_assets')
      .select('*')
      .eq('uuid', postData.uuid)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getBelovedApi = async (postData) => {
  try {
    const response = await fetch('/api/beloved/all-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uuid: postData.uuid,
      }),
    });

    if (!response.ok) {
      throw error;
    }

    const { data } = await response.json();

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getInvitesApi = async (postData) => {
  try {
    const response = await fetch('/api/beloved/invite-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: postData.email,
      }),
    });

    if (!response.ok) {
      throw error;
    }

    const { data } = await response.json();

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getExtraWishesApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('extra_wishes')
      .select('*')
      .eq('uuid', postData.uuid);

    if (error) {
      throw error;
    }

    return data.length > 0 ? data[0] : null;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getWillApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('wills')
      .select(`*, profiles ( * )`)
      .eq('uuid', postData.uuid);

    if (error) {
      throw error;
    }

    return data.length > 0 ? data[0] : null;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getInformDeathApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('inform_death')
      .select('*')
      .eq('uuid', postData.uuid);

    if (error) {
      throw error;
    }

    return data.length > 0 ? data[0] : null;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getAftercareApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('aftercare')
      .select('*')
      .eq('uuid', postData.uuid)
      .order('id', { ascending: false });

    if (error) {
      throw error;
    }

    return data.length > 0 ? data : [];
  } catch (error) {
    toast.error(error.message);
  }
};

export const addBulkAftercareApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('aftercare')
      .insert(postData.bulkData)
      .select('*')
      .eq('uuid', postData.uuid)
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    return data.length > 0 ? data : null;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getDiditAuthApi = async (postData) => {
  try {
    const response = await fetch('/api/didit/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: null,
      }),
    });

    if (!response.ok) {
      throw error;
    }

    const { data } = await response.json();

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getDiditSessionApi = async (postData) => {
  try {
    const response = await fetch('/api/didit/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: postData.access_token,
        vendor_data: postData.uuid,
      }),
    });

    if (!response.ok) {
      throw error;
    }

    const { data } = await response.json();

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getAllTrustApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('trust')
      .select(
        `*, trust_beneficiary ( * ), trust_charity ( * ), trust_payment ( * )`
      )
      .eq('uuid', postData.uuid)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getTrustApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('trust')
      .select(
        `*, trust_beneficiary ( * ), trust_charity ( * ), trust_payment ( * )`
      )
      .eq('id', postData.trustId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const addTrustApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('trust')
      .upsert(postData, { onConflict: ['id'] })
      .select(
        `*, trust_beneficiary ( * ), trust_charity ( * ), trust_payment ( * )`
      )
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const deleteTrustApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('trust')
      .delete()
      .eq('id', postData.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const addTrustBeneficiaryApi = async (postData) => {
  try {
    const existingData = postData.trustData.filter((item) => item.id); // Items with an id
    const newData = postData.trustData.filter((item) => !item.id); // Newly added items

    let data = [];

    if (existingData.length > 0) {
      const { data: updatedData, error: updateError } = await supabase
        .from('trust_beneficiary')
        .upsert(existingData, { onConflict: ['id'] })
        .select('*');

      if (updateError) throw updateError;
      data = [...data, ...updatedData];
    }

    if (newData.length > 0) {
      const { data: insertedData, error: insertError } = await supabase
        .from('trust_beneficiary')
        .insert(newData)
        .select('*');

      if (insertError) throw insertError;
      data = [...data, ...insertedData];
    }

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getCharityApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('trust_charity')
      .select('*')
      .eq('uuid', postData.uuid)
      .order('id', { ascending: false });

    if (error) {
      throw error;
    }

    return data.length > 0 ? data : [];
  } catch (error) {
    toast.error(error.message);
  }
};

export const addTrustCharityApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('trust_charity')
      .upsert(postData.trustCharityData, { onConflict: ['id'] })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const deleteTrustCharityApi = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('trust_charity')
      .delete()
      .eq('id', postData.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const addTrustPaymentApi = async (postData) => {
  try {
    let response;

    if (postData.trustPaymentId) {
      response = await supabase
        .from('trust_payment')
        .update(postData.trustPaymentData)
        .eq('id', postData.trustPaymentId)
        .select()
        .single();
    } else {
      response = await supabase
        .from('trust_payment')
        .insert(postData.trustPaymentData)
        .select()
        .single();
    }

    const { data, error } = response;

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    toast.error(error.message);
  }
};
