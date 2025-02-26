const TwoFactorAuthPage = () => {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-gray-500">
          2FA Page
        </p>
      </div>

      {/* Add your login form here */}
      <form className="space-y-4">{/* Login form content will go here */}</form>
    </div>
  );
};

export default TwoFactorAuthPage;
