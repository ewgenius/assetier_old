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
    className="inline-flex items-center rounded border border-transparent bg-gray-700 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-gray-800"
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
  const [accountId, setAccountId] = useState(
    localStorage.getItem("assetier.accountId") || ""
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
    <div className="flex h-full w-full">
      <div className="flex h-full min-w-[320px] flex-col bg-gray-900 text-gray-200">
        <div className="border-b border-gray-700 p-4">Plugin controls</div>

        <div className="flex max-w-sm flex-grow flex-col gap-2 p-4">
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
                  accountId: "ckxxi36d30541ujndn755fii3",
                  projectId: "cky0ly54k0072jmnd5q3fmqrl",
                },
              })
            }
          >
            emulate: plugin started (user token and account/project)
          </Button>

          <div className="my-2 border-b border-gray-700" />

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

      <div className="flex h-full flex-grow flex-col items-center bg-gray-500 p-4">
        <div className="flex max-w-[300px] flex-grow flex-col overflow-hidden shadow-lg">
          <div className="flex items-center rounded-t-[2px] border-b border-gray-200 bg-white px-1 py-1">
            <div className="p-[8px]">
              <div className="h-[16px] w-[16px] rounded-sm bg-gray-500"></div>
            </div>
            <span className="text-[11px] font-[600] text-[#333]">Assetier</span>
          </div>

          <div className="flex flex-grow flex-col bg-white">
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
