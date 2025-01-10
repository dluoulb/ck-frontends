import { useState } from 'react';
import axios from 'axios';

import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import { deNormalizePhone } from '@lib/utils/formatters';
import { useRouter } from 'next/router';

function usePossessedUser() {
  const router = useRouter();
  const { setEntity } = useEntity();
  const { getCurrentUser } = useUser();
  const [contactType, setContactType] = useState('email');
  const [parentUserId, setParentUserId] = useState(sessionStorage.getItem('parentUserId') || '');
  const [error, setError] = useState('' || null);
  const [possessedUserContact, setPossessedUserContact] = useState('');

  const clearUserAndReload = () => {
    clearUser()
    .then(() => {
      router.push('/')
      .then(() => {
        router.reload();
      });
    });
  };

  const clearUser = async () => {
    return axios
      .delete(`${process.env.NEXT_PUBLIC_SUPERTOKENS_API_DOMAIN}/impersonate`)
      .then(() => {
        getCurrentUser({ userID: parentUserId });
        setEntity(null);
      })
      .catch(() => {
        // not impersonating, do nothing
      });
  };

  const possessUser = async (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.NEXT_PUBLIC_SUPERTOKENS_API_DOMAIN}/impersonate`, {
        [contactType]:
          contactType === 'email'
            ? possessedUserContact
            : deNormalizePhone(possessedUserContact),
      })
      .then((res) => {
        setUserData(res);
      })
      .catch((err) => {
        handleError(err, contactType);
      });
  };

  const setUserData = (res) => {
    setParentUserId(res.data.data.parentUserId);
    sessionStorage.setItem('parentUserId', res.data.data.parentUserId);
    getCurrentUser(res.data.data);
  };

  const handleError = (err, contactType) => {
    const notFound = err?.response?.data?.statusCode === 404;

    setError(
      notFound
        ? `No user found with this ${contactType}`
        : `An error occurred: ${err?.response?.data?.message}`
    );
  };

  const possessUserById = async (userId) => {
    clearUser()
    .then(() => {
      axios
        .post(`${process.env.NEXT_PUBLIC_SUPERTOKENS_API_DOMAIN}/impersonate`, {
          userId
        })
        .then((res) => {
          setUserData(res);
        })
        .catch((err) => {
          handleError(err, 'user id');
        });
    });
  };

  return {
    clearUserAndReload, // clear impersonation
    possessUser, // impersonate new user
    possessUserById,
    possessUserError: error, // error when trying to impersonate
    possessedUserContact, // email or phone of impersonated user
    setPossessedUserContact, // setter
    contactType, // email or phohe
    setContactType, // setter
  };
}
export default usePossessedUser;
