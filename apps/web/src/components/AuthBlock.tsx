import { useUser } from "@auth0/nextjs-auth0";

export const AuthBlock = () => {
  const user = useUser();
  if (user) {
    return (
      <>
        Signed in as {user.user?.email} <br />
        <a href="/api/auth/logout"></a>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <a href="/api/auth/login?returnTo=/app"></a>
    </>
  );
};
