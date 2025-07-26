import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Forma: Transform text, audio and video transcripts into engaging content for various platforms."
        />
        <meta
          name="keywords"
          content="forma, content generation, AI, text, audio, or video transcript, social media, blog, youtube, linkedin, twitter, x, whatsapp"
        />
        <meta name="author" content="Abdulganiyu Uthman (Auspicious)" />
      </Head>
      <body className="antialiased font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
