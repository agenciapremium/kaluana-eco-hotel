import Link from "next/link";
import type { ComponentProps } from "react";
import { isBuilt } from "@/lib/routes";

type Props = Omit<ComponentProps<typeof Link>, "href" | "prefetch"> & { href: string };

/** next/link com prefetch só para rotas já construídas (ver lib/routes.ts). */
export function SiteLink({ href, ...props }: Props) {
  return <Link href={href} prefetch={isBuilt(href) ? undefined : false} {...props} />;
}
