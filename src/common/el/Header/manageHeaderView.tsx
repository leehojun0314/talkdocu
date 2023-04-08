import { useCustomMediaQuery } from "@/common/theme/screen";
import { ManageMobileHeader } from "./ManageMobileHeader";
import { Pcheader } from "./PCheader";

export const ManageHeaderView = () => {
  const { isSmall } = useCustomMediaQuery();
  return <>{isSmall ? <ManageMobileHeader /> : <Pcheader />}</>;
};
