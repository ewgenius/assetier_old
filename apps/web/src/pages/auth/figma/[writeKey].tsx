import type {
  NextPageExtended,
  OrganizationWithPlan,
  Project,
} from "@assetier/types";
import { Page } from "@components/Page";
import type { GetServerSideProps, NextApiRequest } from "next";
import { prisma } from "@utils/prisma";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FC } from "react";
import Image from "next/image";
import {
  CheckCircleIcon,
  PlusCircleIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { useMe } from "@hooks/useMe";
import { Select } from "@components/Select";
import { classNames } from "@utils/classNames";
import { useOrganizationProjects } from "@hooks/useOrganizationProjects";
import { Spinner } from "@components/Spinner";
import { OrganizationType } from "@assetier/prisma";
import { fetcher } from "@utils/fetcher";
import { useRouter } from "next/router";
import { TextInput } from "@components/TextInput";
import { parseFigmaUrl } from "@utils/parseFigmaUrl";
import { useProjectForm } from "@hooks/useProjectForm";

export const OrganizationProjectConnector: FC = () => {
  const {
    query: { writeKey },
  } = useRouter();
  const { user } = useMe();
  const organizations = user?.organizations || [];
  const [selectedOrganization, setSelectedOrganization] =
    useState<OrganizationWithPlan | null>(user?.personalOrganization || null);

  const { projects } = useOrganizationProjects(selectedOrganization);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const form = useProjectForm(selectedProject || undefined);
  const parsedFigmaUrl = useMemo(
    () => parseFigmaUrl(form.figmaFileUrl),
    [form.figmaFileUrl]
  );

  const [state, setState] = useState<
    "idle" | "connecting" | "success" | "error"
  >("idle");
  const connect = useCallback(() => {
    if (selectedOrganization && selectedProject && writeKey) {
      setState("connecting");
      fetcher(`/api/figma/auth/${writeKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationId: selectedOrganization.id,
          projectId: selectedProject.id,
          figmaFileUrl: form.figmaFileUrl,
        }),
      })
        .then(() => {
          setState("success");
        })
        .catch(() => {
          setState("error");
        });
    }
  }, [
    selectedOrganization?.id,
    selectedProject?.id,
    writeKey,
    form.figmaFileUrl,
  ]);

  useEffect(() => {
    if (user?.personalOrganization && !selectedOrganization) {
      setSelectedOrganization(user.personalOrganization);
    }
  }, [user?.personalOrganization, selectedOrganization]);

  useEffect(() => {
    setSelectedProject(null);
  }, [selectedOrganization]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [projects]);

  if (!user) {
    return <Spinner className="my-32" />;
  }

  if (state === "success") {
    return (
      <div className="mt-16 flex flex-col items-center justify-center text-sm text-gray-500">
        <CheckCircleIcon className="h-8 w-8 text-green-600" />
        Succesfully connected, you can close this page now
      </div>
    );
  }

  return (
    <div className="mt-16 flex w-full max-w-sm flex-col items-center gap-4">
      <div className="flex w-full flex-col gap-2">
        <div>
          <Select
            label="Organization"
            disabled={state === "connecting"}
            items={organizations}
            placeholder="Select Organization"
            selectedItem={selectedOrganization}
            onChange={setSelectedOrganization}
            getItemId={(o: OrganizationWithPlan) => o.id}
            renderButton={(o: OrganizationWithPlan) => (
              <div className="flex items-center">
                <div className="mr-3 rounded-lg bg-zinc-200 p-2 sm:p-1">
                  {o.type === OrganizationType.PERSONAL ? (
                    <UserIcon className="h-4 w-4" />
                  ) : (
                    <UserGroupIcon className="h-4 w-4" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="truncate">
                    {o.type === OrganizationType.PERSONAL
                      ? user.user.name
                      : o.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {o.type === OrganizationType.PERSONAL ? "personal" : "team"}
                  </span>
                </div>
              </div>
            )}
            renderItem={(o: OrganizationWithPlan, { selected }) => (
              <div className="flex items-center">
                <div className="mr-3 rounded-lg bg-zinc-200 p-2 sm:p-1">
                  {o.type === OrganizationType.PERSONAL ? (
                    <UserIcon className="h-4 w-4" />
                  ) : (
                    <UserGroupIcon className="h-4 w-4" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span
                    className={classNames(
                      selected ? "font-semibold" : "font-normal",
                      "truncate"
                    )}
                  >
                    {o.type === OrganizationType.PERSONAL
                      ? user.user.name
                      : o.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {o.type === OrganizationType.PERSONAL ? "personal" : "team"}
                  </span>
                </div>
              </div>
            )}
          />
        </div>

        {selectedOrganization && projects?.length !== 0 ? (
          <>
            <div>
              <Select
                label="Project"
                disabled={state === "connecting"}
                items={projects}
                placeholder="Select Project"
                selectedItem={selectedProject}
                onChange={setSelectedProject}
                getItemId={(p: Project) => p.id}
                renderButton={(p: Project) => (
                  <span className="block truncate">{p.name}</span>
                )}
                renderItem={(p: Project, { selected }) => (
                  <span
                    className={classNames(
                      selected ? "font-semibold" : "font-normal",
                      "block truncate"
                    )}
                  >
                    {p.name}
                  </span>
                )}
              />
            </div>

            {selectedProject && (
              <>
                <div>
                  <TextInput
                    id="figma-file-url"
                    name="figma-file-url"
                    label="Figma file url"
                    placeholder="https://www.figma.com/file/..."
                    value={form.figmaFileUrl}
                    onChange={form.setFigmaFileUrl}
                  />

                  {parsedFigmaUrl && (
                    <div className="mt-2 font-mono text-xs text-gray-400">
                      <p>key: {parsedFigmaUrl.key}</p>
                      <p>title: {parsedFigmaUrl.title}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="my-4 text-center text-sm text-gray-500">
            <p>There are no projects in selected org</p>
            <p>Choose other organization, or create new project</p>
          </div>
        )}

        {selectedOrganization && selectedProject && form.figmaFileUrl && (
          <button
            type="button"
            disabled={state === "connecting"}
            onClick={connect}
            className="text-md mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-zinc-800 px-4 py-2 font-medium text-white shadow-sm hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2 disabled:bg-zinc-400"
          >
            <div className="text-center">Connect</div>
          </button>
        )}
      </div>
    </div>
  );
};

export interface FigmaIntegrationAuthProps {
  success: boolean;
}

export const FigmaIntegrationAuth: NextPageExtended<
  FigmaIntegrationAuthProps
> = ({ success }) => {
  useEffect(() => {
    if (!success) {
      // signIn();
    }
  }, [success]);

  return (
    <Page>
      <div className="flex h-screen flex-col items-center justify-center align-middle">
        <div className="flex h-[500px] w-full flex-col items-center px-4">
          <div className="flex items-center justify-center gap-4">
            <Image src="/logo-256x256.png" width="64" height="64" />
            <PlusCircleIcon className="h-8 w-8" />
            <Image src="/figma-256x256.png" width="64" height="64" />
          </div>
          <h1 className="mt-4 text-xl">Connect Figma to Project</h1>
          <OrganizationProjectConnector />
        </div>
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps<
  FigmaIntegrationAuthProps
> = async ({ req, res, params }) => {
  const { accessToken: token } = await getAccessToken(req, res);

  if (!token) {
    return {
      props: {
        success: false,
      },
    };
  }

  const pair = await prisma.figmaReadWritePair.findUnique({
    where: {
      writeKey: params?.writeKey as string,
    },
  });

  if (!pair) {
    return {
      props: {
        success: false,
      },
    };
  }

  await prisma.figmaReadWritePair.update({
    where: {
      writeKey: params?.writeKey as string,
    },
    data: {
      token,
    },
  });

  return {
    props: {
      success: true,
    },
  };
};

FigmaIntegrationAuth.type = "auth";

export default FigmaIntegrationAuth;
