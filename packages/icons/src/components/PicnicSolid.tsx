// WARNING: This file was generated by a script. Do not modify it manually
import { forwardRef } from "react";

import { Icon, IconProps } from "../icon";

export type PicnicSolidIconProps = IconProps;

export const PicnicSolidIcon = forwardRef<SVGSVGElement, PicnicSolidIconProps>(
  function PicnicSolidIcon(props: PicnicSolidIconProps, ref) {
    return (
      <Icon
        data-testid="PicnicSolidIcon"
        aria-label="picnic solid"
        viewBox="0 0 12 12"
        ref={ref}
        {...props}
      >
        <path
          fillRule="evenodd"
          d="M9.5 0 12 8.5h-2V11h2v1H0v-1h1v-1H0V9h3v1H2v1h2V8H3V7h3v1H5v3h4V8.5H7L9.5 0ZM9 7.5h1v-1H9v1Z"
          clipRule="evenodd"
        />
      </Icon>
    );
  }
);