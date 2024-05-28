import { useRouter } from 'next/router';

const AccountIndex = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Account Details</h1>
      <p>Details for account with ID: {id}</p>
    </div>
  );
}

export default AccountIndex;
