import Router from 'next/router';
import { FunctionComponent, useEffect } from 'react';
import { ROUTE_AUTH } from '~/config';
import { useAuth } from '~/lib/auth';
import { SpinnerFullPage } from './Spinner';

// used in client-side redirect protected pages vs serve side with GetServerSideProps

type LayoutProps = {};

const PrivateLayout: FunctionComponent<LayoutProps> = ({ children }) => {
  const { loggedIn, userLoading } = useAuth();

  useEffect(() => {
    if (!userLoading && !loggedIn) {
      Router.push(ROUTE_AUTH);
    }
  }, [userLoading, loggedIn]);

  if (userLoading) {
    return <SpinnerFullPage />;
  }

  return <>{children}</>;
};

PrivateLayout.defaultProps = {};

export default PrivateLayout;
