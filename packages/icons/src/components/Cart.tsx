// WARNING: This file was generated by a script. Do not modify it manually
import { forwardRef } from "react";

import { Icon, IconProps } from "../icon";

export type CartIconProps = IconProps;

const CartIcon = forwardRef<SVGSVGElement, CartIconProps>(function CartIcon(
  props: CartIconProps,
  ref
) {
  return (
    <Icon
      data-testid="CartIcon"
      aria-label="cart"
      viewBox="0 0 12 12"
      ref={ref}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M1 1h3v1h7l-.715 5H3.711l.144 1h6.29L10 9H2.996l-.289-2h.008L2 2H1V1Zm2.153 2 .429 3h5.836l.429-3H3.153Z"
        clipRule="evenodd"
      />
      <path d="M9 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-4-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
    </Icon>
  );
});

export default CartIcon;
