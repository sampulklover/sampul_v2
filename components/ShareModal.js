import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useUser } from '../context/user';
import Loading from './Laoding';
import toast from 'react-hot-toast';
import {
  belovedLevel,
  beneficiaryTypes,
  relationships,
} from '../constant/enum';
import { deleteImage, replaceOrAddImage } from '../utils/helpers';
import { addUserImg } from '../constant/element';

const ShareModal = ({ url, title }) => {
  const facebookShare = () => {
    window.open(
      'https://www.facebook.com/sharer/sharer.php?u=' +
        encodeURIComponent(url) +
        '&title=' +
        encodeURIComponent(title),
      '_blank'
    );
  };

  const twitterShare = () => {
    window.open(
      'https://twitter.com/intent/tweet?url=' +
        encodeURIComponent(url) +
        '&text=' +
        encodeURIComponent(title),
      '_blank'
    );
  };

  const linkedInShare = () => {
    window.open(
      'https://www.linkedin.com/shareArticle?url=' +
        encodeURIComponent(url) +
        '&title=' +
        encodeURIComponent(title),
      '_blank'
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div class="modal fade" id="share-modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Share Certificate</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <ul class="list-group ">
              <li class="list-group-item">
                <div class="d-grid gap-2">
                  <button
                    type="button"
                    class="btn btn-primary btn-text btn-lg"
                    onClick={() => {
                      facebookShare();
                    }}
                  >
                    <span>Share on Facebook</span>
                  </button>
                </div>
              </li>
              <li class="list-group-item">
                <div class="d-grid gap-2">
                  <button
                    class="btn btn-primary btn-text btn-lg"
                    id="share-twitter-btn"
                    onClick={() => {
                      twitterShare();
                    }}
                  >
                    <span>Share on Twitter</span>
                  </button>
                </div>
              </li>
              <li class="list-group-item">
                <div class="d-grid gap-2">
                  <button
                    class="btn btn-primary btn-text btn-lg"
                    onClick={() => {
                      linkedInShare();
                    }}
                  >
                    <span>Share on LinkedIn</span>
                  </button>
                </div>
              </li>
              <li class="list-group-item">
                <div class="d-grid gap-2">
                  <button
                    class="btn btn-primary btn-text btn-lg"
                    onClick={() => {
                      copyLink();
                    }}
                  >
                    <span>Copy Link</span>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
