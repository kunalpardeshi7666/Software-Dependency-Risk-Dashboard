import { useEffect, useState } from "react";

let announceFn = null;

export const announce = (msg) => {
  if (announceFn) announceFn(msg);
};

export function AriaLiveRegion() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    announceFn = setMessage;
  }, []);

  return (
    <div aria-live="assertive" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
