import toast from "react-hot-toast";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/pro-regular-svg-icons";

export default function useToast() {
  // TODO: FIX THE BACKGROUND NOT DISPLAYING PROPERLY
  const makeToast = (msg, type) => {
    return toast(
      <div
        className={classNames(
          "absolute top-3 right-3 shadow-lg mx-auto w-96 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block mb-3",
          type === "success" ? "bg-success" : "bg-error"
        )}
        id="static-example"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-mdb-autohide="false"
      >
        <div
          className={classNames(
            "flex justify-between items-center p-3 bg-clip-padding border-b rounded-lg",
            type === "success"
              ? "bg-success border-success"
              : "bg-error border-error"
          )}
        >
          <div className="flex items-center gap-4">
            <FontAwesomeIcon
              icon={type === "success" ? faCircleCheck : faCircleXmark}
              className="text-white text-lg"
            />
            <p className="text-white mt-0.5">{msg}</p>
          </div>
        </div>
      </div>
    );
  };

  return {
    makeToast,
  };
}
