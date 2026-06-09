// Type declarations for uppercase image extensions not covered by next/image-types/global
declare module "*.PNG" {
  import type { StaticImageData } from "next/image";
  const content: StaticImageData;
  export default content;
}

declare module "*.JPG" {
  import type { StaticImageData } from "next/image";
  const content: StaticImageData;
  export default content;
}

declare module "*.JPEG" {
  import type { StaticImageData } from "next/image";
  const content: StaticImageData;
  export default content;
}
