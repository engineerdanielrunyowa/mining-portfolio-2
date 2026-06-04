import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mining Engineer Portfolio',
  description: 'Professional Mining Engineer — Portfolio and Updates',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-bg-main dark:bg-dark-bg text-text-main dark:text-dark-text antialiased">
        {children}
      </body>
    </html>
  );
}