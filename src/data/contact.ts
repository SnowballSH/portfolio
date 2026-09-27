export interface Profile {
  label: string;
  handle: string;
  url: string;
  inFooter: boolean;
}

export const email = "yinuo@snowballsh.com";

export const academicProfileUrl = "https://www.andrew.cmu.edu/user/yinuohua/";

export const profiles: readonly Profile[] = [
  {
    label: "GitHub",
    handle: "SnowballSH",
    url: "https://github.com/SnowballSH",
    inFooter: true,
  },
  {
    label: "LinkedIn",
    handle: "yinuo-huang-sh",
    url: "https://www.linkedin.com/in/yinuo-huang-sh/",
    inFooter: true,
  },
  {
    label: "YouTube",
    handle: "@SnowballSH",
    url: "https://www.youtube.com/@SnowballSH",
    inFooter: true,
  },
  {
    label: "Codeforces",
    handle: "SnowballSH",
    url: "https://codeforces.com/profile/SnowballSH",
    inFooter: false,
  },
];
