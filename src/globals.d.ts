// src/globals.d.ts
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
// Atau versi sederhana:
// declare module '*.css';