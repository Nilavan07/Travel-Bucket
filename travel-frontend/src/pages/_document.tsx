import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Generated Project" />
        <meta name="author" content="Your Name or Company" />

        <meta property="og:title" content="globetrotter-destination-hub" />
        <meta property="og:description" content="Generated Project" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://yourdomain.com/opengraph-image.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://yourdomain.com/opengraph-image.png"
        />

        <script
          async
          defer
          src="https://maps.googleapis.com/maps/api/js?AIzaSyD7BBc93QCFYBd8fnbmUF1SGi4LOC4xNZ4&libraries=places"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
