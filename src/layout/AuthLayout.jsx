import {Outlet} from 'react-router';

const AuthLayout = () => {
  return (
    <div className="flex h-screen w-full">
      <div className="w-1/2">
        <img
          src="/src/assets/images/frontdoor.webp"
          alt="HairDo Frontdoor"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex w-1/2 items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
