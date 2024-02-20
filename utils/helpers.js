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

export const mapViewElements = (source, target) => {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object') {
        for (const nestedKey in source[key]) {
          if (target[nestedKey]) {
            if (nestedKey == 'last_updated') {
              target[nestedKey].innerText = formatTimestamp(
                source[key][nestedKey]
              );
            } else {
              target[nestedKey].innerText = source[key][nestedKey];
            }
          }
        }
      } else if (target[key]) {
        if (key == 'last_updated') {
          target[key].innerText = formatTimestamp(source[key]);
        } else if (target[key].tagName === 'IMG') {
          target[key].src = `${CDNURL}${source[key]}`;
        } else {
          target[key].innerText = source[key];
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
  } = options;

  if (imageInput?.files.length > 0) {
    await deleteImage({
      returnData,
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
  const { returnData } = options;
  if (returnData?.image_path) {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([returnData.image_path]);

    if (error) {
      toast.error(error.message);
    }
  }
};
