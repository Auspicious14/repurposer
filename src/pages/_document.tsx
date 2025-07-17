import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Repurposer: Transform audio transcripts into engaging content for various platforms."
        />
        <meta
          name="keywords"
          content="repurposer, content generation, AI, audio transcript, social media, blog, youtube, linkedin, twitter"
        />
        <meta name="author" content="Abdulganiyu Uthman (Auspicious)" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=OpenSans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
