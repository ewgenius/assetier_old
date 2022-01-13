import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html className="h-full bg-white">
        <Head>
          <meta name="description" content="Assetier" />
          <meta name="theme-color" content="#ffffff" />

          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/site.webmanifest"></link>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </Head>
        <body className="h-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
