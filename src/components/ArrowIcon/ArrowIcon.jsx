const ArrowIconPrev = ({ ...props }) => {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="15"
        cy="15"
        r="14.5"
        fill="white"
        stroke="url(#paint0_linear_80_5296)"
      />
      <path
        d="M17 9L11 15L17 21"
        stroke="url(#paint1_linear_80_5296)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_80_5296"
          x1="15"
          y1="0"
          x2="15"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F27252" />
          <stop offset="1" stopColor="#E85443" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_80_5296"
          x1="20"
          y1="12"
          x2="14"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F27252" />
          <stop offset="1" stopColor="#E85443" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const ArrowIconNext = ({ ...props }) => {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="15"
        cy="15"
        r="14.5"
        fill="white"
        stroke="url(#paint0_linear_80_5300)"
      />
      <path
        d="M13 9L19 15L13 21"
        stroke="url(#paint1_linear_80_5300)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_80_5300"
          x1="15"
          y1="0"
          x2="15"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F27252" />
          <stop offset="1" stopColor="#E85443" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_80_5300"
          x1="10"
          y1="12"
          x2="16"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F27252" />
          <stop offset="1" stopColor="#E85443" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export { ArrowIconPrev, ArrowIconNext };
