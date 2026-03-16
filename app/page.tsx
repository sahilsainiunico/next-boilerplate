import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
    Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-gray-900">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start dark:border-2 dark:border-solid dark:border-gray-700">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <h1>Testing Card Component</h1>
        <Card className="w-full max-w-md mx-auto border-2 border-solid border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>
              Edit the page.tsx file to begin building your app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Looking for a starting point? Head over to{" "}
              <a
                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Templates
              </a>{" "}
              or the{" "}
              <a
                href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Learning
              </a>{" "}
              center.
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">Next.js Boilerplate by Sahil Saini</p>
          </CardFooter>
        </Card>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
        <h1>Testing Carousel Component</h1>
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <Card className="w-full max-w-lg mx-auto border-2 border-solid border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle>Welcome to Next.js</CardTitle>
                  <CardDescription>
                    Build modern web applications with React and TypeScript.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Next.js provides the best developer experience with all the features you need for production.
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="w-full max-w-lg mx-auto border-2 border-solid border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle>Tailwind CSS</CardTitle>
                  <CardDescription>
                    Utility-first CSS framework for rapid UI development.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Style your components with Tailwind&apos;s responsive design utilities and dark mode support.
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="w-full max-w-lg mx-auto border-2 border-solid border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle>shadcn/ui Components</CardTitle>
                  <CardDescription>
                    Beautiful and accessible UI components built on Radix UI.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Pre-built components like cards, buttons, and carousels that you can customize to fit your design.
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
    </div>
  );
}
