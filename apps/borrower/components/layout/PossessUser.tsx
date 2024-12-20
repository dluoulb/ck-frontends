import { faEnvelope, faPhone } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PrimaryButton from '@components/buttons/PrimaryButton';
import Loading from '@components/Loading';
import { useUser } from '@contexts/UserContext';
import usePossessedUser from '@hooks/usePossessedUser';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function PossessUser() {
  const { user: currentUser, userLoading, isImpersonating } = useUser();
  const searchParams = useSearchParams();
  const urlUserId = searchParams.get('login_as');

  const {
    contactType,
    setContactType,
    clearUserAndReload,
    possessUser,
    possessUserById,
    possessUserError,
    setPossessedUserContact,
  } = usePossessedUser();

  const inputType = contactType === 'email' ? 'email' : 'tel';

  function detect_input_type(value) {
    const phoneRegex = /^\d{0,4}$/;
    const emailRegex = /^[a-zA-Z0-9._-]{0,4}$/;

    const val = value.replace(/[\W]/g, '').slice(0, 4);

    if (val && phoneRegex.test(val)) {
      setContactType('phone');
      return 'phone';
    } else if (val && emailRegex.test(val.toLowerCase())) {
      setContactType('email');
      return 'email';
    }

    return 'unknown';
  }

  useEffect(() => {
    if (urlUserId) {
      possessUserById(urlUserId);
    }
  }, [urlUserId]);

  return (
    <div
      role={PossessUser.role}
      className="border-b border-primary-gray-border xl:max-w-[90%] xl:mx-auto"
    >
      <div className="rounded-md bg-primary-beige/20 px-6 py-4 w-full mt-6 mb-3 min-h-28">
        <div>
          {isImpersonating && !userLoading ? (
            <>
              <h3 className="text-lg font-medium text-yellow-800">
                Possessing User:
              </h3>
              <div className="flex flex-col gap-2 md:gap-0 md:flex-row justify-between md:items-end">
                <div className="mt-2 text-yellow-700 text-sm md:text-base">
                  <p>Name: {currentUser?.full_name}</p>
                  <p>Email: {currentUser?.email}</p>
                </div>
                <PrimaryButton
                  ariaLabel="save-default-terms-button"
                  buttonText="Clear User"
                  containerClass="!w-auto"
                  buttonColor="bg-warning w-full sm:w-auto sm:min-w-max !px-6 !my-0"
                  hoverClass="hover:bg-warning/80"
                  onClick={clearUserAndReload}
                />
              </div>
            </>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-yellow-800 ml-1">
                Waiting...
              </h3>
              {userLoading ? (
                <Loading
                  className="w-6 h-6 !text-yellow-800"
                  containerClass="!justify-start pt-4"
                />
              ) : (
                <>
                  <p className="text-sm ml-1">
                    Please input a user email or phone below.
                  </p>
                  <form onSubmit={possessUser}>
                    <div className="flex flex-col gap-1 my-2">
                      <div className="flex items-center justify-between">
                        <div className="w-3/5 relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <FontAwesomeIcon
                              icon={
                                inputType === 'email' ? faEnvelope : faPhone
                              }
                              aria-hidden="true"
                              className="h-4 w-4 text-gray-400"
                            />
                          </div>
                          <input
                            id="contact"
                            name="contact"
                            type={inputType}
                            placeholder="Email or Phone"
                            onChange={(e) => {
                              detect_input_type(e.target.value);
                              setPossessedUserContact(e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 pb-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm/4"
                          />
                        </div>
                        <PrimaryButton
                          ariaLabel="possess-user-button"
                          buttonText="Possess User"
                          containerClass="!w-auto"
                          buttonColor="bg-primary-blue-hover !font-normal !py-1.5 px-4 !m-0"
                          hoverClass="hover:bg-primary-blue-hover/80"
                        />
                      </div>
                      {possessUserError && (
                        <div className="text-error text-xs ml-1">
                          {possessUserError}
                        </div>
                      )}
                    </div>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

PossessUser.role = 'possess-user-component';
