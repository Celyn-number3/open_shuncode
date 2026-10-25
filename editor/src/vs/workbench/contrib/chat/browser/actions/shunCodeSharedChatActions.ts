// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { mainWindow } from "../../../../../base/browser/window.js";
import { URI } from "../../../../../base/common/uri.js";
import { ICommandService } from "../../../../../platform/commands/common/commands.js";
import { CommandsRegistry } from "../../../../../platform/commands/common/commands.js";
import { generateUuid } from "../../../../../base/common/uuid.js";
import { revive } from "../../../../../base/common/marshalling.js";
import { INotificationService } from "../../../../../platform/notification/common/notification.js";
import { IChatService } from "../../common/chatService/chatService.js";
import { IChatWidgetService } from "../chat.js";
import { ChatViewPaneTarget } from "../chat.js";
import { IHostService } from "../../../../services/host/browser/host.js";
// src/vs/workbench/contrib/chat/browser/actions/shunCodeSharedChatActions.ts
CommandsRegistry.registerCommand("shuncode.chat.openSharedSession", async (accessor, key3) => {
  if (typeof key3 !== "string" || !/^[a-f0-9]{64}$/.test(key3)) throw new Error("Invalid shared chat key.");
  const commands = accessor.get(ICommandService);
  const chatService = accessor.get(IChatService);
  const widgetService = accessor.get(IChatWidgetService);
  const host = accessor.get(IHostService);
  const notifications = accessor.get(INotificationService);
  const reply = await commands.executeCommand("shuncode.workspaceHub.prepareContinuation", key3);
  if (!reply?.data || !Array.isArray(reply.data.requests)) throw new Error("Shared chat data is unavailable.");
  const resource = URI.parse(reply.sessionResource);
  const existing = chatService.getSession(resource);
  if (existing?.requestInProgress.get()) throw new Error("\u539F\u7A97\u53E3\u4ECD\u5728\u751F\u6210\uFF0C\u8BF7\u7B49\u5F85\u5B8C\u6210\u3002");
  if (existing && reply.wasOwner) {
    await widgetService.openSession(resource, ChatViewPaneTarget);
  } else {
    const data = revive(reply.data);
    const recovered = existing ? {
      ...data,
      sessionId: generateUuid(),
      creationDate: Date.now(),
      customTitle: `${data.customTitle || "\u5171\u4EAB\u804A\u5929"} \xB7 \u6062\u590D`,
      inputState: void 0,
      pendingRequests: void 0
    } : {
      ...data,
      inputState: void 0,
      pendingRequests: void 0
    };
    const ref = chatService.loadSessionFromData(recovered, "ShunCode#sharedChatContinue");
    try {
      await widgetService.openSession(ref.object.sessionResource, ChatViewPaneTarget);
    } finally {
      ref.dispose();
    }
    if (existing) notifications.info("\u5DF2\u4ECE\u5171\u4EAB\u8BB0\u5F55\u6062\u590D\u4E3A\u65B0\u4F1A\u8BDD\uFF0C\u65E7\u4F1A\u8BDD\u4FDD\u6301\u4E0D\u53D8\u3002");
  }
  await host.focus(mainWindow, {
    mode: 2 /* Force */
  });
});
CommandsRegistry.registerCommand("shuncode.chat.focusWindow", async accessor => {
  await accessor.get(IHostService).focus(mainWindow, {
    mode: 2 /* Force */
  });
});
CommandsRegistry.registerCommand("shuncode.chat.ensureSharedSync", accessor => {
  accessor.get(IChatService);
  return true;
});

// src/vs/platform/accessibilitySignal/browser/progressAccessibilitySignalScheduler.ts
export {};
