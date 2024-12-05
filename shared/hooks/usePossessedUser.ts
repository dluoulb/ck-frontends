import { useState } from 'react';
import axios from 'axios';

import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import { deNormalizePhone, normalizePhone } from '@lib/utils/formatters';
import { useRouter } from 'next/router';

function usePossessedUser() {
  const router = useRouter();
  const { setEntity } = useEntity();
  const { getCurrentUser } = useUser();

  const [contactType, setContactType] = useState('email');

  const [error, setError] = useState('' || null);
  const [parentUserId, setParentUserId] = useState('');
  const [possessedUserContact, setPossessedUserContact] = useState('');

  const clearUser = () => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_SUPERTOKENS_API_DOMAIN}/impersonate`)
      .then(() => {
        getCurrentUser({ userID: parentUserId });
        setEntity(null);
        router.push('/borrower');
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
        setParentUserId(res.data.data.parentUserId);
        getCurrentUser(res.data.data);
      })
      .catch((err) => {
        const notFound = err?.response?.data?.statusCode === 404;

        setError(
          notFound
            ? 'No user found with this email'
            : `An error occurred: ${err?.response?.data?.message}`
        );
      });
  };

  return {
    clearUser, // clear impersonation
    possessUser, // impersonate new user
    possessUserError: error, // error when trying to impersonate
    possessedUserContact, // email or phone of impersonated user
    setPossessedUserContact, // setter
    contactType, // email or phohe
    setContactType, // setter
  };
}
export default usePossessedUser;
