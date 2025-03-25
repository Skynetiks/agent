import { convert } from "html-to-text";
export const htmlToText = (html: string) => {
  return convert(html);
};
