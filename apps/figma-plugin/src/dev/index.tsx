import React, {
  PropsWithChildren,
  FC,
  useRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { render } from "react-dom";
import { MessageType, PluginMessage } from "../types";

export const Button: FC<PropsWithChildren<{ onClick: () => void }>> = ({
  children,
  onClick,
}) => (
  <button
    type="button"
    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-gray-700 hover:bg-gray-800"
    onClick={onClick}
  >
    {children}
  </button>
);

const usePersistedState = (defaultValue: string) => {};

export const DebugShell: FC = () => {
  const frameRef = useRef<HTMLIFrameElement>(null);

  const [token, setToken] = useState(
    localStorage.getItem("assetier.token") || ""
  );
  const [organizationId, setOrganizationId] = useState(
    localStorage.getItem("assetier.organizationId") || ""
  );
  const [projectId, setProjectId] = useState(
    localStorage.getItem("assetier.projectId") || ""
  );

  const setTokenHandler = (value: string) => {
    setToken(value);
    localStorage.setItem("key", value);
  };

  const postMessage = useCallback(
    (pluginMessage: PluginMessage) => {
      const frame = frameRef.current;
      if (frame) {
        frame.contentWindow?.postMessage({ pluginMessage });
      }
    },
    [frameRef]
  );

  return (
    <div className="h-full w-full flex">
      <div className="bg-gray-900 text-gray-200 h-full flex flex-col min-w-[320px]">
        <div className="p-4 border-b border-gray-700">Plugin controls</div>

        <div className="flex-grow p-4 flex flex-col gap-2 max-w-sm">
          <Button
            onClick={() =>
              postMessage({
                type: MessageType.Init,
                data: {},
              })
            }
          >
            emulate: plugin started (no user data)
          </Button>

          <Button
            onClick={() =>
              postMessage({
                type: MessageType.Init,
                data: {
                  token:
                    "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..GZBEKBJpKiyRBkoN.aM9MUdwcxQ8QKYcrwPTdtchQLMKZZwYrdO7EGkpcc1VE4ZjLW731GBjkkRE9ekX07hRRb2zOLTTiqw0wk6cIzv7Z4z8nlGj4DgJqq9LQKOk7XoObVXLz1-V05Ipjw1Mln7c0iRht_FGFunRHSsfW-ifKZqiywHmUuTtIp_LlondXJVZ3BsbdavtM4ZX835SesoOIvDdtGUcMQJdY40eDPgbM5i0gOmKBgvq7lNJT50HRkczE3YJRY-qbr6CMdkS-Kwmy2QRNVleRy0-rXJMtSUXz2frO70jBmA9JgeETIFIYVBvUBSDiZtwSugeXIBPoKmqsnytNbZNXjN3zabFlrkeoTTvnVCV1xhq4fUk.5VyILaOLGr4AiDwRRraBBA",
                },
              })
            }
          >
            emulate: plugin started (only user token)
          </Button>

          <Button
            onClick={() =>
              postMessage({
                type: MessageType.Init,
                data: {
                  token:
                    "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..GZBEKBJpKiyRBkoN.aM9MUdwcxQ8QKYcrwPTdtchQLMKZZwYrdO7EGkpcc1VE4ZjLW731GBjkkRE9ekX07hRRb2zOLTTiqw0wk6cIzv7Z4z8nlGj4DgJqq9LQKOk7XoObVXLz1-V05Ipjw1Mln7c0iRht_FGFunRHSsfW-ifKZqiywHmUuTtIp_LlondXJVZ3BsbdavtM4ZX835SesoOIvDdtGUcMQJdY40eDPgbM5i0gOmKBgvq7lNJT50HRkczE3YJRY-qbr6CMdkS-Kwmy2QRNVleRy0-rXJMtSUXz2frO70jBmA9JgeETIFIYVBvUBSDiZtwSugeXIBPoKmqsnytNbZNXjN3zabFlrkeoTTvnVCV1xhq4fUk.5VyILaOLGr4AiDwRRraBBA",
                  organizationId: "ckxxi36d30541ujndn755fii3",
                  projectId: "cky0ly54k0072jmnd5q3fmqrl",
                },
              })
            }
          >
            emulate: plugin started (user token and org/project)
          </Button>

          <div className="border-b border-gray-700 my-2" />

          <Button
            onClick={() =>
              postMessage({
                type: MessageType.ReceiveSelectedNodes,
                data: {
                  nodes: [
                    { id: "0:0", name: "icon-one", size: 16 },
                    { id: "0:1", name: "icon-two", size: 24 },
                  ],
                },
              })
            }
          >
            emulate: figma nodes selected
          </Button>
        </div>
      </div>

      <div className="h-full flex flex-col items-center p-4 flex-grow bg-gray-500">
        <div className="max-w-[300px] flex-grow flex flex-col shadow-lg overflow-hidden">
          <div className="border-b flex items-center border-gray-200 px-1 py-1 rounded-t-[2px] bg-white">
            <div className="p-[8px]">
              <div className="w-[16px] h-[16px] bg-gray-500 rounded-sm"></div>
            </div>
            <span className="text-[#333] font-[600] text-[11px]">Assetier</span>
          </div>

          <div className="flex-grow flex flex-col bg-white">
            <iframe
              ref={frameRef}
              id="plugin-frame"
              className="flex-grow"
              src="http://localhost:1234"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

render(<DebugShell />, document.getElementById("root"));
