import { PcFooter } from "@/common/el/footer/PcFooter";
import { useCustomMediaQuery } from "@/common/theme/screen";

import {
  FirstSection,
  MainSection,
  MobileMainSection,
  SecondSection,
  ThirdSection,
} from "./sections";

export const UploadView = () => {
  const { isSmall } = useCustomMediaQuery();
  return (
    <div>
      {isSmall ? <MobileMainSection /> : <MainSection />}
      <FirstSection />
      <SecondSection />
      <ThirdSection />
      <PcFooter position="relative" />
    </div>
  );
};

const sx = {};
