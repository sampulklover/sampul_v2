import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';

const IntroModal = () => {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      $('#intro-modal').on('hidden.bs.modal', () => {
        setShowVideo(false);
      });

      return () => {
        $('#intro-modal').off('hidden.bs.modal');
      };
    }, 1000);
  }, []);

  return (
    <div class="modal fade" id="intro-modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center">
            <div style={{ height: 300 }}>
              {showVideo ? (
                <YouTube
                  videoId={'bABdqQPE1VU'} // defaults -> ''
                  id="video-player" // defaults -> ''
                  opts={{
                    height: 300,
                    width: '100%',
                    playerVars: {
                      autoplay: 1,
                    },
                  }}
                  // className={string} // defaults -> ''
                  // iframeClassName={string} // defaults -> ''
                  title="Unlocking Your Digital Legacy: Introducing Sampul - Your Hassle-Free Digital Will Platform"
                  // loading={string} // defaults -> undefined
                  // opts={obj} // defaults -> {}
                  // onReady={func} // defaults -> noop
                  // onPlay={func} // defaults -> noop
                  // onPause={func} // defaults -> noop
                  onEnd={() => {
                    setTimeout(() => {
                      $('#intro-modal')?.modal('hide');
                    }, 1000);
                  }} // defaults -> noop
                  // onError={func} // defaults -> noop
                  // onStateChange={func} // defaults -> noop
                  // onPlaybackRateChange={func} // defaults -> noop
                  // onPlaybackQualityChange={func} // defaults -> noop
                />
              ) : (
                <>
                  <img
                    class="pointer-on-hover"
                    style={{ height: '100%', width: '100%' }}
                    src="images/sampul-video-player.png"
                    onClick={() => {
                      setShowVideo(true);
                    }}
                  />
                </>
              )}
            </div>

            <div class="my-4">
              <h5>
                <strong>Welcome to your dashboard</strong>
              </h5>
              <h6 class="text-muted">
                We’re glad to have you onboard. Here are some quick tips to get
                you up and running.
              </h6>
            </div>
            <div class="row">
              <div class="col">
                <button
                  class="btn btn-light bg-white btn-text w-100"
                  onClick={() => {
                    setShowVideo(false);
                    $('#intro-modal')?.modal('hide');
                  }}
                >
                  Skip
                </button>
              </div>
              <div class="col">
                <button
                  class="btn btn-primary btn-text w-100"
                  onClick={() => {
                    setShowVideo(true);
                  }}
                >
                  Start video tour
                </button>
              </div>
            </div>

            <div class="row">
              <div class="col mt-sm-0 mt-3">
                <div class="row">
                  <div class="col"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroModal;
