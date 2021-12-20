import type { NextComponentType, NextPage, NextPageContext } from "next";
import type { AppProps } from "next/app";

export type WithNavId = {
  type: "site" | "app";
  navId: string;
};

export type NextPageExtended<P = {}, IP = P> = NextPage<P, IP> & WithNavId;

export type AppPropsExtended<P = {}> = AppProps<P> & {
  Component: NextComponentType<NextPageContext, any, P> & WithNavId;
};
