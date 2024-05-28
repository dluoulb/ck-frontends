import { useRouter } from 'next/router';

const CompanyIndex = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Company Details</h1>
      <p>Details for company with ID: {id}</p>
    </div>
  );
}

export default CompanyIndex;
