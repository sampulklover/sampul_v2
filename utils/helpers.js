import toast from 'react-hot-toast';
import { bucketName } from '../constant/element';
import { supabase } from './supabase';

export const formatTimestamp = (
  timestamp,
  options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', options);
};

export const mapViewElements = ({ source, target, viewOnly = true }) => {
  const targetProperty = viewOnly ? 'innerText' : 'value';

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object') {
        for (const nestedKey in source[key]) {
          if (target[nestedKey]) {
            if (nestedKey == 'last_updated') {
              target[nestedKey][targetProperty] = formatTimestamp(
                source[key][nestedKey]
              );
            } else {
              target[nestedKey][targetProperty] = source[key][nestedKey];
            }
          }
        }
      } else if (target[key]) {
        if (key == 'last_updated') {
          if (targetProperty == 'value') {
            target[key].value = source[key];
          } else {
            target[key].innerText = formatTimestamp(source[key]);
          }
        } else if (target[key].tagName === 'IMG') {
          target[
            key
          ].src = `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${source[key]}`;
        } else {
          target[key][targetProperty] = source[key];
        }
      }
    }
  }
};

export const replaceOrAddImage = async (options) => {
  const {
    userId,
    returnData,
    directory,
    imageInput,
    dataBase,
    isUpdateByReturnId = false,
    deleted = false,
  } = options;

  if (deleted) {
    await deleteImage({
      returnData,
      dataBase,
      userId,
    });
    return;
  }

  if (imageInput?.files.length > 0) {
    await deleteImage({
      returnData,
      dataBase,
      userId,
    });

    const file = imageInput.files[0];
    const imagePath = userId + directory + file.name;

    const { data: uploadedImage, error } = await supabase.storage
      .from(bucketName)
      .upload(imagePath, file);

    if (error) {
      toast.error(error.message);
      return;
    } else {
      let query = supabase.from(dataBase);

      if (isUpdateByReturnId) {
        query = query
          .update({
            image_path: uploadedImage.path,
          })
          .eq('uuid', userId)
          .eq('id', returnData.id);
      } else {
        query = query
          .update({
            image_path: uploadedImage.path,
          })
          .eq('uuid', userId);
      }

      const { data, error } = await query;

      if (error) {
        toast.error(error.message);
        return;
      }
    }
  }
};

export const deleteImage = async (options) => {
  var isSuccess = false;

  const { returnData, dataBase, userId } = options;
  if (returnData?.image_path) {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([returnData.image_path]);

    if (error) {
      toast.error(error.message);
      isSuccess = false;
      return;
    }

    const { data: data2, error: error2 } = await supabase
      .from(dataBase)
      .update({
        image_path: null,
      })
      .eq('uuid', userId)
      .eq('id', returnData.id);

    if (error2) {
      toast.error(error2.message);
      isSuccess = false;
      return;
    }

    isSuccess = true;
  }

  return isSuccess;
};

export const processForm = (elements, clearFields = false) => {
  const addData = {};

  if (clearFields) {
    for (const key in elements) {
      if (key !== 'image_path') {
        elements[key].value = '';
      }
    }
  } else {
    for (const key in elements) {
      if (key !== 'image_path') {
        addData[key] = elements[key].value;
      }
    }
  }

  return addData;
};
