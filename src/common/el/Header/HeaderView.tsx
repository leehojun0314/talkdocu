import { useCustomMediaQuery } from "@/common/theme/screen";
import { MobileHeader } from "./MobileHeader";

import { Pcheader } from "./PCheader";

export const HeaderView = () => {
  const { isSmall } = useCustomMediaQuery();
  return <>{isSmall ? <MobileHeader /> : <Pcheader />}</>;
};
