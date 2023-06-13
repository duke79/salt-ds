// WARNING: This file was generated by a script. Do not modify it manually
import { forwardRef } from "react";

import { Icon, IconProps } from "../icon";

export type ClockSolidIconProps = IconProps;

const ClockSolidIcon = forwardRef<SVGSVGElement, ClockSolidIconProps>(
  function ClockSolidIcon(props: ClockSolidIconProps, ref) {
    return (
      <Icon
        data-testid="ClockSolidIcon"
        aria-label="clock solid"
        viewBox="0 0 12 12"
        ref={ref}
        {...props}
      >
        <path d="M12 6A6 6 0 1 1 0 6a6 6 0 0 1 12 0zM6 3v3H3v1h4V3H6z" />
      </Icon>
    );
  }
);

export default ClockSolidIcon;
