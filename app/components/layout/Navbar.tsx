"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  {
    label: "HOME",
    href: "#hero",
  },
  {
    label: "PRODUCTS",
    href: "#products",
  },
  {
    label: "TECHNOLOGY",
    href: "#technology",
  },
  {
    label: "ABOUT",
    href: "#about",
  },
  {
    label: "CONTACT",
    href: "#contact",
  },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  /* ------------------------------------------------------------------ */
  /* ESCAPE KEY                                                         */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* ------------------------------------------------------------------ */
  /* LOCK BODY WHILE MENU IS OPEN                                       */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* ============================================================= */}
      {/* TRANSPARENT NAVBAR                                            */}
      {/* ============================================================= */}

      <header
        className="
          pointer-events-none
          fixed
          inset-x-0
          top-0
          z-[100]
          w-full
        "
      >
        <div
          className="
            mx-auto
            flex
            h-[76px]
            w-full
            items-center
            justify-between
            px-5

            sm:h-[84px]
            sm:px-7

            lg:h-[92px]
            lg:px-10

            xl:px-12
          "
        >
          {/* ========================================================= */}
          {/* LEFT SOCIAL ICONS                                         */}
          {/* ========================================================= */}

          <div
            className="
              pointer-events-auto
              flex
              items-center
              gap-4
            "
          >
            {/* LinkedIn */}

            <a
              href="#"
              aria-label="LinkedIn"
              className="
                text-white
                transition-opacity
                duration-300
                hover:opacity-60
              "
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.32V8.98h3.42v1.57h.05c.48-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.46v6.3zM5.3 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.08 20.45H3.52V8.98h3.56v11.47z" />
              </svg>
            </a>

            {/* Instagram */}

            <a
              href="#"
              aria-label="Instagram"
              className="
                text-white
                transition-opacity
                duration-300
                hover:opacity-60
              "
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />

                <circle cx="12" cy="12" r="4" />

                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>

            {/* Facebook */}

            <a
              href="#"
              aria-label="Facebook"
              className="
                text-white
                transition-opacity
                duration-300
                hover:opacity-60
              "
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.87.24-1.46 1.5-1.46H16.7V4a22.7 22.7 0 0 0-2.47-.13c-2.45 0-4.13 1.5-4.13 4.25V10H7.33v3h2.77v8h3.4z" />
              </svg>
            </a>
          </div>

          {/* ========================================================= */}
          {/* CENTER LOGO                                               */}
          {/* ========================================================= */}

          <a
            href="#hero"
            aria-label="Apex Lubricants home"
            className="
              pointer-events-auto
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              transition-opacity
              duration-300
              hover:opacity-70
            "
          >
            <div className="flex flex-col items-center">
              {/* Apex Symbol */}

              <img
                src="/assets/images/logo.jpg"
                alt="Apex Lubricants Logo"
                className="w-[50px]"
              />
            </div>
          </a>

          {/* ========================================================= */}
          {/* RIGHT NAVIGATE                                            */}
          {/* ========================================================= */}

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
            className="
              pointer-events-auto
              ml-auto
              flex
              items-center
              gap-4
              text-white

              sm:gap-5
            "
          >
            <span
              className="
                hidden
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.3em]
                font-display
                sm:block

                lg:text-[10px]
              "
            >
              Navigate
            </span>

            <Menu
              strokeWidth={1.4}
              className="
                h-[21px]
                w-[21px]
                transition-transform
                duration-300

                hover:scale-110
              "
            />
          </button>
        </div>
      </header>

      {/* ============================================================= */}
      {/* FULLSCREEN NAVIGATION                                         */}
      {/* ============================================================= */}

      <div
        className={`
          fixed
          inset-0
          z-[200]
          overflow-hidden
          bg-[#171717]
          text-white

          transition-all
          duration-[700ms]
          ease-[cubic-bezier(0.76,0,0.24,1)]

          ${
            menuOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-full opacity-100"
          }
        `}
      >
        {/* ========================================================= */}
        {/* LARGE BACKGROUND APEX GRAPHIC                             */}
        {/* ========================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
          "
        >
          <svg
            viewBox="0 0 1000 900"
            preserveAspectRatio="xMidYMid slice"
            className="
              absolute
              left-1/2
              top-1/2
              h-[120%]
              w-[120%]
              -translate-x-1/2
              -translate-y-1/2
              opacity-[0.035]
            "
          >
            <path d="M0 700L400 100L500 250L180 700H0Z" fill="white" />

            <path d="M500 250L600 100L1000 700H820L500 250Z" fill="white" />

            <path d="M310 700L500 420L690 700H310Z" fill="white" />
          </svg>
        </div>

        {/* ========================================================= */}
        {/* TOP BAR                                                   */}
        {/* ========================================================= */}

        <div
          className="
            relative
            z-20
            flex
            h-[76px]
            items-center
            justify-between
            px-5

            sm:h-[84px]
            sm:px-7

            lg:h-[92px]
            lg:px-10

            xl:px-12
          "
        >
          {/* SOCIAL */}

          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="LinkedIn"
              className="
                text-white
                transition-opacity
                hover:opacity-60
              "
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="currentColor"
              >
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.32V8.98h3.42v1.57h.05c.48-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.46v6.3zM5.3 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.08 20.45H3.52V8.98h3.56v11.47z" />
              </svg>
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="
                text-white
                transition-opacity
                hover:opacity-60
              "
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />

                <circle cx="12" cy="12" r="4" />

                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="
                text-white
                transition-opacity
                hover:opacity-60
              "
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="currentColor"
              >
                <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.87.24-1.46 1.5-1.46H16.7V4a22.7 22.7 0 0 0-2.47-.13c-2.45 0-4.13 1.5-4.13 4.25V10H7.33v3h2.77v8h3.4z" />
              </svg>
            </a>
          </div>

          {/* CENTER LOGO */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
            "
          >
            <div className="flex flex-col items-center">
              <img
                src="/assets/images/logo.jpg"
                alt="Apex Lubricants Logo"
                className="w-[50px]"
              />
            </div>
          </div>

          {/* CLOSE */}

          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close navigation"
            className="
              ml-auto
              flex
              items-center
              gap-4
              text-white
font-display
              sm:gap-5
            "
          >
            <span
              className="
                hidden
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.3em]

                sm:block

                lg:text-[10px]
              "
            >
              Close
            </span>

            <X strokeWidth={1.2} className="h-[21px] w-[21px]" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* LINKS                                                     */}
        {/* ========================================================= */}

        <div
          className="
            relative
            z-20
            flex
            h-[calc(100svh-152px)]
            items-center
            justify-center

            sm:h-[calc(100svh-168px)]

            lg:h-[calc(100svh-184px)]
          "
        >
          <nav
            aria-label="Main navigation"
            className="
              flex
              flex-col
              items-center
              justify-center
            "
          >
            {NAV_LINKS.map((link, index) => (
              <div
                key={link.label}
                className="
                  group
                  relative
                  overflow-hidden
                "
                style={{
                  transitionDelay: menuOpen ? `${100 + index * 60}ms` : "0ms",
                }}
              >
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="
                    relative
                    block
                    font-display
                    text-[clamp(3rem,10vw,6rem)]
                    font-normal
                    uppercase
                    leading-[0.92]
                    tracking-[-0.055em]
                    text-white
                    transition-all
                    duration-500
                    sm:text-[clamp(4rem,8vw,7.5rem)]

                    lg:text-[clamp(4.6rem,7vw,8.5rem)]
                  "
                >
                  {link.label}
                </a>
              </div>
            ))}
          </nav>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM                                                    */}
        {/* ========================================================= */}

        <div
          className="
            absolute
            bottom-5
            left-5
            right-5
            z-20

            flex
            items-end
            justify-between

            sm:bottom-7
            sm:left-7
            sm:right-7

            lg:bottom-8
            lg:left-10
            lg:right-10
          "
        >
          <span
            className="
              text-[7px]
              font-medium
              uppercase
              tracking-[0.08em]
              text-white/35

              sm:text-[8px]
            "
          >
            © 2026 Apex Lubricants
          </span>

          <div
            className="
              absolute
              left-1/2
              hidden
              -translate-x-1/2
              items-center
              gap-6

              sm:flex
            "
          >
            <a
              href="#"
              className="
                text-[8px]
                uppercase
                tracking-[0.14em]
                text-white/40
                transition-colors
                hover:text-white
              "
            >
              Privacy
            </a>

            <a
              href="#"
              className="
                text-[8px]
                uppercase
                tracking-[0.14em]
                text-white/40
                transition-colors
                hover:text-white
              "
            >
              Terms
            </a>
          </div>

          <span
            className="
              text-[7px]
              uppercase
              tracking-[0.08em]
              text-white/35

              sm:text-[8px]
            "
          >
            Apex Lubricants
          </span>
        </div>
      </div>
    </>
  );
}
