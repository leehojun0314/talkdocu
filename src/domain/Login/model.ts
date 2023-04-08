import naver from "@/assets/logos/naver.png";
import kakao from "@/assets/logos/kakao.png";
import google from "@/assets/logos/google.png";
import facebook from "@/assets/logos/facebook.png";
import { Color } from "@/common/theme/colors";

export const SNSModels = [
  {
    logo: naver,
    text: "네이버로 계속하기",
    bgColor: "#03C75A",
    textColor: Color.WhiteText,
    hoverColor: " #059b48",
  },
  {
    logo: kakao,
    text: "카카오로 계속하기",
    bgColor: "#FEE500",
    textColor: Color.BlackText,
    hoverColor: "#e6cf00",
  },
  {
    logo: google,
    text: "Google로 계속하기",
    bgColor: "#fff",
    textColor: Color.BlackText,
    border: "solid 1px #eee",
    hoverColor: "#f5f5f5",
  },
  {
    logo: facebook,
    text: "Facebook으로 계속하기",
    bgColor: "#2374F2",
    textColor: Color.WhiteText,
    hoverColor: "#2064d1",
  },
];
