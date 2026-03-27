import { useEffect, useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Toggle } from "../../components/ui/Toggle";
import toast from "react-hot-toast";
import { useSettingsController } from "../../controllers/settings.controller";
import type { WebhookEvents } from "../../services/settings.service";

const EVENTS = [
  { key: "messages", label: "Incoming messages" },
  { key: "message_status", label: "Message status updates (delivered/read)" },
  { key: "template_status", label: "Template status changes" },
];

export const WebhookSettings = () => {
  const settingsController = useSettingsController();
  const { loadWebhookSettings, saveWebhookSettings } = settingsController;
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [events, setEvents] = useState<WebhookEvents>({
    messages: true,
    message_status: true,
    template_status: false,
  });
  const [initialEvents, setInitialEvents] = useState<WebhookEvents | null>(null);

  const isDirty = useMemo(() => {
    if (!initialEvents) return false;
    return (
      events.messages !== initialEvents.messages ||
      events.message_status !== initialEvents.message_status ||
      events.template_status !== initialEvents.template_status
    );
  }, [events, initialEvents]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const result = await loadWebhookSettings();
      if (result.ok) {
        setWebhookUrl(result.data.webhookUrl);
        setVerifyToken(result.data.verifyToken);
        setEvents(result.data.events);
        setInitialEvents(result.data.events);
      }
      setIsLoading(false);
    };
    void load();
  }, [loadWebhookSettings]);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-[18px_20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] space-y-5">
      <h3 className="font-[Syne,sans-serif] text-[15px] font-semibold text-gray-900">
        Webhook Settings
      </h3>

      {isLoading ? (
        <p className="text-[13px] text-gray-500">Loading webhook settings...</p>
      ) : (
      <>
      <div>
        <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">
          Webhook URL
        </label>
        <div className="flex items-center gap-2">
          <input
            value={webhookUrl}
            readOnly
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 font-mono opacity-65 cursor-default outline-none"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={<Copy size={12} />}
            onClick={() => {
              navigator.clipboard.writeText(webhookUrl);
              toast.success("Copied!");
            }}
          >
            Copy
          </Button>
        </div>
        <p className="text-[11.5px] text-gray-400 mt-1.5">
          This URL is read-only. Register it in your Meta App Dashboard.
        </p>
      </div>

      <div>
        <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">
          Verify Token
        </label>
        <input
          readOnly
          value={verifyToken}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 font-mono opacity-65 cursor-default outline-none"
        />
      </div>

      <div>
        <p className="text-[12.5px] font-medium text-gray-500 mb-3">
          Subscribed Events
        </p>
        <div className="space-y-3">
          {EVENTS.map((ev) => (
            <div key={ev.key} className="flex items-center justify-between">
              <span className="text-[13.5px] text-gray-700">{ev.label}</span>
              <Toggle
                checked={events[ev.key as keyof typeof events]}
                onChange={(v) => setEvents((p) => ({ ...p, [ev.key]: v }))}
                disabled={!isEditing}
              />
            </div>
          ))}
        </div>
      </div>
      </>
      )}

      <div className="pt-2 border-t border-gray-100 flex items-center gap-2.5">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} disabled={isLoading}>
            Edit
          </Button>
        ) : (
          <>
            <Button
              loading={isSaving}
              disabled={!isDirty}
              onClick={async () => {
                setIsSaving(true);
                const result = await saveWebhookSettings({ events });
                if (result.ok) {
                  setEvents(result.data.events);
                  setInitialEvents(result.data.events);
                  setIsEditing(false);
                }
                setIsSaving(false);
              }}
            >
              Save Settings
            </Button>
            <Button
              variant="ghost"
              disabled={isSaving}
              onClick={() => {
                if (initialEvents) setEvents(initialEvents);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
