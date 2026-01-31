import { useEffect, useState } from "react";

export default function AriaLiveRegion({ message, priority = "polite" }) {
  return (
    <div
      aria-live={priority}
      role={priority === "assertive" ? "alert" : "status"}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
