import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  faHandWave,
  faTriangleExclamation,
} from "@fortawesome/pro-regular-svg-icons";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

import { useAuth } from "hooks/useAuth";
import Alert from "@components/Alert";
import Loading from "@components/Loading";
import Support from "@components/Support";
import UserTokenVerification from "@components/UserTokenVerification";

const LoginToken = () => {
  const router = useRouter();
  const { loading, setLoading } = useAuth();
  const { contact, input_type, from } = Object.fromEntries(
    useSearchParams().entries()
  );
  const [error, setError] = useState(null);

  const onSubmit = async (givenToken) => {
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      contact,
      type: input_type,
      verification_code: givenToken,
      ui: from,
    });

    if (result?.ok) {
      router.push("/");
      // router.push(`/${from}`);
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div role="main" className="mx-6 sm:mx-auto my-12">
      <div className="mx-auto max-w-xl w-full overflow-y-scroll">
        <div className="my-4 flex items-center">
          <span className="fa-layers fa-fw text-5xl">
            <FontAwesomeIcon
              icon={faSquare}
              className="text-secondary-blue !mx-0"
            />
            <FontAwesomeIcon
              icon={faHandWave}
              className="text-primary-blue text-3xl !mx-1.5"
            />
          </span>
          <div className="text-xl sm:text-4xl font-extrabold">
            We just {input_type === "phone" ? "texted" : "emailed"} you
          </div>
        </div>
        <div className="font-light sm:text-lg tracking-wide mb-6">
          <div>
            Please enter the verification code we sent to
            <span className="text-primary-blue-hover block sm:inline sm:mx-1">
              {contact}.
            </span>
          </div>
        </div>
        {loading ? <Loading /> : <UserTokenVerification onSubmit={onSubmit} />}
        {error && (
          <Alert
            icon={faTriangleExclamation}
            alertText={error}
            containerClass="my-4 p-4 bg-background-error"
          />
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full my-3 sm:mt-6">
          <p className="font-light text-sm sm:text-lg">
            Didn't receive the code?
          </p>
          <Link
            href="/login"
            className="xxs:ml-1.5 text-sm sm:text-lg text-primary-blue hover:text-primary-blue-hover"
          >
            Change {input_type}
          </Link>
        </div>
        <div className="mt-6 sm:mt-12">
          <Support />
        </div>
      </div>
    </div>
  );
};

export default LoginToken;
