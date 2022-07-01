import Layout from '~/components/Layout';
import PrivateLayout from '~/components/Private';
import { getServerSideProps } from '~/lib/auth';

const ProtectedPage = ({}) => {
  return (
    // wrap Layout with private layout to required authenticated user
    <PrivateLayout>
      <Layout useBackdrop={false}>
        <div className="h-screen flex flex-col justify-center items-center relative">
          <h2 className="text-3xl my-4">Protected Page</h2>
        </div>
      </Layout>
    </PrivateLayout>
  );
};

export default ProtectedPage;
export { getServerSideProps };
