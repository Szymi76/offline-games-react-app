import Loading from "@/components/Loading";
import { Navigate } from "react-router-dom";
import React from "react";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

type Protection = "logged-in-only" | "not-logged-in-only" | "everyone";

type ProtectedProps = { element: React.ReactNode; type?: Protection };
const Protected = (props: ProtectedProps) => {
  const [user, loading] = useAuthState(auth);

  // default value for type
  if (props.type === undefined) props.type = "everyone";

  // just return children if route is marked for everyone
  if (props.type === "everyone") return props.element;

  // loading spinner when fetching a user
  if (loading)
    return (
      <div className="pt-10">
        <Loading />
      </div>
    );

  // redirecting user if he is not logged in and route is marked as for logged in only
  if (!user && props.type === "logged-in-only")
    return <Navigate to="/auth/login" />;

  // opposite scenerio from above
  if (user && props.type === "not-logged-in-only") return <Navigate to="/" />;

  // if all good just return children
  return props.element;
};

export default Protected;
