import { Html, Head, Main, NextScript } from "next/document";
import { NextPageContext } from "next";

function getThemeFromCookie(ctx: NextPageContext) {
  const cookie = ctx.req?.headers.cookie || "";
  const match = cookie.match(/theme=(dark|light)/);
  return match ? match[1] : "light";
}

export default function Document(props: any) {
  // Default to light theme
  let theme = "light";
  if (props.__NEXT_DATA__?.props?.pageProps?.theme) {
    theme = props.__NEXT_DATA__.props.pageProps.theme;
  }
  return (
    <Html className={theme === "dark" ? "dark" : ""}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx: any) => {
  const initialProps = await ctx.defaultGetInitialProps(ctx);
  const theme = getThemeFromCookie(ctx);
  return {
    ...initialProps,
    __NEXT_DATA__: {
      ...initialProps.__NEXT_DATA__,
      props: { ...initialProps.__NEXT_DATA__.props, pageProps: { theme } },
    },
  };
};
